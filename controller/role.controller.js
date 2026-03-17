import {
  createRole,
  updateRole,
  getRole,
  getRoleById,
  deleteRole,
} from "../service/role.service.js";

export const createRoleController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const roles = await createRole({
      data: req.body,
      tenantId
    });

    return res.status(201).json(roles);
  } catch (error) {
    console.log("🚀 ~ createRoleController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getRoleController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const roles = await getRole(tenantId);
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getRolebyIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const roles = await getRoleById(req.params.id,tenantId);
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const updateRoleController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const roles = await updateRole(req.params.id,tenantId,req.body);
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deleteRoleController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const roles = await deleteRole(req.params.id,tenantId);
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
