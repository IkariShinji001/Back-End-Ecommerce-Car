const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{type: String, unique: true},
  password: String,
  email: {type: String, unique: true},
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: {type: String, default: "user"},
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;