const axios = require('axios');
const { logger } = require('../utils/logger');

// Perform web search using a search API
const performSearch = async (query) => {
  try {
    // Check if search API key is configured
    if (!process.env.SEARCH_API_KEY) {
      logger.warn('Web search API key not configured');
      return null;
    }

    // Make request to search API
    const response = await axios.get(process.env.SEARCH_API_URL, {
      params: {
        q: query,
        key: process.env.SEARCH_API_KEY,
        cx: process.env.SEARCH_ENGINE_ID,
        num: 5 // Number of results to return
      }
    });

    // Process and return search results
    if (response.data && response.data.items) {
      return response.data.items.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        source: 'web_search'
      }));
    }

    return [];
  } catch (error) {
    logger.error('Error performing web search:', error);
    return null;
  }
};

module.exports = {
  performSearch
};
