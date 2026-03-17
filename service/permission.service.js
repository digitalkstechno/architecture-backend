
import Permission from "./../models/permission.model.js";
export const createPermission = async(tenantId,data) =>{
    return await Permission.create({...data,
        tenantId
    });
}

export const getPermission  = async(tenantId) => {
    return await Permission.find({tenantId})
};

export const getPermissionByid = async(id,tenantId) => {
    return Permission.findById({_id:id, tenantId})
};

export const updatePermission = async(id ,tenantId, data) => {
    return Permission.findByIdAndUpdate({_id: id, tenantId}, data, {new : true});
}

export const deletePermission = async(id,tenantId) => {
    return Permission.findByIdAndRemove({_id:id, tenantId})
}