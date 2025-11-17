import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  indexNumber: { type: String, required: true },
  subject: { type: String, default: "Unknown" },
  grade: { type: String, required: true },
  uploadedBy: { type: String, default: "Staff" },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);
