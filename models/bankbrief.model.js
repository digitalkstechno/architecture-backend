import mongoose from "mongoose";

const bankBriefSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    bankName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    ifscCode: {
      type: String,
    },

    branchName: {
      type: String,
    },

    openingBalance: {
      type: Number,
      default: 0,
    },

    currentBalance: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("BankBrief", bankBriefSchema);