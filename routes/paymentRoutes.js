const express = require("express");
const router = express.Router();
const { getPayments, getPayment, createPayment, updatePayment, deletePayment, downloadPaymentSlip } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getPayments).post(createPayment);
router.route("/:id").get(getPayment).put(updatePayment).delete(deletePayment);
router.route("/:id/download").get(downloadPaymentSlip);

module.exports = router;
