const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String},
  isLoggedIn: { type: Boolean, default: false },
  otp: { type: String },
});

// Create the User model
const User = mongoose.model('Users', UserSchema);

module.exports = User;