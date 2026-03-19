import Role from "../models/role.model.js";
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
    const roles = await getRole(req.query,tenantId);
     const total = await Role.countDocuments({
          tenantId: tenantId, // ✅ FIX
        });
    return res.status(200).json({
      success: true,
      message: "Role retrieved successfully",
      roles,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
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
