const GuestLogin = require("../models/GuestLogin");

// POST /api/guest-logins
const recordGuestLogin = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;

    const newLogin = await GuestLogin.create({
      mobile,
      ipAddress,
    });

    res.status(201).json(newLogin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/guest-logins
const getGuestLogins = async (req, res) => {
  try {
    // Sort by newest first
    const logins = await GuestLogin.find().sort({ createdAt: -1 });
    res.json(logins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  recordGuestLogin,
  getGuestLogins,
};
