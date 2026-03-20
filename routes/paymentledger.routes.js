import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { CreateLedgerEntryController, getPaymentLedgerController, getPaymentLedgerByIdController, updatePaymentLedgerController,deletePaymentLedgerController } from "../controller/paymentledger.controller.js";
import { MODULES } from "../constants/module.js";
import { ACTIONS } from "../constants/permission.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import PaymentLedger from "../models/paymentledger.model.js";

const router = express.Router();

router.use(protect);

router.post("/", CreateLedgerEntryController);
router.get("/",queryOptions(PaymentLedger), getPaymentLedgerController);
router.get("/:id", getPaymentLedgerByIdController);
router.put("/:id", updatePaymentLedgerController);
router.delete("/:id", deletePaymentLedgerController);


// router.post("/", checkPermission(MODULES.PaymentLedger, ACTIONS.CREATE), createPaymentLedgerController);
// router.post("/",checkPermission(MODULES.PaymentLedger, ACTIONS.READ),queryOptions(PaymentLedger), getPaymentLedgerController);
// router.post("/:id",checkPermission(MODULES.PaymentLedger, ACTIONS.READ), getPaymentLedgerByIdController);
// router.post("/:id",checkPermission(MODULES.PaymentLedger, ACTIONS.UPDATE), updatePaymentLedgerController);
// router.post("/:id",checkPermission(MODULES.PaymentLedger, ACTIONS.DELETE), deletePaymentLedgerController);


export default router;