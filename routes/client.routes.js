import express from "express";
const router = express.Router();
import { creatClientController, getClientController, getClientByIdController,updateClientController, deleteClientController } from "../controller/client.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { updateClient } from "../service/client.service.js";

router.use(protect);
//  checkPermission(MODULES.CLIENT, ACTIONS.CREATE),
//  
router.post("/", creatClientController);
router.get("/",  getClientController);
router.get("/:id", getClientByIdController);
router.put("/:id",  updateClientController);
router.delete("/:id",  deleteClientController);
// router.post("/", checkPermission(MODULES.CLIENT, ACTIONS.CREATE),creatClientController);
// router.get("/",checkPermission(MODULES.CLIENT, ACTIONS.READ),  getClientController);
// router.get("/:id", checkPermission(MODULES.CLIENT, ACTIONS.READ), getClientByIdController);
// router.put("/:id", checkPermission(MODULES.CLIENT, ACTIONS.UPDATE), updateClientController);
// router.delete("/:id", checkPermission(MODULES.CLIENT, ACTIONS.DELETE), deleteClientController);

export default router ;