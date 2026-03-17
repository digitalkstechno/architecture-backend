import mongoose from "mongoose";
// import {createSuperAdmin} from "../constants/superAdmin.js";
import { createSuperAdmin } from "../seeds/superAdmin.js";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");

    /* ---------- Seed Data SuperAdmin ---------- */
    await createSuperAdmin();
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
