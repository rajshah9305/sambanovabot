const asyncHandler = require('express-async-handler');
const Agent = require('../models/Agent');
const { ApiError } = require('../utils/errorHandler');
const sambanovaService = require('../services/sambanovaService');

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Private
const createAgent = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    instructions,
    model,
    temperature,
    maxTokens,
    enableWebSearch,
    enableFollowupQuestions,
    knowledgeBases,
    isPublic
  } = req.body;

  // Create new agent
  const agent = await Agent.create({
    name,
    description,
    instructions,
    model,
    temperature,
    maxTokens,
    enableWebSearch,
    enableFollowupQuestions,
    knowledgeBases,
    isPublic,
    creator: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: agent
  });
});

// @desc    Get all agents for a user
// @route   GET /api/agents
// @access  Private
const getAgents = asyncHandler(async (req, res) => {
  // Get user's agents and public agents
  const agents = await Agent.find({
    $or: [
      { creator: req.user.id },
      { isPublic: true }
    ]
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    count: agents.length,
    data: agents
  });
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    throw new ApiError('Agent not found', 404);
  }

  // Check if agent belongs to user or is public
  if (agent.creator.toString() !== req.user.id && !agent.isPublic) {
    throw new ApiError('Not authorized to access this agent', 403);
  }

  res.status(200).json({
    status: 'success',
    data: agent
  });
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
const updateAgent = asyncHandler(async (req, res) => {
  let agent = await Agent.findById(req.params.id);

  if (!agent) {
    throw new ApiError('Agent not found', 404);
  }

  // Check if agent belongs to user
  if (agent.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this agent', 403);
  }

  agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: agent
  });
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    throw new ApiError('Agent not found', 404);
  }

  // Check if agent belongs to user
  if (agent.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to delete this agent', 403);
  }

  await agent.deleteOne();

  res.status(200).json({
    status: 'success',
    data: {}
  });
});

// @desc    Get available models
// @route   GET /api/agents/models
// @access  Private
const getAvailableModels = asyncHandler(async (req, res) => {
  // Get models from SambaNova service
  const allModels = sambanovaService.listModels();

  // Filter for chat models only and format for the frontend
  const chatModels = allModels
    .filter(model => model.type === 'chat')
    .map(model => {
      // Extract model name from ID (e.g., 'sambanova/llama-3-8b-instruct' -> 'Llama 3 8B Instruct')
      const nameParts = model.id.split('/')[1].split('-');
      const formattedName = nameParts
        .map(part => {
          // Handle special cases
          if (part === 'llama' || part === 'claude' || part === 'gemma') {
            return part.charAt(0).toUpperCase() + part.slice(1);
          }
          // Handle numbers
          if (!isNaN(part)) {
            return part.toUpperCase();
          }
          // Handle 'instruct' suffix
          if (part === 'instruct') {
            return 'Instruct';
          }
          // Default case
          return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(' ');

      // Estimate price per token based on model size
      // This is just an example - real pricing would come from SambaNova
      let pricePerToken = 0.00001;
      if (model.id.includes('opus')) {
        pricePerToken = 0.00015;
      } else if (model.id.includes('sonnet') || model.id.includes('plus') || model.id.includes('70b')) {
        pricePerToken = 0.00008;
      } else if (model.id.includes('mixtral') || model.id.includes('40b')) {
        pricePerToken = 0.00006;
      } else if (model.id.includes('command-r') || model.id.includes('haiku')) {
        pricePerToken = 0.00003;
      } else if (model.id.includes('12b') || model.id.includes('7b')) {
        pricePerToken = 0.00002;
      }

      return {
        id: model.id,
        name: formattedName,
        description: model.description,
        maxTokens: model.maxTokens,
        pricePerToken
      };
    });

  res.status(200).json({
    status: 'success',
    data: chatModels
  });
});

module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAvailableModels
};