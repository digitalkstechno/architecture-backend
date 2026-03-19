import Role from "../models/role.model.js";

export const createRole = async ({ data, tenantId }) => {
  return await Role.create({ ...data, tenantId });
};

export const getRole = async (queryParams, tenantId) => {
  let filter = {
    tenantId: tenantId, // ✅ IMPORTANT
  };

  if (queryParams.roleName) {
    filter.roleName = {
      $regex: queryParams.roleName,
      $options: "i",
    };
  }

  const roles = await Role.find(filter)
    .populate("permissions")
    .sort({ createdAt: -1 })
    .lean();

  return roles;
};

export const getRoleById = async (id, tenantId) => {
  return await Role.findById({ _id: id, tenantId });
};

export const updateRole = async (id, tenantId, data) => {
  return await Role.findByIdAndUpdate({ _id: id, tenantId }, data, {
    new: true,
  });
};

export const deleteRole = async (id, tenantId) => {
  return await Role.findByIdAndDelete({ _id: id, tenantId });
};
