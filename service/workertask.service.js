import Workertask from "../models/workertask.model.js";


export const createWorkertask = async (data, tenantId) => {
  return await Workertask.create({ ...data, tenantId });
};
export const getWorkertask = async (tenantId) => {
  return await Workertask.find({ tenantId: tenantId }).populate("projectId workerId supervisorId taskid");
};
export const getWorkertaskById = async (id, tenantId) => {
  return await Workertask.findOne({ _id: id, tenantId: tenantId }).populate("projectId workerId supervisorId taskid");
};
export const updateWorkertask = async (id, data, tenantId) => {
  return await Workertask.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteWorkertask = async (id, tenantId) => {
  return await Workertask.findByIdAndDelete({ _id: id, tenantId: tenantId });
};

