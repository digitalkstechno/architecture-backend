import express from "express";
const router = express.Router();
import { createProjectupdateController, getProjectupdateController, getProjectupdateByIdController, updateProjectupdateController, deleteProjectupdateController } from "../controller/projectupdate.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
router.use(protect);

router.post(
  "/",
  upload.array("images", 10), // max 10 images
  createProjectupdateController
);
router.get("/", getProjectupdateController);
router.get("/:id", getProjectupdateByIdController);
router.put("/:id",upload.array("images", 10), updateProjectupdateController);
router.delete("/:id", deleteProjectupdateController);


// router.post("/", checkPermission(MODULES.PROJECT, ACTIONS.CREATE), createProjectupdateController);
// router.post("/",checkPermission(MODULES.PROJECT, ACTIONS.READ), getProjectupdateController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.READ), getProjectupdateByIdController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.UPDATE), updateProjectupdateController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.DELETE), deleteProjectupdateController);

export default router ;