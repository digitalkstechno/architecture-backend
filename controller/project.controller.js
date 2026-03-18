import {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "../service/project.service.js";

export const createProjectController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projects = await createProject(req.body, tenantId);
    return res.status(201).json(projects);
  } catch (error) {
    console.log("🚀 ~ createProjectController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getProjectController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projects = await getProject( tenantId);
    return res.status(200).json(projects);
  } catch (error) {
    console.log("🚀 ~ getProjectController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projects = await getProjectById(req.params.id, tenantId);
    return res.status(200).json(projects);
  } catch (error) {
    console.log("🚀 ~ getProjectByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProjectController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const project = await updateProject(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(project);
  } catch (error) {
    console.log("🚀 updateProjectController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteProjectController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const projects = await deleteProject(req.params.id , tenantId);
    return res.status(204).json(projects);
  } catch (error) {
    console.log("🚀 ~ deleteProjectController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
