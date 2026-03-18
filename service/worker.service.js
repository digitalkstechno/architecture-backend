import Worker from "../models/worker.model.js";


export const createWorker = async (data, tenantId) => {
  return await Worker.create({ ...data, tenantId });
};
export const getWorker = async (tenantId) => {
  return await Worker.find({ tenantId: tenantId }).populate("createdBy");
};
export const getWorkerById = async (id, tenantId) => {
  return await Worker.findOne({ _id: id, tenantId: tenantId }).populate("createdBy");
};
export const updateWorker = async (id, data, tenantId) => {
  return await Worker.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteWorker = async (id, tenantId) => {
  return await Worker.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
