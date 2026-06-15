const express = require("express");
const router = express.Router();
const { getSOPs, createSOP, deleteSOP, updateSOP } = require("../controllers/workingSOPController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);

router.route("/")
  .get(getSOPs)
  .post(upload.single("video"), createSOP);

router.route("/:id")
  .put(upload.single("video"), updateSOP)
  .delete(deleteSOP);

module.exports = router;
