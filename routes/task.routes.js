import express from "express";
const router = express.Router();
import { createTaskController, getTaskController, getTaskByIdController, updateTaskController,deleteTaskController } from "../controller/task.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

router.use(protect);

router.post("/", createTaskController);
router.get("/", getTaskController);
router.get("/:id", getTaskByIdController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);


// router.post("/", checkPermission(MODULES.TASK, ACTIONS.CREATE), createTaskController);
// router.post("/",checkPermission(MODULES.TASK, ACTIONS.READ), getTaskController);
// router.post("/:id",checkPermission(MODULES.TASK, ACTIONS.READ), getTaskByIdController);
// router.post("/:id",checkPermission(MODULES.TASK, ACTIONS.UPDATE), updateTaskController);
// router.post("/:id",checkPermission(MODULES.TASK, ACTIONS.DELETE), deleteTaskController);

export default router ;