# AI Agent Platform with SambaNova Integration

A Node.js-based platform for creating and managing AI agents powered by SambaNova's language models. This platform allows users to create custom AI agents with different capabilities, manage conversations, and integrate with knowledge bases.

## Features

- **AI Agent Management**: Create, configure, and manage AI agents with different models, parameters, and capabilities
- **Conversation Management**: Start and manage conversations with AI agents
- **Knowledge Base Integration**: Create and manage knowledge bases to enhance AI responses with domain-specific knowledge
- **Web Search Integration**: Enable agents to search the web for up-to-date information
- **Follow-up Questions**: Automatically generate relevant follow-up questions to continue conversations
- **User Authentication**: Secure user authentication and authorization system

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: SambaNova API for language models and embeddings
- **Authentication**: JWT-based authentication
- **Logging**: Winston logger

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- SambaNova API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-agent-platform.git
   cd ai-agent-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values.

5. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user information

### Agents

- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create a new agent
- `GET /api/agents/:id` - Get a specific agent
- `PUT /api/agents/:id` - Update an agent
- `DELETE /api/agents/:id` - Delete an agent
- `GET /api/agents/models` - Get available AI models

### Conversations

- `GET /api/conversations` - Get all conversations
- `POST /api/conversations` - Create a new conversation
- `GET /api/conversations/:id` - Get a specific conversation
- `DELETE /api/conversations/:id` - Delete a conversation
- `POST /api/conversations/:id/messages` - Send a message in a conversation
- `PUT /api/conversations/:id/title` - Update conversation title

### Knowledge Bases

- `GET /api/knowledge-bases` - Get all knowledge bases
- `POST /api/knowledge-bases` - Create a new knowledge base
- `GET /api/knowledge-bases/:id` - Get a specific knowledge base
- `PUT /api/knowledge-bases/:id` - Update a knowledge base
- `DELETE /api/knowledge-bases/:id` - Delete a knowledge base
- `POST /api/knowledge-bases/:id/documents` - Add a document to a knowledge base
- `PUT /api/knowledge-bases/:id/documents/:documentId` - Update a document
- `DELETE /api/knowledge-bases/:id/documents/:documentId` - Remove a document
- `POST /api/knowledge-bases/:id/generate-embeddings` - Generate embeddings for all documents

## SambaNova AI Models

This platform integrates with SambaNova's AI cloud services, providing access to a variety of powerful language models:

### Chat Models

- **Llama 3 Models**
  - `sambanova/llama-3-8b-instruct` - Smaller Llama 3 model optimized for instruction following
  - `sambanova/llama-3-70b-instruct` - Powerful Llama 3 model with 70B parameters

- **Claude 3 Models**
  - `sambanova/claude-3-opus` - Most powerful Claude model for complex tasks
  - `sambanova/claude-3-sonnet` - Balanced Claude model for most use cases
  - `sambanova/claude-3-haiku` - Fastest and most efficient Claude model

- **Other Models**
  - `sambanova/mixtral-8x7b-instruct` - Mixture of experts model optimized for instruction following
  - `sambanova/falcon-40b-instruct` - Falcon model optimized for instruction following
  - `sambanova/pythia-12b` - Pythia model optimized for general use cases
  - `sambanova/gemma-7b-instruct` - Google's Gemma model optimized for instruction following
  - `sambanova/gemma-2b-instruct` - Smaller Gemma model for efficient deployment
  - `sambanova/command-r` - Cohere's Command model for reasoning tasks
  - `sambanova/command-r-plus` - Enhanced version of Cohere's Command model

### Embedding Models

- `sambanova/e5-large-v2` - E5 large embedding model for text similarity
- `sambanova/bge-large-en` - BGE large English embedding model

## Environment Variables

The following environment variables need to be set in your `.env` file:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-agent-platform

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d

# SambaNova AI API Configuration
SAMBANOVA_API_KEY=your_sambanova_api_key
SAMBANOVA_API_URL=https://api.sambanova.net/api

# Web Search API (e.g., Serper or similar)
SEARCH_API_KEY=your_search_api_key
SEARCH_API_URL=https://serpapi.com/search
SEARCH_ENGINE_ID=your_search_engine_id

# Logging Configuration
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
