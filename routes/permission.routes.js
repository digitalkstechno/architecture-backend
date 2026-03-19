import express from "express";
const router = express.Router();
import {createPermissionController, getPermissionController,getPermissionbyIdController,updatePermissionController, deletePermissionController} from "./../controller/permission.controller.js";
import { protect } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';
import {MODULES} from "./../constants/module.js";
import {ACTIONS} from "./../constants/permission.js";
import { queryOptions } from "../constants/globalpagination.js";
import Permission from "../models/permission.model.js";
router.use(protect);

router.post("/",createPermissionController);
router.get("/",checkPermission(MODULES.PERMISSION, ACTIONS.READ), queryOptions(Permission),  getPermissionController);
router.get("/:id",checkPermission(MODULES.PERMISSION, ACTIONS.READ),  getPermissionbyIdController);
router.put("/:id",checkPermission(MODULES.PERMISSION, ACTIONS.UPDATE),  updatePermissionController);
router.delete("/:id",checkPermission(MODULES.PERMISSION, ACTIONS.DELETE),  deletePermissionController);

export default router;