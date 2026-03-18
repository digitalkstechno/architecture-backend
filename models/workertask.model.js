const workerAssignmentSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },

  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });