import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";

export const createClientRole = async (tenantId) => {
  const permissions = await Permission.insertMany([
    { module: "PROJECT_ESTIMATION", actions: ["READ"] },
    { module: "PROJECT", actions: ["READ"] },
    { module: "PROJECT_STAGE", actions: ["READ"] },
    { module: "PROJET_TASK", actions: ["READ"] },
    { module: "WORKERTASK", actions: ["READ"] },
    { module: "PROJECT_UPDATE", actions: ["READ"] },
  ]);

  const role = await Role.create({
    roleName: "TENANT_Client",
    tenantId,
    permissions: permissions.map(p => p._id),
  });

  return role;
};
