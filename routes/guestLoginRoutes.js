const express = require("express");
const router = express.Router();
const { recordGuestLogin, getGuestLogins } = require("../controllers/guestLoginController");
const { protect } = require("../middleware/auth");

// Open endpoint for tracking
router.post("/", recordGuestLogin);

// Protected endpoint for viewing logs
router.get("/", protect, getGuestLogins);

module.exports = router;
