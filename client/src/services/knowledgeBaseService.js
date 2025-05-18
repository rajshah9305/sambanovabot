import api from './api';

// Get all knowledge bases
export const getKnowledgeBases = async () => {
  const response = await api.get('/knowledge-bases');
  return response.data;
};

// Get knowledge base by ID
export const getKnowledgeBaseById = async (id) => {
  const response = await api.get(`/knowledge-bases/${id}`);
  return response.data;
};

// Create a new knowledge base
export const createKnowledgeBase = async (knowledgeBaseData) => {
  const response = await api.post('/knowledge-bases', knowledgeBaseData);
  return response.data;
};

// Update a knowledge base
export const updateKnowledgeBase = async (id, knowledgeBaseData) => {
  const response = await api.put(`/knowledge-bases/${id}`, knowledgeBaseData);
  return response.data;
};

// Delete a knowledge base
export const deleteKnowledgeBase = async (id) => {
  const response = await api.delete(`/knowledge-bases/${id}`);
  return response.data;
};

// Add a document to a knowledge base
export const addDocument = async (knowledgeBaseId, documentData) => {
  const response = await api.post(`/knowledge-bases/${knowledgeBaseId}/documents`, documentData);
  return response.data;
};

// Update a document in a knowledge base
export const updateDocument = async (knowledgeBaseId, documentId, documentData) => {
  const response = await api.put(`/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`, documentData);
  return response.data;
};

// Remove a document from a knowledge base
export const removeDocument = async (knowledgeBaseId, documentId) => {
  const response = await api.delete(`/knowledge-bases/${knowledgeBaseId}/documents/${documentId}`);
  return response.data;
};

// Generate embeddings for all documents in a knowledge base
export const generateEmbeddings = async (knowledgeBaseId) => {
  const response = await api.post(`/knowledge-bases/${knowledgeBaseId}/generate-embeddings`);
  return response.data;
};
