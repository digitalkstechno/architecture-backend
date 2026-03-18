import { createProjectupdate, deleteProjectupdate, getProjectupdate,getProjectupdateById, updateProjectupdate } from "../service/projectupdate.service.js";



export const createProjectupdateController = async (req, res) => {
  try {

    const data = { ...req.body };
    const tenantId = req.user.tenantId;

    /* ===== multiple images ===== */

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => file.filename);
    }

    const projectupdate = await createProjectupdate(data, tenantId);

    return res.status(201).json(projectupdate);

  } catch (error) {
    console.log("🚀 createProjectupdateController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getProjectupdateController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectupdates = await getProjectupdate( tenantId);
    return res.status(200).json(Projectupdates);
  } catch (error) {
    console.log("🚀 ~ getProjectupdateController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getProjectupdateByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectupdates = await getProjectupdateById(req.params.id, tenantId);
    return res.status(200).json(Projectupdates);
  } catch (error) {
    console.log("🚀 ~ getProjectupdateByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateProjectupdateController = async (req, res) => {
  try {

    const tenantId = req.user.tenantId;
    const data = { ...req.body };

    /* ===== image handle ===== */

    if (req.files && req.files.length > 0) {
      data.images = req.files.map(file => file.filename);
    }

    const projectupdate = await updateProjectupdate(
      req.params.id,
      data,
      tenantId
    );

    return res.status(200).json(projectupdate);

  } catch (error) {
    console.log("🚀 updateProjectupdateController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteProjectupdateController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Projectupdates = await deleteProjectupdate(req.params.id , tenantId);
    return res.status(204).json(Projectupdates);
  } catch (error) {
    console.log("🚀 ~ deleteProjectupdateController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
