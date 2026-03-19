import Permission from "../models/permission.model.js";
import {
  getPermission,
  getPermissionByid,
  createPermission,
  updatePermission,
  deletePermission,
} from "../service/permission.service.js";

export const createPermissionController = async (req, res) => {
  try {
    // console.log("controller called");
    const tenantId = req.user.tenantId;
    const permissions = await createPermission(tenantId,req.body);
    return res.status(201).json(permissions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

export const getPermissionController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const permissions = await getPermission(req.query,tenantId);
    const total = await Permission.countDocuments({
              tenantId: tenantId, // ✅ FIX
            });
    return res.status(200).json({
      success: true,
      message: "Permissions retrieved successfully",
      permissions,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    return res.staus(500).json({ error: message.error });
  }
};
export const getPermissionbyIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const permissions = await getPermissionByid(req.params.id,tenantId);
    return res.status(200).json(permissions);
  } catch (error) {
    return res.staus(500).json({ error: message.error });
  }
};
export const updatePermissionController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const permissions = await updatePermission(req.params.id,tenantId, req.body);
    return res.status(200).json(permissions);
  } catch (error) {
    return res.staus(500).json({ error: message.error });
  }
};
export const deletePermissionController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const permissions = await deletePermission(req.params.id,tenantId);
    return res.status(200).json(permissions);
  } catch (error) {
    return res.staus(500).json({ error: message.error });
  }
};
