import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },

  date: Date,

  status: {
    type: String,
    enum: ["PRESENT","ABSENT"]
  },

  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

});



export default mongoose.model("Attendence", attendanceSchema);