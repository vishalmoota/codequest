const mongoose = require('mongoose');

const userProjectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  language: { 
    type: String, 
    enum: ['javascript', 'python'], 
    required: true 
  },
  code: { 
    type: String, 
    default: '' 
  },
  lastOutput: { 
    type: String, 
    default: '' 
  },
  xpAwarded: { 
    type: Boolean, 
    default: false 
  },
  runCount: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

userProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserProject', userProjectSchema);
