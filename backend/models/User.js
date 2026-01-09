const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  regNo: { type: String, required: true, index: true },
  role: { type: String, required: true },
  faculty: String,
  department: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
