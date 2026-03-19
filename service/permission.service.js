import Permission from "./../models/permission.model.js";
export const createPermission = async (tenantId, data) => {
  return await Permission.create({ ...data, tenantId });
};

export const getPermission = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  if (queryParams.permissionName) {
    filter.permissionName = {
      $regex: queryParams.permissionName,
      $options: "i",
    };
  }

  const permissions = await Permission.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return permissions;
};

export const getPermissionByid = async (id, tenantId) => {
  return Permission.findById({ _id: id, tenantId });
};

export const updatePermission = async (id, tenantId, data) => {
  return Permission.findByIdAndUpdate({ _id: id, tenantId }, data, {
    new: true,
  });
};

export const deletePermission = async (id, tenantId) => {
  return Permission.findByIdAndRemove({ _id: id, tenantId });
};
