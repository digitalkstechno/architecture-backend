import Client from "../models/client.model.js";
import {
  createClient,
  getClient,
  getClientbyId,
  updateClient,
  deleteClient,
} from "../service/client.service.js";

export const creatClientController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const clients = await createClient(req.body, tenantId);

    return res.status(201).json(clients);
  } catch (error) {
    console.log("🚀 ~ createClientController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getClientController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const clients = await getClient(req.query, tenantId);
    const total = await Client.countDocuments({
      tenantId: tenantId, // ✅ FIX
    });
    return res.status(200).json({
      success: true,
      message: "Clients retrieved successfully",
      clients,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getClientController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getClientByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const clients = await getClientbyId(req.params.id, tenantId);
    return res.status(200).json(clients);
  } catch (error) {
    console.log("🚀 ~ getClientByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateClientController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const clients = await updateClient(req.params.id, req.body, tenantId);

    return res.status(200).json(clients);
  } catch (error) {
    console.log("🚀 ~ updateClientController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteClientController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const clients = await deleteClient(req.params.id, tenantId);
    return res.status(204).json(clients);
  } catch (error) {
    console.log("🚀 ~ updateClientController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
