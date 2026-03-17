import mongoose from "mongoose";

const permissionScehma = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    // required: true,
  },
  permissionName : {
    type: String
  },
  module: {
    type: String,
    require: true,
  },
  actions: [
    {
      type: String,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "SOFT_DELETE"],
    },
  ],
},  { timestamps: true },);

export default mongoose.model("Permission", permissionScehma);
