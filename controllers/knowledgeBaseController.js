const asyncHandler = require('express-async-handler');
const KnowledgeBase = require('../models/KnowledgeBase');
const { ApiError } = require('../utils/errorHandler');
const sambanovaService = require('../services/sambanovaService');
const { logger } = require('../utils/logger');

// @desc    Create a new knowledge base
// @route   POST /api/knowledge-bases
// @access  Private
const createKnowledgeBase = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    documents,
    isPublic,
    embeddingModel
  } = req.body;

  // Create new knowledge base
  const knowledgeBase = await KnowledgeBase.create({
    name,
    description,
    documents: documents || [],
    isPublic: isPublic || false,
    embeddingModel: embeddingModel || 'sambanova/e5-large-v2',
    creator: req.user.id
  });

  // Generate embeddings for initial documents if any
  if (documents && documents.length > 0) {
    await generateEmbeddingsForDocuments(knowledgeBase);
  }

  res.status(201).json({
    status: 'success',
    data: knowledgeBase
  });
});

// @desc    Get all knowledge bases for a user
// @route   GET /api/knowledge-bases
// @access  Private
const getKnowledgeBases = asyncHandler(async (req, res) => {
  // Get user's knowledge bases and public ones
  const knowledgeBases = await KnowledgeBase.find({
    $or: [
      { creator: req.user.id },
      { isPublic: true }
    ]
  }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    count: knowledgeBases.length,
    data: knowledgeBases
  });
});

// @desc    Get single knowledge base
// @route   GET /api/knowledge-bases/:id
// @access  Private
const getKnowledgeBaseById = asyncHandler(async (req, res) => {
  const knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user or is public
  if (knowledgeBase.creator.toString() !== req.user.id && !knowledgeBase.isPublic) {
    throw new ApiError('Not authorized to access this knowledge base', 403);
  }

  res.status(200).json({
    status: 'success',
    data: knowledgeBase
  });
});

// @desc    Update knowledge base
// @route   PUT /api/knowledge-bases/:id
// @access  Private
const updateKnowledgeBase = asyncHandler(async (req, res) => {
  let knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this knowledge base', 403);
  }

  // Don't allow direct update of documents through this endpoint
  if (req.body.documents) {
    delete req.body.documents;
  }

  knowledgeBase = await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: knowledgeBase
  });
});

// @desc    Delete knowledge base
// @route   DELETE /api/knowledge-bases/:id
// @access  Private
const deleteKnowledgeBase = asyncHandler(async (req, res) => {
  const knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to delete this knowledge base', 403);
  }

  await knowledgeBase.deleteOne();

  res.status(200).json({
    status: 'success',
    data: {}
  });
});

// @desc    Add document to knowledge base
// @route   POST /api/knowledge-bases/:id/documents
// @access  Private
const addDocument = asyncHandler(async (req, res) => {
  const { title, content, source, metadata } = req.body;

  if (!title || !content) {
    throw new ApiError('Title and content are required', 400);
  }

  const knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this knowledge base', 403);
  }

  // Create new document
  const newDocument = {
    title,
    content,
    source: source || 'manual',
    metadata: metadata || {},
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Generate embedding for the document
  const embedding = await generateEmbedding(content, knowledgeBase.embeddingModel);
  if (embedding) {
    newDocument.embedding = embedding;
  }

  // Add document to knowledge base
  knowledgeBase.documents.push(newDocument);
  await knowledgeBase.save();

  res.status(201).json({
    status: 'success',
    data: {
      document: {
        ...newDocument,
        embedding: undefined // Don't return the embedding
      }
    }
  });
});

// @desc    Remove document from knowledge base
// @route   DELETE /api/knowledge-bases/:id/documents/:documentId
// @access  Private
const removeDocument = asyncHandler(async (req, res) => {
  const knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this knowledge base', 403);
  }

  // Remove document
  await knowledgeBase.removeDocument(req.params.documentId);

  res.status(200).json({
    status: 'success',
    data: {}
  });
});

// @desc    Update document in knowledge base
// @route   PUT /api/knowledge-bases/:id/documents/:documentId
// @access  Private
const updateDocument = asyncHandler(async (req, res) => {
  const { title, content, metadata } = req.body;
  const { id: knowledgeBaseId, documentId } = req.params;

  const knowledgeBase = await KnowledgeBase.findById(knowledgeBaseId);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this knowledge base', 403);
  }

  // Prepare update data
  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (metadata) updateData.metadata = metadata;

  // Generate new embedding if content changed
  if (content) {
    const embedding = await generateEmbedding(content, knowledgeBase.embeddingModel);
    if (embedding) {
      updateData.embedding = embedding;
    }
  }

  // Update document
  const updatedKnowledgeBase = await knowledgeBase.updateDocument(documentId, updateData);

  if (!updatedKnowledgeBase) {
    throw new ApiError('Document not found in the knowledge base', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedKnowledgeBase.documents.find(doc => doc._id.toString() === documentId)
    }
  });
});

// @desc    Generate embeddings for all documents in a knowledge base
// @route   POST /api/knowledge-bases/:id/generate-embeddings
// @access  Private
const generateEmbeddings = asyncHandler(async (req, res) => {
  const knowledgeBase = await KnowledgeBase.findById(req.params.id);

  if (!knowledgeBase) {
    throw new ApiError('Knowledge base not found', 404);
  }

  // Check if knowledge base belongs to user
  if (knowledgeBase.creator.toString() !== req.user.id) {
    throw new ApiError('Not authorized to update this knowledge base', 403);
  }

  // Generate embeddings for all documents
  await generateEmbeddingsForDocuments(knowledgeBase);
  await knowledgeBase.save();

  res.status(200).json({
    status: 'success',
    message: 'Embeddings generated successfully',
    data: {
      documentCount: knowledgeBase.documents.length,
      embeddingsGenerated: knowledgeBase.documents.filter(doc => doc.embedding).length
    }
  });
});

// Helper function to generate embedding for a document
const generateEmbedding = async (text, model) => {
  try {
    // Call SambaNova embedding API
    const response = await sambanovaService.generateEmbedding({
      model: model || 'sambanova/e5-large-v2',
      text
    });

    return response.embedding;
  } catch (error) {
    logger.error('Error generating embedding:', error);
    return null;
  }
};

// Helper function to generate embeddings for all documents in a knowledge base
const generateEmbeddingsForDocuments = async (knowledgeBase) => {
  try {
    // Process documents in batches to avoid rate limits
    const batchSize = 5;
    const model = knowledgeBase.embeddingModel || 'sambanova/e5-large-v2';

    for (let i = 0; i < knowledgeBase.documents.length; i += batchSize) {
      const batch = knowledgeBase.documents.slice(i, i + batchSize);

      // Process batch in parallel
      await Promise.all(batch.map(async (doc, index) => {
        if (!doc.embedding) {
          const embedding = await generateEmbedding(doc.content, model);
          if (embedding) {
            knowledgeBase.documents[i + index].embedding = embedding;
          }
        }
      }));
    }
  } catch (error) {
    logger.error('Error generating embeddings for documents:', error);
  }
};

module.exports = {
  createKnowledgeBase,
  getKnowledgeBases,
  getKnowledgeBaseById,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  addDocument,
  updateDocument,
  removeDocument,
  generateEmbeddings
};
