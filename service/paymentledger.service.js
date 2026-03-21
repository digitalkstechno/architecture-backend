import PaymentLedger from "../models/paymentledger.model.js";
import BankBrief from "../models/bankbrief.model.js";
import Project from "../models/project.model.js";

export const createLedgerEntry = async (data) => {
  // 1. Create Ledger Entry
  const ledger = await PaymentLedger.create(data);

  // 2. Update Bank Balance
  const bank = await BankBrief.findById(data.bankId);
  if (bank) {
    if (data.transactionType === "CREDIT") {
      bank.currentBalance += data.amount;
    } else {
      bank.currentBalance -= data.amount;
    }
    await bank.save();
  }

  // 3. Update Project Financials
  const project = await Project.findById(data.projectId);
  if (project) {
    if (data.transactionType === "CREDIT") {
      project.totalReceived = (project.totalReceived || 0) + data.amount;
    } else {
      project.totalExpense = (project.totalExpense || 0) + data.amount;
    }
    project.balance = (project.totalReceived || 0) - (project.totalExpense || 0);
    await project.save();
  }

  return ledger;
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
