const sambanovaService = require('./sambanovaService');
const { logger } = require('../utils/logger');

// Generate follow-up questions based on conversation history
const generateFollowupQuestions = async (conversationHistory, lastResponse) => {
  try {
    // Create a prompt for generating follow-up questions
    const messages = [
      {
        role: 'system',
        content: `You are an AI assistant that generates follow-up questions based on a conversation. 
        Generate 3 relevant follow-up questions that would naturally continue the conversation.
        Return ONLY the questions as a JSON array of strings, with no additional text.
        Example format: ["Question 1?", "Question 2?", "Question 3?"]`
      },
      {
        role: 'user',
        content: `Here is the conversation history:
        ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        Last response: ${lastResponse}
        
        Generate 3 follow-up questions based on this conversation.`
      }
    ];

    // Call SambaNova API to generate follow-up questions
    const response = await sambanovaService.generateResponse({
      model: 'sambanova/llama-3-8b-instruct', // Use a smaller model for efficiency
      messages,
      temperature: 0.7,
      max_tokens: 256
    });

    // Parse the response to extract questions
    try {
      // Try to parse as JSON
      const questions = JSON.parse(response.completion);
      return Array.isArray(questions) ? questions.slice(0, 3) : [];
    } catch (parseError) {
      // If parsing fails, try to extract questions using regex
      const questionRegex = /"([^"]+\?)"|\d+\.\s+([^"]+\?)/g;
      const matches = [...response.completion.matchAll(questionRegex)];
      const questions = matches
        .map(match => match[1] || match[2])
        .filter(Boolean)
        .slice(0, 3);
      
      return questions;
    }
  } catch (error) {
    logger.error('Error generating follow-up questions:', error);
    return []; // Return empty array on error
  }
};

module.exports = {
  generateFollowupQuestions
};