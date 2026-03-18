import mongoose from "mongoose";


const clientSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    // required: true
  },

  clientName: String,
  phone: String,
  email: String,
  address: String,

  notes: String

}, { timestamps: true });

export default mongoose.model("Client", clientSchema);