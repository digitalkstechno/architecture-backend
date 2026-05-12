import Projectstage from "../models/projectstage.model.js";
import { createProjectStage, getProjectStage, getProjectStageById, updateProjectStage, deleteProjectStage } from "../service/projectstage.service.js";



const getTenantId = (req) => req.user.tenantId?._id || req.user.tenantId;

export const createProjectstageController = async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const { projectId, order } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "projectId is required" });
    }

    // Check if stage with same order already exists for this project
    const existingStage = await Projectstage.findOne({ projectId, order, tenantId });
    if (existingStage) {
      return res.status(400).json({ error: `Stage with order ${order} already exists for this project.` });
    }

    const projectstage = await createProjectStage(req.body, tenantId);
    return res.status(201).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ createProjectstageController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getProjectstageController = async (req, res) => {
  try {

    // console.log("controller called")
    const tenantId = getTenantId(req);
    const projectstage = await getProjectStage(req.query, tenantId);
    
    const countFilter = { tenantId: tenantId };
    if (req.query.projectId) countFilter.projectId = req.query.projectId;
    
    const total = await Projectstage.countDocuments(countFilter);

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
    const tenantId = getTenantId(req);
    const projectstage = await getProjectStageById(req.params.id, tenantId);
    return res.status(200).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ getProjectstageByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProjectstageController = async (req, res) => {
  try {
    const tenantId = getTenantId(req);

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
    const tenantId = getTenantId(req);
    const projectstage = await deleteProjectStage(req.params.id , tenantId);
    return res.status(204).json(projectstage);
  } catch (error) {
    console.log("🚀 ~ updateProjectstageController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
