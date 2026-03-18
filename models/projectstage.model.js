import mongoose from "mongoose";


const projectStageSchema = new mongoose.Schema({

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  stageName: String,

  order: Number,

  status: {
    type: String,
    enum: ["PENDING","IN_PROGRESS","COMPLETED"]
  }

}, { timestamps: true });

export default mongoose.model("ProjectStage", projectStageSchema);