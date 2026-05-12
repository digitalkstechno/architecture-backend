import User from "../models/user.model.js";
import Client from "../models/client.model.js";
import bcrypt from "bcryptjs";
import Tenant from "../models/tenant.model.js";
import { generateJsonWebToken } from "../utils/jwt.js";

export const Login = async ({ email, password }) => {
  // ✅ Normalize input
  const loginId = email?.trim();   // can be email OR username
  const pass = password?.trim();

  console.log("📥 Incoming Login:", { loginId, pass });

  if (!loginId || !pass) {
    throw new Error("Email/Username and password are required");
  }

  // 1️⃣ Find in User (email OR username)
  let user = await User.findOne({
    $or: [
      { email: loginId },
      { userName: loginId }
    ]
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
      $or: [
        { email: loginId },
        { clientName: loginId }
      ]
    })
      .populate({
        path: "role",
        populate: { path: "permissions" },
      })
      .populate("tenantId");

    console.log("👤 User from Client collection:", user);
  }

  // ❌ Not found
  if (!user) {
    console.log("❌ No user found");
    throw new Error("User not found");
  }

  // 3️⃣ Password check
  console.log("🔑 Entered Password:", pass);
  console.log("🔒 Stored Password:", user.password);

  const isMatch = await bcrypt.compare(pass, user.password);

  console.log("✅ Password Match:", isMatch);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  /* ---------------- TENANT CHECK ---------------- */
  if (!user.isSuperAdmin) {
    if (!user.tenantId) throw new Error("Tenant not assigned");

    // tenantId may be populated object or raw ObjectId
    const tenant = user.tenantId?._id
      ? user.tenantId  // already populated
      : await Tenant.findById(user.tenantId);

    if (!tenant) throw new Error("Tenant not found");
    if (!tenant.isActive) throw new Error("Tenant is disabled");
    if (
      tenant.subscription?.status !== "TRIAL" &&
      tenant.subscription?.status !== "ACTIVE"
    ) {
      throw new Error("Subscription inactive");
    }
  }

  const token = generateJsonWebToken(user);

  return {
    token,
    user: {
      _id: user._id,
      name: user.userName || user.clientName || user.name,
      email: user.email,
      tenantId: user.tenantId?._id || user.tenantId,
      role: user.role,
    },
  };
};

export const Logout = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  await user.save();
};