import mongoose from "mongoose";

const paymentLedgerSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    transactionType: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    referenceNo: {
      type: String,
    },

    balanceAfter: {
      type: Number,
    }
  },
  { timestamps: true }
);

export default mongoose.model("PaymentLedger", paymentLedgerSchema);