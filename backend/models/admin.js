const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "admin" },
  faculty: String,
});

module.exports = adminSchema;
