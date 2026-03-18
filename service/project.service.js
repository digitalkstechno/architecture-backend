import Project from "../models/project.model.js";

export const createProject = async (data, tenantId) => {
  return await Project.create({ ...data, tenantId });
};
export const getProject = async (tenantId) => {
  return await Project.find({ tenantId: tenantId }).populate("clientId");
};
export const getProjectById = async (id, tenantId) => {
  return await Project.findOne({ _id: id, tenantId: tenantId }).populate(
    "clientId",
  );
};
export const updateProject = async (id, data, tenantId) => {
  return await Project.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteProject = async (id, tenantId) => {
  return await Project.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
