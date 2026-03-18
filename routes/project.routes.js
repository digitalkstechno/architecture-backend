import express from "express";
const router = express.Router();
import { createProjectController, getProjectController, getProjectByIdController, updateProjectController,deleteProjectController } from "../controller/project.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

router.use(protect);

router.post("/", createProjectController);
router.get("/", getProjectController);
router.get("/:id", getProjectByIdController);
router.put("/:id", updateProjectController);
router.delete("/:id", deleteProjectController);


// router.post("/", checkPermission(MODULES.PROJECT, ACTIONS.CREATE), createProjectController);
// router.post("/",checkPermission(MODULES.PROJECT, ACTIONS.READ), getProjectController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.READ), getProjectByIdController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.UPDATE), updateProjectController);
// router.post("/:id",checkPermission(MODULES.PROJECT, ACTIONS.DELETE), deleteProjectController);

export default router ;