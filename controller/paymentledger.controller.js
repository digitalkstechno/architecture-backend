import { createLedgerEntry, getTenantLedger } from "../service/paymentledger.service.js";

export const CreateLedgerEntryController = async (req, res) => {
  try {

    const ledger = await createLedgerEntry({
      tenantId: req.user.tenantId,
      ...req.body
    });

    res.status(201).json(ledger);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const GetTenantLedgerController = async (req, res) => {
  try {

    const ledger = await getTenantLedger(req.user.tenantId);

    res.json(ledger);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};