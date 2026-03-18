import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

    name: String,

    phone: String,

    skill: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    experienceYears: Number,

    wageType: {
      type: String,
      enum: ["DAILY", "CONTRACT"],
    },

    dailyWage: Number,
  },
  { timestamps: true },
);

export default mongoose.model("Worker", workerSchema);
