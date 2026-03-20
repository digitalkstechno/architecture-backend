import Paymentroll from "../models/payment.model.js";


export const createPayment = async(data ,tenantId ) =>{
    return await Paymentroll.create({...data, tenantId});
};
export const getpayment = async (queryParams,tenantId) => {

   let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };
  if (queryParams.paymentDate) {
    filter.paymentDate = {
      $regex: queryParams.paymentDate,
      $options: "i",
    };
  };
  if (queryParams.paymentType) {
    filter.paymentType = {
      $regex: queryParams.paymentType,
      $options: "i",
    };
  };
   const payments = await Paymentroll.find(filter)
        .sort({ createdAt: -1 })
        .lean()
        .populate("projectId paidTo");
      return payments;

};
export const getpaymentById = async (id, tenantId) => {
  return await Paymentroll.findOne({ _id: id, tenantId: tenantId }).populate("paidTo projectId");
};
export const updatepayment = async (id, data, tenantId) => {
  return await Paymentroll.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deletepayment = async (id, tenantId) => {
  return await Paymentroll.findByIdAndDelete({ _id: id, tenantId: tenantId });
};
