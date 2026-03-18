import mongoose from "mongoose";

const projectUpdateSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  stageId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage" },

  description: String,

  images: [String],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });


export default mongoose.model("Projectupdate", projectUpdateSchema);