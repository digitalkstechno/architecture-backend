import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  tenantId: ObjectId,
  projectId: ObjectId,

  paidToType: {
    type: String,
    enum: ["USER", "WORKER"]
  },

  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "paidToType"
  },

  amount: Number,

  paymentType: {
    type: String,
    enum: ["SALARY", "ADVANCE", "BONUS"]
  },

  paymentDate: Date
});


export default mongoose.model("Paymentroll", paymentSchema);