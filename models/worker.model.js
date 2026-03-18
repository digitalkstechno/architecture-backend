const workerSchema = new mongoose.Schema({

  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },

  name: String,

  phone: String,

  skill: String,

  experienceYears: Number,

  wageType: {
    type: String,
    enum: ["DAILY","CONTRACT"]
  },

  dailyWage: Number

}, { timestamps: true });