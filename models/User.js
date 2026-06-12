const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    phone: { type: String },
    address: { type: String },
    experience: { type: Number },
    specializations: [{ type: String }],
    team: { type: String, enum: ["Office", "Site"] },
    rate: { type: String },
    payoutType: { type: String, enum: ["Monthly", "Daily", "Hourly"], default: "Monthly" },
    salaryAmount: { type: Number, default: 0 },
    config: {
      hoursPerDay: { type: Number, default: 8 },
      daysPerMonth: { type: Number, default: 26 }
    },
    trackAttendance: { type: Boolean, default: false },
    lastMonthDue: { type: Number, default: 0 },
    joinDate: { type: String },
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = CryptoJS.AES.encrypt(this.password, SECRET_KEY).toString();
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    const bytes = CryptoJS.AES.decrypt(this.password, SECRET_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    return enteredPassword === decryptedPassword;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model("User", userSchema);
