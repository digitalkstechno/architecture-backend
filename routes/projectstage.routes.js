import express from "express";
const router = express.Router();
import { createProjectstageController, getProjectstageController, getProjectstageByIdController, updateProjectstageController, deleteProjectstageController } from "../controller/projectstage.Controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Projectstage from "../models/projectstage.model.js";

router.use(protect);

router.post("/", createProjectstageController);
router.get("/", queryOptions(Projectstage), getProjectstageController);
router.get("/:id", getProjectstageByIdController);
router.put("/:id", updateProjectstageController);
router.delete("/:id", deleteProjectstageController);


//  router.post("/", checkPermission(MODULES.PROJECT_STAGE, ACTIONS.CREATE), createProjectstageController);
// router.post("/",checkPermission(MODULES.PROJECT_STAGE, ACTIONS.READ),queryOptions(Projectstage), getProjectstageController);
// router.post("/:id",checkPermission(MODULES.PROJECT_STAGE, ACTIONS.READ), getProjectstageByIdController);
// router.post("/:id",checkPermission(MODULES.PROJECT_STAGE, ACTIONS.UPDATE), updateProjectstageController);
// router.post("/:id",checkPermission(MODULES.PROJECT_STAGE, ACTIONS.DELETE), deleteProjectstageController);

export default router ;