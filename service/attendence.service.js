import Attendence from "../models/attendence.model.js";

export const createAttendence = async (data, tenantId) => {
  return await Attendence.create({ ...data, tenantId });
};
export const getAttendence = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.date) {
    filter.date = {
      $regex: queryParams.date,
      $options: "i",
    };
  }
  if (queryParams.status) {
    filter.status = {
      $regex: queryParams.status,
      $options: "i",
    };
  }
  const attendence = await Attendence.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("projectId workerId markedBy");
  return attendence;
};
export const getAttendenceById = async (id, tenantId) => {
  return await Attendence.findOne({ _id: id, tenantId: tenantId }).populate(
    "projectId workerId markedBy",
  );
};
export const updateAttendence = async (id, data, tenantId) => {
  return await Attendence.findOneAndUpdate(
    { _id: id, tenantId: tenantId },
    data,
    {
      new: true,
    },
  );
};
export const deleteAttendence = async (id, tenantId) => {
  return await Attendence.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
