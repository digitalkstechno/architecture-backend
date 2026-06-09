const mongoose = require("mongoose");

const materialRequestSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materialName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "units" },
    status: { type: String, enum: ["Pending", "Approved", "Ordered", "Delivered"], default: "Pending" },
    dateNeeded: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaterialRequest", materialRequestSchema);
