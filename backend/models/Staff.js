const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  faculty: { type: String },
  department: { type: String },
  role: { type: String }, // e.g. lecturer
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Staff", StaffSchema);
