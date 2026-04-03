const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true,
    index: true
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  authorName: { 
    type: String, 
    required: true,
    trim: true
  },
  authorAvatar: { 
    type: String, 
    default: '🧑‍💻' 
  },
  authorRank: { 
    type: String, 
    default: 'Bronze',
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
  },
  text: { 
    type: String, 
    required: true, 
    maxlength: 2000,
    trim: true
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
}, { 
  timestamps: true,
  collection: 'postcomments'
});

// Indexes for efficient queries
postCommentSchema.index({ post: 1, createdAt: 1 });
postCommentSchema.index({ author: 1, createdAt: -1 });
postCommentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PostComment', postCommentSchema);
