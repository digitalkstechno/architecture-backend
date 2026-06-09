const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    documentType: { type: String, enum: ["CAD", "PDF", "Render", "Image", "Other"], default: "Other" },
    fileUrl: { type: String, required: true },
    version: { type: String, default: "1.0" },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
