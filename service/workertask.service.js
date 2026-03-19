import Workertask from "../models/workertask.model.js";


export const createWorkertask = async (data, tenantId) => {
  return await Workertask.create({ ...data, tenantId });
};
export const getWorkertask = async (queryParams,tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.workertask) {
    filter.workertask = {
      $regex: queryParams.workertask,
      $options: "i",
    };
  }
  
  const workertasks = await Workertask.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .populate("projectId workerId supervisorId taskid");
    return workertasks;
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

