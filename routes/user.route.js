import express from "express";
const router = express.Router();
import { CreateUserController, GetUserController,GetUserControllerByid, updateUserController,deleteUserController } from "../controller/user.controller.js";
import { protect } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { queryOptions } from "../constants/globalpagination.js";
import User from "../models/user.model.js";
router.use(protect)

router.post("/",checkPermission(MODULES.USER, ACTIONS.CREATE) ,CreateUserController);
router.get("/",checkPermission(MODULES.USER, ACTIONS.READ), queryOptions(User), GetUserController );
router.get("/:id",checkPermission(MODULES.USER, ACTIONS.READ),GetUserControllerByid);
router.put("/:id",checkPermission(MODULES.USER, ACTIONS.UPDATE), updateUserController);
router.delete("/:id",checkPermission(MODULES.USER, ACTIONS.DELETE), deleteUserController)
export default router;