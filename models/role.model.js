import mongoose from "mongoose";

const roleScehma = new mongoose.Schema({
    roleName: {
      type: String,
      require: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      // required: true,
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
},  { timestamps: true },);

export default mongoose.model("Role", roleScehma);
