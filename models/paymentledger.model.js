import mongoose from "mongoose";

const paymentLedgerSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankBrief",
      required: true,
    },

    transactionType: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },

    source: {
      type: String,
      enum: ["Client Advance", "Labor Payment", "Material Expense", "Supervisor Salary", "Final Payment", "Other"],
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