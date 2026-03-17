import User from "./../models/user.model.js";
import { comparePassword } from "./../utils/password.js";
import { generateJsonWebToken } from "./../utils/jwt.js";
import Tenant from "./../models/tenant.model.js";

export const Login = async ({ userName, password }) => {
  const user = await User.findOne({ userName })
    .populate({
      path: "role",
      populate: { path: "permissions" },
    })
    .populate("tenantId")

  if (!user) throw new Error("User not found");

  // now populate subscription.planId on Tenant
  await user.populate({
    path: "tenantId",
    populate: {
      path: "subscription.planId",
      model: "SubscriptionPlan",
    },
  });

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  /* ---------------- SUPER ADMIN BYPASS ---------------- */
  if (!user.isSuperAdmin) {
    if (!user.tenantId) {
      throw new Error("Tenant not assigned");
    }

    // Yahan tenantId ObjectId hi hai, populate bhi hua
    const tenant = await Tenant.findById(user.tenantId);
    console.log("full tenant data",user.tenantId)
    console.log("Login tenant:", {
      id: tenant?._id,
      isActive: tenant?.isActive,
      status: tenant?.subscription?.status,
    });

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    if (!tenant.isActive) {
      throw new Error("Tenant is disabled");
    }

    // Yahan TRIAL + ACTIVE dono allow karo
    if (
      tenant.subscription?.status !== "TRIAL" &&
      tenant.subscription?.status !== "ACTIVE"
    ) {
      throw new Error("Subscription inactive");
    }
  }

  /* ---------------- DEVICE MANAGEMENT ---------------- */
  const token = generateJsonWebToken(user);



 

  await user.save();

  return {
    token,
    user: {
      _id: user._id,
      userName: user.userName,
      isSuperAdmin: user.isSuperAdmin,
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