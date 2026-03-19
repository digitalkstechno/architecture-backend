import Projectestimation from "../models/estimation.model.js";
import { createProjectestimation,getProjectestimation, getProjectestimationById, updateProjectestimation, deleteProjectestimation } from "../service/estimation.service.js";


export const createProjectestimationController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectestimations = await createProjectestimation(req.body, tenantId);
    return res.status(201).json(Projectestimations);
  } catch (error) {
    console.log("🚀 ~ createProjectestimationController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getProjectestimationController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectestimations = await getProjectestimation(req.query, tenantId);
     const total = await Projectestimation.countDocuments({
              tenantId: tenantId, // ✅ FIX
            });

    return res.status(200).json({
      success: true,
      message: "Projectestimation retrieved successfully",
      Projectestimations,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });

  } catch (error) {
    console.log("🚀 ~ getProjectestimationController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectestimationByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectestimations = await getProjectestimationById(req.params.id, tenantId);
    return res.status(200).json(Projectestimations);
  } catch (error) {
    console.log("🚀 ~ getProjectestimationByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProjectestimationController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Projectestimation = await updateProjectestimation(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Projectestimation);
  } catch (error) {
    console.log("🚀 updateProjectestimationController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteProjectestimationController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectestimations = await deleteProjectestimation(req.params.id , tenantId);
    return res.status(204).json(Projectestimations);
  } catch (error) {
    console.log("🚀 ~ deleteProjectestimationController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
