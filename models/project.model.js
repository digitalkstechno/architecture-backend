import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      // required: true
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    projectName: String,

    siteAddress: String,

    startDate: Date,
    expectedEndDate: Date,

    budget: Number,

    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"],
    },

    totalReceived: { type: Number, default: 0 }, // client se kitna paisa aaya
    totalExpense: { type: Number, default: 0 }, // kitna kharch hua
    balance: { type: Number, default: 0 }, // remaining
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
