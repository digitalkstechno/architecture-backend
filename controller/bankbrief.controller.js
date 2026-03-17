import { createBank, getTenantBanks } from "../service/bankbrief.service.js";

export const CreateBankController = async (req, res) => {
  try {

    const bank = await createBank({
      tenantId: req.user.tenantId,
      ...req.body
    });

    res.status(201).json(bank);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetTenantBanksController = async (req, res) => {
  try {

    const banks = await getTenantBanks(req.user.tenantId);

    res.json(banks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};