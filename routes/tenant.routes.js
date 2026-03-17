import express from "express";
const router = express.Router();
import { GetTenantByIdController, GetTenantController, UpdateTenantController, DeleteTenantController,ActivateTenantWithPlanController} from "../controller/tenant.controller.js";
import { CreateTenantController } from "../controller/createtenant.controller.js";
import { activateTenant, cancelTenant } from "../service/subscription.service.js";
import { protect } from '../middleware/auth.middleware.js';


router.use(protect);

router.post("/", CreateTenantController);
router.get("/", GetTenantController);
router.get("/:id", GetTenantByIdController);
router.put("/:id",UpdateTenantController);
router.delete("/:id", DeleteTenantController);


// subscription management routes
router.put("/:id/activate", activateTenant);
router.put("/:id/cancel", cancelTenant);
router.post("/activate-tenant-plan", ActivateTenantWithPlanController);


export default router;