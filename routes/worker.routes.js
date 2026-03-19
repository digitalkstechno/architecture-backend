import express from "express";
const router = express.Router();
import { createWorkerController , getWorkerController, getWorkerByIdController, updateWorkerController, deleteWorkerController } from "../controller/worker.controller.js";


import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Worker from "../models/worker.model.js";

router.use(protect);

router.post("/",  createWorkerController);
router.get("/",queryOptions(Worker), getWorkerController);
router.get("/:id", getWorkerByIdController);
router.put("/:id", updateWorkerController);
router.delete("/:id", deleteWorkerController);


// router.post("/", checkPermission(MODULES.WORKER, ACTIONS.CREATE), createWorkerController);
// router.post("/",checkPermission(MODULES.WORKER, ACTIONS.READ),queryOptions(Worker), getWorkerController);
// router.post("/:id",checkPermission(MODULES.WORKER, ACTIONS.READ), getWorkerByIdController);
// router.post("/:id",checkPermission(MODULES.WORKER, ACTIONS.UPDATE), updateWorkerController);
// router.post("/:id",checkPermission(MODULES.WORKER, ACTIONS.DELETE), deleteWorkerController);

export default router ;