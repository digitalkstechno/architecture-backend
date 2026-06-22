const express = require("express");
const router = express.Router();
const { getCompany, updateCompany } = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.route("/")
  .get(getCompany)
  .put(authorize("director", "architect", "admin"), updateCompany);

module.exports = router;
