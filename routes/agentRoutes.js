const express = require('express');
const router = express.Router();
const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAvailableModels
} = require('../controllers/agentController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get available models
router.get('/models', getAvailableModels);

router.route('/')
  .post(createAgent)
  .get(getAgents);

router.route('/:id')
  .get(getAgentById)
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;