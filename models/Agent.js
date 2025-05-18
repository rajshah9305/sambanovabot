const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    instructions: {
      type: String,
      required: [true, 'Please add instructions'],
      maxlength: [10000, 'Instructions cannot be more than 10000 characters']
    },
    model: {
      type: String,
      required: [true, 'Please specify an AI model'],
      enum: [
        'sambanova/llama-3-8b-instruct',
        'sambanova/llama-3-70b-instruct',
        'sambanova/falcon-40b-instruct',
        'sambanova/pythia-12b',
        'sambanova/mixtral-8x7b-instruct',
        'sambanova/claude-3-opus',
        'sambanova/claude-3-sonnet',
        'sambanova/claude-3-haiku',
        'sambanova/gemma-7b-instruct',
        'sambanova/gemma-2b-instruct',
        'sambanova/command-r',
        'sambanova/command-r-plus'
      ],
      validate: {
        validator: function(value) {
          // Dynamically validate against SambaNova models
          try {
            const { SAMBANOVA_MODELS } = require('../services/sambanovaService');
            const modelInfo = SAMBANOVA_MODELS[value];
            return modelInfo && modelInfo.type === 'chat';
          } catch (error) {
            // If there's an error loading the service, fall back to the enum validation
            return true;
          }
        },
        message: props => `${props.value} is not a valid SambaNova chat model`
      }
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: [0, 'Temperature must be at least 0'],
      max: [2, 'Temperature cannot be more than 2']
    },
    maxTokens: {
      type: Number,
      default: 2048,
      min: [1, 'Max tokens must be at least 1'],
      max: [32768, 'Max tokens cannot be more than 32768']
    },
    enableWebSearch: {
      type: Boolean,
      default: false
    },
    enableFollowupQuestions: {
      type: Boolean,
      default: true
    },
    knowledgeBases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KnowledgeBase'
      }
    ],
    isPublic: {
      type: Boolean,
      default: false
    },
    allowNSFW: {
      type: Boolean,
      default: false
    },
    nsfwCategories: {
      type: [String],
      enum: ['adult_content', 'hate_speech', 'violence', 'self_harm', 'sexual_content', 'harassment', 'shock_content', 'illegal_activity'],
      default: []
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Agent', AgentSchema);
