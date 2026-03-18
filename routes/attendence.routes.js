import express from "express";
const router = express.Router();
import { createAttendenceController, getAttendenceController, getAttendenceByIdController, updateAttendenceController, deleteAttendenceController } from "../controller/attendence.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";

router.use(protect);

router.post("/", createAttendenceController);
router.get("/", getAttendenceController);
router.get("/:id", getAttendenceByIdController);
router.put("/:id", updateAttendenceController);
router.delete("/:id", deleteAttendenceController);


// router.post("/", checkPermission(MODULES.ATTENDENCE, ACTIONS.CREATE), createAttendenceController);
// router.post("/",checkPermission(MODULES.ATTENDENCE, ACTIONS.READ), getAttendenceController);
// router.post("/:id",checkPermission(MODULES.ATTENDENCE, ACTIONS.READ), getAttendenceByIdController);
// router.post("/:id",checkPermission(MODULES.ATTENDENCE, ACTIONS.UPDATE), updateAttendenceController);
// router.post("/:id",checkPermission(MODULES.ATTENDENCE, ACTIONS.DELETE), deleteAttendenceController);

export default router ;