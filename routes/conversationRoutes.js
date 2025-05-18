const express = require('express');
const router = express.Router();
const {
  createConversation,
  getConversations,
  getConversationById,
  sendMessage,
  deleteConversation,
  updateConversationTitle
} = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// Conversation routes
router.route('/')
  .get(getConversations)
  .post(createConversation);

router.route('/:id')
  .get(getConversationById)
  .delete(deleteConversation);

router.route('/:id/messages')
  .post(sendMessage);

router.route('/:id/title')
  .put(updateConversationTitle);

module.exports = router;
