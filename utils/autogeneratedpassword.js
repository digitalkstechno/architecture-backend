import crypto from "crypto";

export const generatePassword = () =>
  crypto.randomBytes(6).toString("hex");

export const generateUsername = (tenantName) =>
  tenantName.replace(/\s+/g, "")
  .toLowerCase() + "_admin";



