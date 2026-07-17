const express = require("express");
const router = express.Router();
const { 
  getAttendance, 
  checkIn, 
  checkOut, 
  updateAttendance, 
  getMyStatus,
  downloadSalarySlip
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getAttendance);
router.get("/my-status", getMyStatus);
router.get("/salary-slip/:id/pdf", downloadSalarySlip);
router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.put("/:id", updateAttendance);

module.exports = router;
