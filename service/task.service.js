import Task from "../models/task.model.js";


export const createTask = async (data, tenantId) => {
    // console.log("service has been called");

  console.log("🚀 ~ createTask ~ tenantId:", tenantId)
  return await Task.create({ ...data, tenantId });
};
export const getTask = async (tenantId) => {
  return await Task.find({ tenantId: tenantId }).populate("projectId stageId assignedTo");
};
export const getTaskById = async (id, tenantId) => {
  return await Task.findOne({ _id: id, tenantId: tenantId }).populate(
    "projectId stageId assignedTo",
  );
};
export const updateTask = async (id, data, tenantId) => {
  return await Task.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteTask = async (id, tenantId) => {
  return await Task.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
