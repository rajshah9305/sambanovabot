import api from './api';

// Get all conversations
export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

// Get conversation by ID
export const getConversationById = async (id) => {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
};

// Create a new conversation
export const createConversation = async (agentId, message) => {
  const response = await api.post('/conversations', { agentId, message });
  return response.data;
};

// Send a message in a conversation
export const sendMessage = async (conversationId, message) => {
  const response = await api.post(`/conversations/${conversationId}/messages`, { message });
  return response.data;
};

// Update conversation title
export const updateConversationTitle = async (conversationId, title) => {
  const response = await api.put(`/conversations/${conversationId}/title`, { title });
  return response.data;
};

// Delete a conversation
export const deleteConversation = async (id) => {
  const response = await api.delete(`/conversations/${id}`);
  return response.data;
};
