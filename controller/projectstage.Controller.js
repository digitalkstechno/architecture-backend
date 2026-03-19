import Projectstage from "../models/projectstage.model.js";
import { createProjectStage, getProjectStage, getProjectStageById, updateProjectStage, deleteProjectStage } from "../service/projectstage.service.js";



export const createProjectstageController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projectstage = await createProjectStage(req.body, tenantId);
    return res.status(201).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ createProjectstageController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getProjectstageController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projectstage = await getProjectStage(req.query, tenantId);
    const total = await Projectstage.countDocuments({
                  tenantId: tenantId, // ✅ FIX
                });

    return res.status(200).json({
      success: true,
      message: "Projectstage retrieved successfully",
      projectstage,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getProjectstageController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectstageByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projectstage = await getProjectStageById(req.params.id, tenantId);
    return res.status(200).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ getProjectstageByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProjectstageController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const projectstage = await updateProjectStage(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(projectstage);
  } catch (error) {
    console.log("🚀 updateProjectstageController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteProjectstageController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projectstage = await deleteProjectStage(req.params.id , tenantId);
    return res.status(204).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ updateProjectstageController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
