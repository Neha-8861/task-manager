const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,   // No duplicate usernames
  },
  email: {
    type: String,
    required: true,
    unique: true,   // No duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],  // User roles
    default: 'user',
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
