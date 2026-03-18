import Client from "../models/client.model.js";


export const createClient = async(data, tenantId) =>{

    return await Client.create({...data, tenantId});
};
export const getClient = async(tenantId) =>{

    return await Client.find({tenantId: tenantId });
    // .populate("tenantId")
};
export const getClientbyId = async (id, tenantId) => {
  return await Client.findOne({
    _id: id,
    tenantId: tenantId
  });

//   .populate("tenantId")
};
export const updateClient = async (id, data, tenantId) => {
  return await Client.findOneAndUpdate(
    { _id: id, tenantId: tenantId },
    data,
    { new: true }
  );
};
export const deleteClient = async(id, tenantId) =>{

    return await Client.findByIdAndDelete({_id :id,tenantId: tenantId});
};