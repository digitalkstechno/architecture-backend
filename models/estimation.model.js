  import mongoose from "mongoose";


  const quotationSchema = new mongoose.Schema({

    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },

    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    totalAmount: Number,

    description: String,

    status: {
      type: String,
      enum: ["DRAFT", "NEGOTIATION", "APPROVED", "REJECTED"],
      default: "DRAFT"
    },

    costBreakdown: [
      {
        item: String,
        amount: Number,
        description: String
      }
    ]

  });


  export default mongoose.model("Projectestimation", quotationSchema);