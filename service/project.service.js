import Project from "../models/project.model.js";

export const createProject = async (data, tenantId) => {
  return await Project.create({ ...data, tenantId });
};
export const getProject = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  if (queryParams.projectName) {
    filter.projectName = {
      $regex: queryParams.projectName,
      $options: "i",
    };
  }
  if (queryParams.status) {
    filter.status = {
      $regex: queryParams.status,
      $options: "i",
    };
  }

  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("clientId");

  return projects;
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
