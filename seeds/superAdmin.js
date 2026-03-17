import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const createSuperAdmin = async () => {
  const exists = await User.findOne({ isSuperAdmin: true });

  if (exists) {
    console.log("ℹ️ Super admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin@123", 10);

  await User.create({
    userName: "superadmin",
    password: hashedPassword,   
    isSuperAdmin: true, 
    tenantId: null,
  });
  
  console.log("✅ Super admin created");
};
