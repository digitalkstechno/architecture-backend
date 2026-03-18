import { createWorkertask, getWorkertask, getWorkertaskById, updateWorkertask , deleteWorkertask } from "../service/workertask.service.js";


export const createWorkertaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workertasks = await createWorkertask(req.body, tenantId);
    return res.status(201).json(Workertasks);
  } catch (error) {
    console.log("🚀 ~ createWorkertaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getWorkertaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workertasks = await getWorkertask( tenantId);
    return res.status(200).json(Workertasks);
  } catch (error) {
    console.log("🚀 ~ getWorkertaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getWorkertaskByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workertasks = await getWorkertaskById(req.params.id, tenantId);
    return res.status(200).json(Workertasks);
  } catch (error) {
    console.log("🚀 ~ getWorkertaskByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateWorkertaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Workertask = await updateWorkertask(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Workertask);
  } catch (error) {
    console.log("🚀 updateWorkertaskController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteWorkertaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workertasks = await deleteWorkertask(req.params.id , tenantId);
    return res.status(204).json(Workertasks);
  } catch (error) {
    console.log("🚀 ~ deleteWorkertaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
