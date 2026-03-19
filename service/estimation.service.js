import Projectestimation from "../models/estimation.model.js";

export const createProjectestimation = async (data, tenantId) => {
  return await Projectestimation.create({ ...data, tenantId });
};
export const getProjectestimation = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  if (queryParams.status) {
    filter.status = {
      $regex: queryParams.status,
      $options: "i",
    };
  }
  const projectestimation = await Projectestimation.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("clientId projectId");
  return projectestimation;
};
export const getProjectestimationById = async (id, tenantId) => {
  return await Projectestimation.findOne({
    _id: id,
    tenantId: tenantId,
  }).populate("projectId clientId");
};
export const updateProjectestimation = async (id, data, tenantId) => {
  return await Projectestimation.findOneAndUpdate(
    { _id: id, tenantId: tenantId },
    data,
    {
      new: true,
    },
  );
};
export const deleteProjectestimation = async (id, tenantId) => {
  return await Projectestimation.findByIdAndDelete({
    _id: id,
    tenantId: tenantId,
  });
};
