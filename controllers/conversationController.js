const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Agent = require('../models/Agent');
const { ApiError } = require('../utils/errorHandler');
const sambanovaService = require('../services/sambanovaService');
const webSearchService = require('../services/webSearchService');
const memoryService = require('../services/memoryService');
const followupService = require('../services/followupService');
const { logger } = require('../utils/logger');

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Private
const createConversation = asyncHandler(async (req, res) => {
  const { agentId, message } = req.body;

  // Check if agent exists
  const agent = await Agent.findById(agentId);
  if (!agent) {
    throw new ApiError('Agent not found', 404);
  }

  // Check access to agent
  if (agent.creator.toString() !== req.user.id && !agent.isPublic) {
    throw new ApiError('Not authorized to use this agent', 403);
  }

  // Create system message with agent instructions
  const systemMessage = {
    role: 'system',
    content: agent.instructions,
    timestamp: new Date()
  };

  // Create user message
  const userMessage = {
    role: 'user',
    content: message,
    timestamp: new Date()
  };

  // Create new conversation with initial messages
  const conversation = await Conversation.create({
    agent: agentId,
    user: req.user.id,
    messages: [systemMessage, userMessage]
  });

  // Process the message with the AI model to get a response
  const aiResponse = await processMessage(conversation, agent);

  res.status(201).json({
    status: 'success',
    data: aiResponse
  });
});

// @desc    Get all conversations for a user
// @route   GET /api/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user.id })
    .populate('agent', 'name description')
    .sort('-updatedAt');

  res.status(200).json({
    status: 'success',
    count: conversations.length,
    data: conversations
  });
});

// @desc    Get single conversation
// @route   GET /api/conversations/:id
// @access  Private
const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('agent', 'name description instructions model temperature maxTokens enableWebSearch enableFollowupQuestions');

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  // Check if conversation belongs to user
  if (conversation.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized to access this conversation', 403);
  }

  res.status(200).json({
    status: 'success',
    data: conversation
  });
});

// @desc    Send message to conversation
// @route   POST /api/conversations/:id/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  // Find conversation
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  // Check if conversation belongs to user
  if (conversation.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized to access this conversation', 403);
  }

  // Get agent details
  const agent = await Agent.findById(conversation.agent);

  if (!agent) {
    throw new ApiError('Agent not found', 404);
  }

  // Add user message to conversation
  conversation.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });

  await conversation.save();

  // Process the message with the AI model to get a response
  const aiResponse = await processMessage(conversation, agent);

  res.status(200).json({
    status: 'success',
    data: aiResponse
  });
});

// @desc    Delete conversation
// @route   DELETE /api/conversations/:id
// @access  Private
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  // Check if conversation belongs to user
  if (conversation.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized to delete this conversation', 403);
  }

  await conversation.deleteOne();

  res.status(200).json({
    status: 'success',
    data: {}
  });
});

// @desc    Update conversation title
// @route   PUT /api/conversations/:id/title
// @access  Private
const updateConversationTitle = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError('Title is required', 400);
  }

  const conversation = await Conversation.findById(req.params.id);

  if (!conversation) {
    throw new ApiError('Conversation not found', 404);
  }

  // Check if conversation belongs to user
  if (conversation.user.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this conversation', 403);
  }

  conversation.title = title;
  await conversation.save();

  res.status(200).json({
    status: 'success',
    data: conversation
  });
});

// Process message with AI model and generate response
const processMessage = async (conversation, agent) => {
  try {
    const startTime = Date.now();

    // Prepare conversation history for the AI model
    const conversationHistory = memoryService.prepareConversationHistory(conversation);

    // Initialize metadata for the AI response
    const metadata = {
      webSearch: {
        used: false,
        results: []
      },
      knowledgeBase: {
        used: false,
        documents: []
      },
      followupQuestions: [],
      modelInfo: {
        model: agent.model,
        temperature: agent.temperature,
        maxTokens: agent.maxTokens,
        processingTime: 0,
        tokenUsage: {
          prompt: 0,
          completion: 0,
          total: 0
        }
      }
    };

    // Get the latest user message
    const latestUserMessage = conversation.messages
      .filter(msg => msg.role === 'user')
      .pop();

    // Perform web search if enabled
    if (agent.enableWebSearch) {
      const searchResults = await webSearchService.performSearch(latestUserMessage.content);

      if (searchResults && searchResults.length > 0) {
        metadata.webSearch.used = true;
        metadata.webSearch.results = searchResults;

        // Add search results to the context
        const searchContext = `Web search results for "${latestUserMessage.content}":\n\n` +
          searchResults.map((result, index) =>
            `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}`
          ).join('\n\n');

        // Add search context as a system message
        conversation.messages.push({
          role: 'system',
          content: `Use the following web search results to help answer the user's question:\n\n${searchContext}`,
          timestamp: new Date()
        });

        await conversation.save();
      }
    }

    // Query knowledge bases if any are attached to the agent
    if (agent.knowledgeBases && agent.knowledgeBases.length > 0) {
      const relevantDocuments = await memoryService.queryKnowledgeBases(
        latestUserMessage.content,
        agent.knowledgeBases
      );

      if (relevantDocuments && relevantDocuments.length > 0) {
        metadata.knowledgeBase.used = true;
        metadata.knowledgeBase.documents = relevantDocuments.map(doc => doc.id);

        // Add knowledge base results to the context
        const kbContext = `Relevant information from knowledge base:\n\n` +
          relevantDocuments.map((doc, index) =>
            `[${index + 1}] ${doc.title}\n${doc.content}\nSource: ${doc.knowledgeBase.name}`
          ).join('\n\n');

        // Add knowledge base context as a system message
        conversation.messages.push({
          role: 'system',
          content: `Use the following information from the knowledge base to help answer the user's question:\n\n${kbContext}`,
          timestamp: new Date()
        });

        await conversation.save();
      }
    }

    // Prepare messages for the AI model
    const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Call SambaNova API to generate response
    const response = await sambanovaService.generateResponse({
      model: agent.model,
      messages,
      temperature: agent.temperature,
      max_tokens: agent.maxTokens,
      allowNSFW: agent.allowNSFW,
      nsfwCategories: agent.nsfwCategories
    });

    // Update token usage in metadata
    if (response.usage) {
      metadata.modelInfo.tokenUsage = {
        prompt: response.usage.prompt_tokens || 0,
        completion: response.usage.completion_tokens || 0,
        total: response.usage.total_tokens || 0
      };
    }

    // Generate follow-up questions if enabled
    if (agent.enableFollowupQuestions) {
      const followupQuestions = await followupService.generateFollowupQuestions(
        conversationHistory,
        response.completion
      );

      if (followupQuestions && followupQuestions.length > 0) {
        metadata.followupQuestions = followupQuestions;
      }
    }

    // Calculate processing time
    metadata.modelInfo.processingTime = Date.now() - startTime;

    // Add AI response to conversation
    const aiMessage = {
      role: 'assistant',
      content: response.completion,
      timestamp: new Date(),
      metadata
    };

    conversation.messages.push(aiMessage);
    await conversation.save();

    return {
      message: aiMessage,
      conversation: {
        id: conversation._id,
        title: conversation.title
      }
    };
  } catch (error) {
    logger.error('Error processing message:', error);
    throw new ApiError(`Failed to process message: ${error.message}`, 500);
  }
};

module.exports = {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  deleteConversation,
  updateConversationTitle
};