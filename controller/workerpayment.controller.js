import { createWorkerpayment, getWorkerpayment, getWorkerpaymentById, updateWorkerpayment, deleteWorkerpayment } from "../service/workerpayment.service.js";


export const createWorkerpaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workerpayments = await createWorkerpayment(req.body, tenantId);
    return res.status(201).json(Workerpayments);
  } catch (error) {
    console.log("🚀 ~ createWorkerpaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getWorkerpaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workerpayments = await getWorkerpayment( tenantId);
    return res.status(200).json(Workerpayments);
  } catch (error) {
    console.log("🚀 ~ getWorkerpaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getWorkerpaymentByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workerpayments = await getWorkerpaymentById(req.params.id, tenantId);
    return res.status(200).json(Workerpayments);
  } catch (error) {
    console.log("🚀 ~ getWorkerpaymentByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateWorkerpaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Workerpayment = await updateWorkerpayment(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Workerpayment);
  } catch (error) {
    console.log("🚀 updateWorkerpaymentController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteWorkerpaymentController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workerpayments = await deleteWorkerpayment(req.params.id , tenantId);
    return res.status(204).json(Workerpayments);
  } catch (error) {
    console.log("🚀 ~ deleteWorkerpaymentController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
