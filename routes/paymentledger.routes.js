import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { CreateLedgerEntryController, GetTenantLedgerController } from "../controller/paymentledger.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", CreateLedgerEntryController);
router.get("/", GetTenantLedgerController);

export default router;