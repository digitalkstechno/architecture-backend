import express from "express";
const router = express.Router();
import { createWorkertaskController, getWorkertaskController, getWorkertaskByIdController, updateWorkertaskController, deleteWorkertaskController } from "../controller/workertask.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Workertask from "../models/workertask.model.js";

router.use(protect);

router.post("/", createWorkertaskController);
router.get("/", queryOptions(Workertask), getWorkertaskController);
router.get("/:id", getWorkertaskByIdController);
router.put("/:id", updateWorkertaskController);
router.delete("/:id", deleteWorkertaskController);


// router.post("/", checkPermission(MODULES.WORKERTASK, ACTIONS.CREATE), createWorkertaskController);
// router.post("/",checkPermission(MODULES.WORKERTASK, ACTIONS.READ),queryOptions(Workertask), getWorkertaskController);
// router.post("/:id",checkPermission(MODULES.WORKERTASK, ACTIONS.READ), getWorkertaskByIdController);
// router.post("/:id",checkPermission(MODULES.WORKERTASK, ACTIONS.UPDATE), updateWorkertaskController);
// router.post("/:id",checkPermission(MODULES.WORKERTASK, ACTIONS.DELETE), deleteWorkertaskController);

export default router ;