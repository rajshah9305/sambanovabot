const KnowledgeBase = require('../models/KnowledgeBase');
const { logger } = require('../utils/logger');

// Prepare conversation history for the AI model
const prepareConversationHistory = (conversation) => {
  // Get the last N messages (excluding system messages)
  const userAssistantMessages = conversation.messages
    .filter(msg => msg.role !== 'system')
    .slice(-10); // Limit to last 10 messages for context window management
  
  return userAssistantMessages;
};

// Calculate vector similarity (cosine similarity)
const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
};

// Query knowledge bases for relevant documents
const queryKnowledgeBases = async (query, knowledgeBaseIds) => {
  try {
    // Get embedding for the query
    const sambanovaService = require('./sambanovaService');
    const queryEmbedding = await sambanovaService.generateEmbedding({
      model: 'sambanova/e5-large-v2',
      text: query
    });

    if (!queryEmbedding || !queryEmbedding.embedding) {
      logger.error('Failed to generate query embedding');
      return [];
    }

    // Find knowledge bases
    const knowledgeBases = await KnowledgeBase.find({
      _id: { $in: knowledgeBaseIds }
    });

    // Search for relevant documents across all knowledge bases
    let relevantDocuments = [];

    for (const kb of knowledgeBases) {
      // Filter documents that have embeddings
      const documentsWithEmbeddings = kb.documents.filter(doc => doc.embedding);
      
      // Calculate similarity scores
      const scoredDocuments = documentsWithEmbeddings.map(doc => {
        const similarity = calculateCosineSimilarity(
          queryEmbedding.embedding,
          doc.embedding
        );
        
        return {
          id: doc._id,
          title: doc.title,
          content: doc.content,
          similarity,
          knowledgeBase: {
            id: kb._id,
            name: kb.name
          }
        };
      });
      
      relevantDocuments = [...relevantDocuments, ...scoredDocuments];
    }
    
    // Sort by similarity and take top results
    const topResults = relevantDocuments
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
    
    return topResults;
  } catch (error) {
    logger.error('Error querying knowledge bases:', error);
    return [];
  }
};

module.exports = {
  prepareConversationHistory,
  queryKnowledgeBases
};