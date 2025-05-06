const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refresh', 'verification', 'passwordReset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Automatically delete documents after 7 days
  }
});

// Add index for faster token lookups
tokenSchema.index({ userId: 1, type: 1 });
tokenSchema.index({ token: 1, type: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;