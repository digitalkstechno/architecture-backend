import { createBank, getTenantBanks } from "../service/bankbrief.service.js";

const getTenantId = (req) => req.user.tenantId?._id || req.user.tenantId;

export const CreateBankController = async (req, res) => {
  try {
    const bank = await createBank({
      tenantId: getTenantId(req),
      ...req.body
    });

    res.status(201).json(bank);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetTenantBanksController = async (req, res) => {
  try {
    const banks = await getTenantBanks(getTenantId(req));

    res.json(banks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};