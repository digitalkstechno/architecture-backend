import express from "express";
const router = express.Router();
import { createWorkerpaymentController, getWorkerpaymentController, getWorkerpaymentByIdController, updateWorkerpaymentController, deleteWorkerpaymentController } from "../controller/workerpayment.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Workerpayment from "../models/workerpayment.model.js";
router.use(protect);

router.post("/", createWorkerpaymentController);
router.get("/", queryOptions(Workerpayment), getWorkerpaymentController);
router.get("/:id", getWorkerpaymentByIdController);
router.put("/:id", updateWorkerpaymentController);
router.delete("/:id", deleteWorkerpaymentController);


// router.post("/", checkPermission(MODULES.WORKERPAYMENT, ACTIONS.CREATE), createWorkerpaymentController);
// router.post("/",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.READ),queryOptions(Workerpayment), getWorkerpaymentController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.READ), getWorkerpaymentByIdController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.UPDATE), updateWorkerpaymentController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.DELETE), deleteWorkerpaymentController);

export default router ;