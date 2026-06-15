const mongoose = require("mongoose");

const workingSOPSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    allowedRoles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkingSOP", workingSOPSchema);