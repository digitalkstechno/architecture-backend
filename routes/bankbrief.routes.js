import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { CreateBankController, GetTenantBanksController } from "../controller/bankbrief.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", CreateBankController);
router.get("/", GetTenantBanksController);

export default router;