import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";

export const createTenantAdminRole = async (tenantId) => {
  const permissions = await Permission.insertMany([
    { module: "USER", actions: ["READ","CREATE"] },
    { module: "ROLE", actions: ["READ","CREATE"] },
    { module: "PERMISSION", actions: ["READ","CREATE"] },
    { module: "PROJECT_ESTIMATION", actions: ["READ", "CREATE"] },
    { module: "PROJECT", actions: ["READ", "CREATE"] },
    { module: "PROJECT_STAGE", actions: ["READ", "CREATE"] },
    { module: "PROJET_TASK", actions: ["READ","CREATE"] },
    { module: "PROJECT_UPDATE", actions: ["READ","CREATE"] },
    { module: "PAYMENT_LEDGER", actions: ["READ","CREATE"] },
    { module: "PAYMENT", actions: ["READ","CREATE"] },
    { module: "BANK_BRIEF", actions: ["READ","CREATE"] },
    { module: "CLIENT", actions: ["READ","CREATE"] },
  ]);

  const role = await Role.create({
    roleName: "TENANT_ADMIN",
    tenantId,
    permissions: permissions.map(p => p._id),
  });

  return role;
};
