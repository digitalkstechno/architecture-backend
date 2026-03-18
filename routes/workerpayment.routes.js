import express from "express";
const router = express.Router();
import { createWorkerpaymentController, getWorkerpaymentController, getWorkerpaymentByIdController, updateWorkerpaymentController, deleteWorkerpaymentController } from "../controller/workerpayment.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
router.use(protect);

router.post("/", createWorkerpaymentController);
router.get("/", getWorkerpaymentController);
router.get("/:id", getWorkerpaymentByIdController);
router.put("/:id", updateWorkerpaymentController);
router.delete("/:id", deleteWorkerpaymentController);


// router.post("/", checkPermission(MODULES.WORKERPAYMENT, ACTIONS.CREATE), createWorkerpaymentController);
// router.post("/",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.READ), getWorkerpaymentController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.READ), getWorkerpaymentByIdController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.UPDATE), updateWorkerpaymentController);
// router.post("/:id",checkPermission(MODULES.WORKERPAYMENT, ACTIONS.DELETE), deleteWorkerpaymentController);

export default router ;