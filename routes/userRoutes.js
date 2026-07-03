const express = require("express");
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser, uploadAvatar } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.route("/").get(getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(authorize("director", "architect", "admin"), deleteUser);
router.post("/:id/avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;
