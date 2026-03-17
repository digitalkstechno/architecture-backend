import Role from "../models/role.model.js";


export const createRole = async(
    {data, 
    tenantId}) =>{
    return await Role.create({...data, tenantId});
}

export const getRole = async(tenantId) => {
    return await Role.find({tenantId}).populate('permission')
    ;
}

export const getRoleById = async(id,tenantId) => {
    return await Role.findById({_id:id,tenantId});
};

export const updateRole = async(id ,tenantId, data) => {
    return await Role.findByIdAndUpdate({_id:id,tenantId},data, {new :true});
};

export const deleteRole = async(id,tenantId) => {
    return await Role.findByIdAndDelete({_id:id, tenantId});
}