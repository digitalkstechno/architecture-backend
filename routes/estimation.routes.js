import express from "express";
const router = express.Router();
import { createProjectestimationController, getProjectestimationController, getProjectestimationByIdController, updateProjectestimationController, deleteProjectestimationController } from "../controller/estimation.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Projectestimation from "../models/estimation.model.js";

router.use(protect);

router.post("/", createProjectestimationController);
router.get("/",queryOptions(Projectestimation), getProjectestimationController);
router.get("/:id", getProjectestimationByIdController);
router.put("/:id", updateProjectestimationController);
router.delete("/:id", deleteProjectestimationController);


// router.post("/", checkPermission(MODULES.PROJECT_ESTIMATION, ACTIONS.CREATE), createProjectestimationController);
// router.post("/",checkPermission(MODULES.PROJECT_ESTIMATION, ACTIONS.READ),queryOptions(Projectestimation), getProjectestimationController);
// router.post("/:id",checkPermission(MODULES.PROJECT_ESTIMATION, ACTIONS.READ), getProjectestimationByIdController);
// router.post("/:id",checkPermission(MODULES.PROJECT_ESTIMATION, ACTIONS.UPDATE), updateProjectestimationController);
// router.post("/:id",checkPermission(MODULES.PROJECT_ESTIMATION, ACTIONS.DELETE), deleteProjectestimationController);

export default router ;
