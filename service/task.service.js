import Task from "../models/task.model.js";


export const createTask = async (data, tenantId) => {
    // console.log("service has been called");

  console.log("🚀 ~ createTask ~ tenantId:", tenantId)
  return await Task.create({ ...data, tenantId });
};
export const getTask = async (queryParams,tenantId) => {
   let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.title) {
    filter.title = {
      $regex: queryParams.title,
      $options: "i",
    };
  };
  // if (queryParams.order) {
  //   filter.order = {
  //     $regex: queryParams.order,
  //     $options: "i",
  //   };
  // };

  const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .populate("projectId stageId assignedTo");
    return tasks;
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
