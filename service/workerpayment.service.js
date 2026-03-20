import Workerpayment from "../models/workerpayment.model.js";


export const createWorkerpayment = async (data, tenantId) => {
  return await Workerpayment.create({ ...data, tenantId });
};
export const getWorkerpayment = async (queryParams,tenantId) => {

   let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.paymentDate) {
    filter.paymentDate = {
      $regex: queryParams.paymentDate,
      $options: "i",
    };
  };
   const workerpayments = await Workerpayment.find(filter)
        .sort({ createdAt: -1 })
        .lean()
        .populate("projectId workerId");
      return workerpayments;

};
export const getWorkerpaymentById = async (id, tenantId) => {
  return await Workerpayment.findOne({ _id: id, tenantId: tenantId }).populate("workerId projectId");
};
export const updateWorkerpayment = async (id, data, tenantId) => {
  return await Workerpayment.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteWorkerpayment = async (id, tenantId) => {
  return await Workerpayment.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
