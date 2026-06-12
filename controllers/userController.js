const User = require("../models/User");

const CryptoJS = require("crypto-js");
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret";

const decryptPassword = (password) => {
  if (!password) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(password, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || "";
  } catch (err) {
    return "";
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, team, trackAttendance } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (team) filter.team = team;
    if (trackAttendance !== undefined) filter.trackAttendance = trackAttendance === "true";

    const users = await User.find(filter)
      .populate("assignedProjects", "name status")
      .populate("role", "name permissions")
      .sort({ createdAt: -1 });
    
    const usersWithPasswords = users.map(user => {
      const u = user.toObject();
      u.password = decryptPassword(u.password);
      return u;
    });
    res.json(usersWithPasswords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("assignedProjects", "name status")
      .populate("role", "name permissions");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const u = user.toObject();
    u.password = decryptPassword(u.password);
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    
    // findByIdAndUpdate doesn't trigger pre('save') hook, so encrypt manually if password is provided
    if (password) {
      rest.password = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const u = user.toObject();
    u.password = decryptPassword(u.password);
    res.json(u);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
