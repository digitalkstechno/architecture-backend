
import mongoose from "mongoose";

// const deviceSchema = new mongoose.Schema({
//   deviceId: String,
//   deviceName: String,
//   browser: String,
//   os: String,
//   deviceType: String,
//   userAgent: String,
//   token: String,
//   lastLogin: Date,
// });

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
//   devices: {
//     type: [deviceSchema],
//     default: [],
//   },
  email: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.model("User", userschema);
