const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema(
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
    documents: [
      {
        title: {
          type: String,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        source: {
          type: String,
          default: 'manual'
        },
        embedding: {
          type: [Number],
          select: false // Don't return embeddings by default
        },
        metadata: {
          type: Object,
          default: {}
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    embeddingModel: {
      type: String,
      default: 'sambanova/e5-large-v2'
    },
    isPublic: {
      type: Boolean,
      default: false
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

// Method to remove a document by ID
KnowledgeBaseSchema.methods.removeDocument = async function(documentId) {
  this.documents = this.documents.filter(doc => doc._id.toString() !== documentId);
  return this.save();
};

// Method to update a document by ID
KnowledgeBaseSchema.methods.updateDocument = async function(documentId, updates) {
  const docIndex = this.documents.findIndex(doc => doc._id.toString() === documentId);
  if (docIndex === -1) return null;

  Object.keys(updates).forEach(key => {
    this.documents[docIndex][key] = updates[key];
  });

  this.documents[docIndex].updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
