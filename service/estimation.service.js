import Projectestimation from "../models/estimation.model.js";


export const createProjectestimation = async (data, tenantId) => {
  return await Projectestimation.create({ ...data, tenantId });
};
export const getProjectestimation = async (tenantId) => {
  return await Projectestimation.find({ tenantId: tenantId }).populate("projectId clientId");
};
export const getProjectestimationById = async (id, tenantId) => {
  return await Projectestimation.findOne({ _id: id, tenantId: tenantId }).populate("projectId clientId");
};
export const updateProjectestimation = async (id, data, tenantId) => {
  return await Projectestimation.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteProjectestimation = async (id, tenantId) => {
  return await Projectestimation.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
