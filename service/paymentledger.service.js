import PaymentLedger from "../models/paymentledger.model.js";

export const createLedgerEntry = async (data) => {
  return await PaymentLedger.create(data);
};

export const getPaymentLedger = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  // if (queryParams.PaymentLedgerName) {
  //   filter.PaymentLedgerName = {
  //     $regex: queryParams.PaymentLedgerName,
  //     $options: "i",
  //   };
  // }
  // if (queryParams.status) {
  //   filter.status = {
  //     $regex: queryParams.status,
  //     $options: "i",
  //   };
  // }

  const paymentledger = await PaymentLedger.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("clientId");

  return paymentledger;
};
export const getPaymentLedgerById = async (id, tenantId) => {
  return await PaymentLedger.findOne({ _id: id, tenantId: tenantId }).populate(
    "clientId",
  );
};
export const updatePaymentLedger = async (id, data, tenantId) => {
  return await PaymentLedger.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deletePaymentLedger = async (id, tenantId) => {
  return await PaymentLedger.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
