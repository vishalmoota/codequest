const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room: { 
    type: String, 
    required: true, 
    default: 'general',
    enum: ['general', 'javascript', 'python', 'project-help', 'react', 'doubts', 'memes']
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    sparse: true
  },
  username: { 
    type: String, 
    required: true,
    trim: true
  },
  avatar: { 
    type: String, 
    default: '🧑‍💻' 
  },
  rank: { 
    type: String, 
    default: 'Bronze',
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'System']
  },
  text: { 
    type: String, 
    required: true, 
    maxlength: 500,
    trim: true
  },
  type: { 
    type: String, 
    enum: ['message', 'system', 'join', 'leave'], 
    default: 'message' 
  },
}, { timestamps: true });

// Indexes for efficient queries
chatMessageSchema.index({ room: 1, createdAt: -1 });
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ createdAt: -1 });

// Keep only last 200 messages per room in production (optional cleanup)
chatMessageSchema.index({ room: 1, createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
