import mongoose from "mongoose";

const workerAssignmentSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  workerId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Worker" }],

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  workertask : String,

  taskid  : { type: mongoose.Schema.Types.ObjectId, ref: "Task" },

}, { timestamps: true });


export default mongoose.model("Workertask", workerAssignmentSchema);