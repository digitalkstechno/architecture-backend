import express from "express";
const router = express.Router();
import { createpaymentController, getPaymentController, getPaymentByIdController, updatePaymentController, deletePaymentController } from "../controller/payment.controller.js";

import { ACTIONS } from "../constants/permission.js";
import { protect } from "../middleware/auth.middleware.js";
import { checkPermission } from "../middleware/permission.middleware.js";
import { queryOptions } from "../constants/globalpagination.js";
import Paymentroll from "../models/payment.model.js";


router.use(protect);

router.post("/",  createpaymentController);
router.get("/",queryOptions(Paymentroll), getPaymentController);
router.get("/:id", getPaymentByIdController);
router.put("/:id", updatePaymentController);
router.delete("/:id", deletePaymentController);


// router.post("/", checkPermission(MODULES.PAYMENT, ACTIONS.CREATE), createpaymentController);
// router.post("/",checkPermission(MODULES.PAYMENT, ACTIONS.READ),queryOptions(Worker), getPaymentController);
// router.post("/:id",checkPermission(MODULES.PAYMENT, ACTIONS.READ), getPaymentByIdController);
// router.post("/:id",checkPermission(MODULES.PAYMENT, ACTIONS.UPDATE), updatePaymentController);
// router.post("/:id",checkPermission(MODULES.PAYMENT, ACTIONS.DELETE), deletePaymentController);

export default router ;