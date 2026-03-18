import mongoose from "mongoose";




const workerPaymentSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },

  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

  amount: Number,

  paymentDate: Date,

  paymentMethod: String

});


export default mongoose.model("Workerpayment", workerPaymentSchema);