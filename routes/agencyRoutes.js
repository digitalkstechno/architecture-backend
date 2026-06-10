const express = require("express");
const router = express.Router();
const {
  submitRegistration,
  getPendingRegistrations,
  getRegistrationById,
  approveRegistration,
  rejectRegistration,
  sendEmailOtp,
  verifyEmailOtp,
  getAgencyRoles
} = require("../controllers/agencyController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/roles", getAgencyRoles);
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);
router.post("/register", upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "projectPhotos", maxCount: 10 }]), submitRegistration);
router.get("/pending", protect, authorize("architect", "director", "admin"), getPendingRegistrations);
router.get("/:id", protect, authorize("architect", "director", "admin"), getRegistrationById);
router.post("/:id/approve", protect, authorize("architect", "director", "admin"), approveRegistration);
router.post("/:id/reject", protect, authorize("architect", "director", "admin"), rejectRegistration);

module.exports = router;
