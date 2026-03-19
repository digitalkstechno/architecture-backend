import User from "../models/user.model.js";
import Client from "../models/client.model.js";
import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import { generateJsonWebToken } from "../utils/jwt.js";

export const Login = async (body) => {
  const { userName, password } = body;

  console.log("📥 Incoming Login:", { userName, password });

  // 1️⃣ Try finding in User
  let user = await User.findOne({ 
    userName: { $regex: `^${userName}$`, $options: 'i' } 
  })
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .populate("tenantId");

  console.log("👤 User from User collection:", user);

  // 2️⃣ If not found → check Client (using clientName as username)
  if (!user) {
    user = await Client.findOne({ 
      clientName: { $regex: `^${userName}$`, $options: 'i' } 
    })
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .populate("tenantId");

    console.log("👤 User from Client collection:", user);
  }

  // ❌ User not found
  if (!user) {
    console.log("❌ No user found with this username:", userName);
    throw new Error("User not found");
  }

  // 3️⃣ Password check
  console.log("🔑 Entered Password:", password);
  console.log("🔒 Stored Password:", user.password);

  let match = false;
  if (user.password) {
    match = await bcrypt.compare(password, user.password);
    
    // Fallback for plain text passwords (useful if manually added to DB)
    if (!match && password === user.password) {
      match = true;
    }
  }

  console.log("✅ Password Match Result:", match);

  if (!match) {
    console.log("❌ Password mismatch");
    throw new Error("Invalid credentials");
  }

  /* ---------------- TENANT CHECK ---------------- */
  if (!user.isSuperAdmin) {
    if (!user.tenantId) {
      console.log("❌ Tenant missing");
      throw new Error("Tenant not assigned");
    }

    const tenant = await Tenant.findById(user.tenantId);

    console.log("🏢 Tenant:", tenant);

    if (!tenant) throw new Error("Tenant not found");
    if (!tenant.isActive) throw new Error("Tenant is disabled");

    if (
      tenant.subscription?.status !== "TRIAL" &&
      tenant.subscription?.status !== "ACTIVE"
    ) {
      throw new Error("Subscription inactive");
    }
  }

  // 4️⃣ Generate token
  const token = generateJsonWebToken(user);

  console.log("🎉 Login Success");

  return {
    token,
    user: {
      _id: user._id,
      name: user.userName || user.clientName,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    },
  };
};

export const Logout = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await user.save();
};