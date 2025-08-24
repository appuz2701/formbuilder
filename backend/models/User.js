const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  airtableUserId: {
    type: String,
    required: true,
    unique: true
  },
  airtableAccessToken: {
    type: String,
    required: true
  },
  airtableRefreshToken: {
    type: String
  },
  airtableTokenExpiresAt: {
    type: Date
  },
  profile: {
    name: String,
    avatarUrl: String,
    airtableUsername: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ airtableUserId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

userSchema.methods.isTokenExpired = function() {
  if (!this.airtableTokenExpiresAt) return false;
  return new Date() > this.airtableTokenExpiresAt;
};

userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

userSchema.statics.findByAirtableUserId = function(airtableUserId) {
  return this.findOne({ airtableUserId });
};

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.airtableAccessToken;
  delete userObject.airtableRefreshToken;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
