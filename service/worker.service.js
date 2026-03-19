import Worker from "../models/worker.model.js";

export const createWorker = async (data, tenantId) => {
  return await Worker.create({ ...data, tenantId });
};
export const getWorker = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.name) {
    filter.name = {
      $regex: queryParams.name,
      $options: "i",
    };
  }
  if (queryParams.phone) {
    filter.phone = {
      $regex: queryParams.phone,
      $options: "i",
    };
  }
  if (queryParams.skill) {
    filter.skill = {
      $regex: queryParams.skill,
      $options: "i",
    };
  }
  if (queryParams.experienceYears) {
    filter.experienceYears = {
      $regex: queryParams.experienceYears,
      $options: "i",
    };
  }
  if (queryParams.wageType) {
    filter.wageType = {
      $regex: queryParams.wageType,
      $options: "i",
    };
  }

  const workers = await Worker.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("createdBy");
  return workers;
};

export const getWorkerById = async (id, tenantId) => {
  return await Worker.findOne({ _id: id, tenantId: tenantId }).populate(
    "createdBy",
  );
};
export const updateWorker = async (id, data, tenantId) => {
  return await Worker.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteWorker = async (id, tenantId) => {
  return await Worker.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
