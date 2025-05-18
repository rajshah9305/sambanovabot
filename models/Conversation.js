const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'New Conversation'
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['system', 'user', 'assistant'],
          required: true
        },
        content: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        metadata: {
          webSearch: {
            used: Boolean,
            results: [Object]
          },
          knowledgeBase: {
            used: Boolean,
            documents: [String]
          },
          followupQuestions: [String],
          modelInfo: {
            model: String,
            temperature: Number,
            maxTokens: Number,
            processingTime: Number,
            tokenUsage: {
              prompt: Number,
              completion: Number,
              total: Number
            }
          }
        }
      }
    ],
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Update lastActivity timestamp before save
ConversationSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Set conversation title based on first user message if not set
ConversationSchema.pre('save', function(next) {
  if (this.isNew && this.title === 'New Conversation') {
    const userMessages = this.messages.filter(msg => msg.role === 'user');
    if (userMessages.length > 0) {
      const firstUserMessage = userMessages[0].content;
      // Truncate and use as title
      this.title = firstUserMessage.length > 50 
        ? `${firstUserMessage.substring(0, 47)}...` 
        : firstUserMessage;
    }
  }
  next();
});

module.exports = mongoose.model('Conversation', ConversationSchema);
