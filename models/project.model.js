import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({

  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    // required: true
  },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },

  projectName: String,

  siteAddress: String,

  startDate: Date,
  expectedEndDate: Date,

  budget: Number,

  status: {
    type: String,
    enum: ["PLANNING","ACTIVE","ON_HOLD","COMPLETED"]
  }

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);