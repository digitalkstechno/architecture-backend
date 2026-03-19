import Attendence from "../models/attendence.model.js";
import { createAttendence, getAttendence, getAttendenceById, updateAttendence, deleteAttendence } from "../service/attendence.service.js";


export const createAttendenceController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Attendences = await createAttendence(req.body, tenantId);
    return res.status(201).json(Attendences);
  } catch (error) {
    console.log("🚀 ~ createAttendenceController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getAttendenceController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Attendences = await getAttendence(req.query, tenantId);
         const total = await Attendence.countDocuments({
                  tenantId: tenantId, // ✅ FIX
                });
            
                return res.status(200).json({
                  success: true,
                  message: "Attendences retrieved successfully",
                  Attendences,
                  pagination: {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    total,
                    pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
                  },
                });
  } catch (error) {
    console.log("🚀 ~ getAttendenceController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getAttendenceByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Attendences = await getAttendenceById(req.params.id, tenantId);
    return res.status(200).json(Attendences);
  } catch (error) {
    console.log("🚀 ~ getAttendenceByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateAttendenceController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Attendence = await updateAttendence(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Attendence);
  } catch (error) {
    console.log("🚀 updateAttendenceController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteAttendenceController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Attendences = await deleteAttendence(req.params.id , tenantId);
    return res.status(204).json(Attendences);
  } catch (error) {
    console.log("🚀 ~ deleteAttendenceController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
