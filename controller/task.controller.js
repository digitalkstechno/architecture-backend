import Task from "../models/task.model.js";
import {
  createTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../service/task.service.js";

export const createTaskController = async (req, res) => {
  try {
    // console.log("I have  been called");
    const tenantId = req.user.tenantId;
    // console.log("🚀 ~ createTaskController ~ tenantId:", tenantId)
    const Tasks = await createTask(req.body, tenantId);
    return res.status(201).json(Tasks);
  } catch (error) {
    console.log("🚀 ~ createTaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const getTaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Tasks = await getTask(req.query, tenantId);
    const total = await Task.countDocuments({
                          tenantId: tenantId, // ✅ FIX
                        });

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      Tasks,
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        total,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10)),
      },
    });
  } catch (error) {
    console.log("🚀 ~ getTaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getTaskByIdController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Tasks = await getTaskById(req.params.id, tenantId);
    return res.status(200).json(Tasks);
  } catch (error) {
    console.log("🚀 ~ getTaskByIdController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const updateTaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const Task = await updateTask(
      req.params.id,
      req.body,
      tenantId
    );

    return res.status(200).json(Task);
  } catch (error) {
    console.log("🚀 updateTaskController error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteTaskController = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const Tasks = await deleteTask(req.params.id , tenantId);
    return res.status(204).json(Tasks);
  } catch (error) {
    console.log("🚀 ~ deleteTaskController ~ error:", error);
    return res.status(500).json({ error: error.message });
  }
};
