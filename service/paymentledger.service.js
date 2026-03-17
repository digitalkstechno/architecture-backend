import PaymentLedger from "../models/paymentledger.model.js";

export const createLedgerEntry = async (data) => {
  return await PaymentLedger.create(data);
};

export const getTenantLedger = async (tenantId) => {
  return await PaymentLedger.find({ tenantId }).sort({ createdAt: -1 });
};