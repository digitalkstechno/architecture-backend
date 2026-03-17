import crypto from "crypto";
import User from "../models/user.model.js"; // adjust path

export const generatePassword = () =>
  crypto.randomBytes(6).toString("hex");

export const generateUsername = async (tenantName) => {
  let baseUsername =
    tenantName.replace(/\s+/g, "").toLowerCase() + "_admin";

  let username = baseUsername;
  let counter = 1;

  // check if username exists
  while (await User.findOne({ userName: username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};