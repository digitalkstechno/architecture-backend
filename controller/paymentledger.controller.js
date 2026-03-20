import {
  createLedgerEntry,
  getPaymentLedger,
  getPaymentLedgerById,
  updatePaymentLedger,
  deletePaymentLedger,
} from "../service/paymentledger.service.js";
import PaymentLedger from "../models/paymentledger.model.js";

export const CreateLedgerEntryController = async (req, res) => {
  try {
    const ledger = await createLedgerEntry({
      tenantId: req.user.tenantId,
      ...req.body,
    });

    res.status(201).json(ledger);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentLedgerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const PaymentLedgers = await getPaymentLedger(req.query, tenantId);
    const total = await PaymentLedger.countDocuments({
      tenantId: tenantId, // ✅ FIX
    });

    return res.status(200).json({
      success: true,
      message: "PaymentLedgers retrieved successfully",
      PaymentLedgers,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getPaymentLedgerController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getPaymentLedgerByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const PaymentLedgers = await getPaymentLedgerById(req.params.id, tenantId);
    return res.status(200).json(PaymentLedgers);
  } catch (error) {
    console.log("🚀 ~ getPaymentLedgerByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updatePaymentLedgerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const PaymentLedger = await updatePaymentLedger(req.params.id, req.body, tenantId);

    return res.status(200).json(PaymentLedger);
  } catch (error) {
    console.log("🚀 updatePaymentLedgerController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deletePaymentLedgerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const PaymentLedgers = await deletePaymentLedger(req.params.id, tenantId);
    return res.status(204).json(PaymentLedgers);
  } catch (error) {
    console.log("🚀 ~ deletePaymentLedgerController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
