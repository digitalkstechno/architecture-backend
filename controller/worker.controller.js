import Worker from "../models/worker.model.js";
import {
  createWorker,
  getWorker,
  getWorkerById,
  updateWorker,
  deleteWorker,
} from "../service/worker.service.js";

export const createWorkerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workers = await createWorker(req.body, tenantId);
    return res.status(201).json(Workers);
  } catch (error) {
    console.log("🚀 ~ createWorkerController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getWorkerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workers = await getWorker(req.query, tenantId);
    const total = await Worker.countDocuments({
      tenantId: tenantId, // ✅ FIX
    });

    return res.status(200).json({
      success: true,
      message: "Workers retrieved successfully",
      Workers,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getWorkerController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getWorkerByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workers = await getWorkerById(req.params.id, tenantId);
    return res.status(200).json(Workers);
  } catch (error) {
    console.log("🚀 ~ getWorkerByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateWorkerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Worker = await updateWorker(req.params.id, req.body, tenantId);

    return res.status(200).json(Worker);
  } catch (error) {
    console.log("🚀 updateWorkerController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteWorkerController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Workers = await deleteWorker(req.params.id, tenantId);
    return res.status(204).json(Workers);
  } catch (error) {
    console.log("🚀 ~ deleteWorkerController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
