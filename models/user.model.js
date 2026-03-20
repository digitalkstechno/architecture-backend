
import mongoose from "mongoose";



const userschema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
  },

  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  userName: { type: String, required: true },
  age: Number,
  contact_no: Number,
  password: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  email: {
    type: String,
    unique: true,
  },
  employmentType: {
  type: String,
  enum: ["DAILY", "MONTHLY", "CONTRACT"]
},

salaryConfig: {
  dailyWage: Number,
  monthlySalary: Number,
  contractAmount: Number
}
}, { timestamps: true });

export default mongoose.model("User", userschema);
