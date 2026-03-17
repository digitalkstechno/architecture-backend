import BankBrief from "../models/bankbrief.model.js";

export const createBank = async (data) => {
  return await BankBrief.create(data);
};

export const getTenantBanks = async (tenantId) => {
  return await BankBrief.find({ tenantId, isActive: true });
};