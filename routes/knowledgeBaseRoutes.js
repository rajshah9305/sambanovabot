const express = require('express');
const router = express.Router();
const {
  createKnowledgeBase,
  getKnowledgeBases,
  getKnowledgeBaseById,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  addDocument,
  updateDocument,
  removeDocument,
  generateEmbeddings
} = require('../controllers/knowledgeBaseController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Knowledge base routes
router.route('/')
  .get(getKnowledgeBases)
  .post(createKnowledgeBase);

router.route('/:id')
  .get(getKnowledgeBaseById)
  .put(updateKnowledgeBase)
  .delete(deleteKnowledgeBase);

router.route('/:id/documents')
  .post(addDocument);

router.route('/:id/documents/:documentId')
  .put(updateDocument)
  .delete(removeDocument);

router.route('/:id/generate-embeddings')
  .post(generateEmbeddings);

module.exports = router;
