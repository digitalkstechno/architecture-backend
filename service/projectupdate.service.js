import Projectupdate from "../models/projectupdate.model.js";

export const createProjectupdate = async (data, tenantId) => {
  return await Projectupdate.create({ ...data, tenantId });
};
export const getProjectupdate = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  const projectupdate = await Projectupdate.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("projectId stageId createdBy");
  return projectupdate;
};
export const getProjectupdateById = async (id, tenantId) => {
  return await Projectupdate.findOne({ _id: id, tenantId: tenantId }).populate(
    "projectId stageId createdBy",
  );
};
export const updateProjectupdate = async (id, data, tenantId) => {
  return await Projectupdate.findOneAndUpdate(
    { _id: id, tenantId: tenantId },
    data,
    {
      new: true,
    },
  );
};
export const deleteProjectupdate = async (id, tenantId) => {
  return await Projectupdate.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
