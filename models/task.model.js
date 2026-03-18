import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  stageId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage" },

  title: String,

  description: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["PENDING","IN_PROGRESS","DONE"]
  }

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);

// const taskSchema = new mongoose.Schema({

//   tenantId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Tenant",
//     required: true
//   },

//   projectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Project",
//     required: true
//   },

//   stageId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ProjectStage"
//   },

//   title: String,

//   description: String,

//   // if task assigned to supervisor or architect
//   assignedUser: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   },

//   // if task assigned to workers
//   assignedWorkers: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Worker"
//     }
//   ],

//   status: {
//     type: String,
//     enum: ["PENDING","IN_PROGRESS","DONE"],
//     default: "PENDING"
//   }

// }, { timestamps: true });