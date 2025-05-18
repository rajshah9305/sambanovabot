import api from './api';

// Get all agents
export const getAgents = async () => {
  const response = await api.get('/agents');
  return response.data;
};

// Get agent by ID
export const getAgentById = async (id) => {
  const response = await api.get(`/agents/${id}`);
  return response.data;
};

// Create a new agent
export const createAgent = async (agentData) => {
  const response = await api.post('/agents', agentData);
  return response.data;
};

// Update an agent
export const updateAgent = async (id, agentData) => {
  const response = await api.put(`/agents/${id}`, agentData);
  return response.data;
};

// Delete an agent
export const deleteAgent = async (id) => {
  const response = await api.delete(`/agents/${id}`);
  return response.data;
};

// Get available models
export const getAvailableModels = async () => {
  const response = await api.get('/agents/models');
  return response.data;
};
