const axios = require('axios');
const { logger } = require('../utils/logger');

// SambaNova API client
const sambanovaClient = axios.create({
  baseURL: process.env.SAMBANOVA_API_URL || 'https://api.sambanova.net/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`
  }
});

// Available SambaNova models
const SAMBANOVA_MODELS = {
  // LLM Models
  'sambanova/llama-3-8b-instruct': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Smaller Llama 3 model optimized for instruction following'
  },
  'sambanova/llama-3-70b-instruct': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Powerful Llama 3 model with 70B parameters'
  },
  'sambanova/falcon-40b-instruct': {
    type: 'chat',
    maxTokens: 2048,
    description: 'Falcon model optimized for instruction following'
  },
  'sambanova/pythia-12b': {
    type: 'chat',
    maxTokens: 2048,
    description: 'Pythia model optimized for general use cases'
  },
  'sambanova/mixtral-8x7b-instruct': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Mixture of experts model optimized for instruction following'
  },
  'sambanova/claude-3-opus': {
    type: 'chat',
    maxTokens: 8192,
    description: 'Most powerful Claude model for complex tasks'
  },
  'sambanova/claude-3-sonnet': {
    type: 'chat',
    maxTokens: 8192,
    description: 'Balanced Claude model for most use cases'
  },
  'sambanova/claude-3-haiku': {
    type: 'chat',
    maxTokens: 8192,
    description: 'Fastest and most efficient Claude model'
  },
  'sambanova/gemma-7b-instruct': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Google\'s Gemma model optimized for instruction following'
  },
  'sambanova/gemma-2b-instruct': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Smaller Gemma model for efficient deployment'
  },
  'sambanova/command-r': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Cohere\'s Command model for reasoning tasks'
  },
  'sambanova/command-r-plus': {
    type: 'chat',
    maxTokens: 4096,
    description: 'Enhanced version of Cohere\'s Command model'
  },
  // Embedding Models
  'sambanova/e5-large-v2': {
    type: 'embedding',
    dimensions: 1024,
    description: 'E5 large embedding model for text similarity'
  },
  'sambanova/bge-large-en': {
    type: 'embedding',
    dimensions: 1024,
    description: 'BGE large English embedding model'
  }
};

// Get model information
const getModelInfo = (modelId) => {
  const modelInfo = SAMBANOVA_MODELS[modelId];
  if (!modelInfo) {
    logger.warn(`Unknown model: ${modelId}, using default settings`);
    return {
      type: 'chat',
      maxTokens: 2048,
      description: 'Unknown model'
    };
  }
  return modelInfo;
};

// Generate response using SambaNova chat completion API
const generateResponse = async (params) => {
  try {
    const modelInfo = getModelInfo(params.model);

    // Validate model type
    if (modelInfo.type !== 'chat') {
      throw new Error(`Model ${params.model} is not a chat model`);
    }

    // Ensure max_tokens doesn't exceed model's limit
    const max_tokens = Math.min(
      params.max_tokens || 2048,
      modelInfo.maxTokens
    );

    // Prepare request payload
    const requestPayload = {
      model: params.model,
      messages: params.messages,
      temperature: params.temperature || 0.7,
      max_tokens: max_tokens,
      stream: false
    };

    // Add NSFW settings if provided
    if (params.allowNSFW) {
      requestPayload.safety_settings = {
        // Set safety settings based on allowed NSFW categories
        // Lower threshold values (closer to 0) allow more content through
        // Higher values (closer to 1) are more restrictive
        content_filter: {
          enabled: true,
          // Default to moderate filtering
          adult_content: 0.7,
          hate_speech: 0.7,
          violence: 0.7,
          self_harm: 0.9, // Keep this high for safety
          sexual_content: 0.7,
          harassment: 0.7,
          shock_content: 0.7,
          illegal_activity: 0.9 // Keep this high for safety
        }
      };

      // Adjust thresholds for allowed NSFW categories
      if (params.nsfwCategories && Array.isArray(params.nsfwCategories)) {
        params.nsfwCategories.forEach(category => {
          if (requestPayload.safety_settings.content_filter[category] !== undefined) {
            // Lower the threshold for allowed categories (0.3 is permissive but not completely off)
            requestPayload.safety_settings.content_filter[category] = 0.3;
          }
        });
      }
    }

    const response = await sambanovaClient.post('/chat/completions', requestPayload);

    return {
      completion: response.data.choices[0].message.content,
      usage: response.data.usage
    };
  } catch (error) {
    logger.error('SambaNova API error:', error.response?.data || error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

// Generate embedding using SambaNova embedding API
const generateEmbedding = async (params) => {
  try {
    const modelInfo = getModelInfo(params.model);

    // Validate model type
    if (modelInfo.type !== 'embedding') {
      throw new Error(`Model ${params.model} is not an embedding model`);
    }

    const response = await sambanovaClient.post('/embeddings', {
      model: params.model,
      input: params.text
    });

    return {
      embedding: response.data.data[0].embedding,
      usage: response.data.usage
    };
  } catch (error) {
    logger.error('SambaNova embedding API error:', error.response?.data || error.message);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
};

// List available models
const listModels = () => {
  return Object.entries(SAMBANOVA_MODELS).map(([id, info]) => ({
    id,
    ...info
  }));
};

module.exports = {
  generateResponse,
  generateEmbedding,
  listModels,
  SAMBANOVA_MODELS
};