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