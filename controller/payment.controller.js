import { createPayment, getpayment, getpaymentById, updatepayment, deletepayment } from "../service/payment.service.js";
import Paymentroll from "../models/payment.model.js";


export const createpaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Payments = await createPayment(req.body, tenantId);
    return res.status(201).json(Payments);
  } catch (error) {
    console.log("🚀 ~ createPaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getPaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Payments = await getpayment(req.query, tenantId);
     const total = await Paymentroll.countDocuments({
              tenantId: tenantId, // ✅ FIX
            });
        
            return res.status(200).json({
              success: true,
              message: "Payments retrieved successfully",
              Payments,
              pagination: {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                total,
                pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
              },
            });
  } catch (error) {
    console.log("🚀 ~ getPaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getPaymentByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Payments = await getpaymentById(req.params.id, tenantId);
    return res.status(200).json(Payments);
  } catch (error) {
    console.log("🚀 ~ getPaymentByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updatePaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Payment = await updatepayment(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Payment);
  } catch (error) {
    console.log("🚀 updatePaymentController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deletePaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Payments = await deletepayment(req.params.id , tenantId);
    return res.status(204).json(Payments);
  } catch (error) {
    console.log("🚀 ~ deletePaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
