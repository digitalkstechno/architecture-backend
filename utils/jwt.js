import jwt from "jsonwebtoken";
 
export const generateJsonWebToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      tenantId: user.tenantId?._id || user.tenantId || null,
      isSuperadmin: user.isSuperAdmin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}