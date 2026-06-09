const express = require("express");
const { getInvoices, createInvoice, updateInvoice, deleteInvoice } = require("../controllers/invoiceController");
const router = express.Router();

router.route("/").get(getInvoices).post(createInvoice);
router.route("/:id").put(updateInvoice).delete(deleteInvoice);

module.exports = router;
