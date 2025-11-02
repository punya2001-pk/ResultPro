const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  staffId: { type: String, trim: true },
  department: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
});

module.exports =
  mongoose.models.Staff || mongoose.model("Staff", staffSchema);
