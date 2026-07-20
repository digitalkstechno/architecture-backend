const OfficeTask = require("../models/OfficeTask");
const { uploadToExternalAPI } = require("../middleware/upload");
const { recalculateProjectProgress } = require("../utils/projectProgress");
const { sendNotification, notifyDirectors } = require("../utils/notification");

const getOfficeTasks = async (req, res) => {
  try {
    const { project, page, limit, category, assignedTo, search } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };
    
    // RBAC: If not Admin/Director, strictly filter by assignedTo
    const userRole = req.user && req.user.role ? (req.user.role.name || req.user.role).toLowerCase() : 'guest';
    const isAdminOrDirector = ['admin', 'director', 'architect'].includes(userRole);
    if (!isAdminOrDirector) {
      if (userRole === 'project manager') {
        const Project = require("../models/Project");
        const managedProjects = await Project.find({ projectManager: req.user._id }).select("_id");
        const projectIds = managedProjects.map(p => p._id);
        
        filter.$or = [
          { assignedTo: req.user._id },
          { project: { $in: projectIds } }
        ];
      } else if (userRole === 'client') {
        const Project = require("../models/Project");
        const clientProjects = await Project.find({ client: req.user._id }).select("_id");
        const projectIds = clientProjects.map(p => p._id);
        
        filter.project = { $in: projectIds };
      } else {
        filter.assignedTo = req.user._id;
      }
    } else if (assignedTo) {
      filter.assignedTo = assignedTo;
    }
    
    let query = OfficeTask.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email phone specializations about avatar")
      .populate("assignedBy", "name phone specializations about avatar")
      .lean();

    let tasks = await query.sort({ createdAt: -1 });

    const statusOrder = { "Pending": 1, "In Progress": 2, "Completed": 3, "Critical": 0, "Delayed": 0, "On Track": 2 };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      if (statusDiff !== 0) return statusDiff;

      // If status is same, sort by closest end date to today
      if (a.endDate && b.endDate) {
        const dateA = new Date(a.endDate);
        dateA.setHours(0, 0, 0, 0);
        const diffA = Math.abs(dateA - today);

        const dateB = new Date(b.endDate);
        dateB.setHours(0, 0, 0, 0);
        const diffB = Math.abs(dateB - today);

        return diffA - diffB;
      } else if (a.endDate) {
        return -1;
      } else if (b.endDate) {
        return 1;
      }
      return 0;
    });

    const mappedTasks = tasks.map(task => {
      if (task.progress === 0 || task.progress == null) {
        if (task.status === 'Completed') task.progress = 100;
        else if (task.status === 'In Progress') task.progress = 50;
        else task.progress = 0;
      }
      return task;
    });

    const totalItems = mappedTasks.length;
    let paginatedTasks = mappedTasks;

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      paginatedTasks = mappedTasks.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.status(200).json({
        success: true,
        status: 200,

        data: {
          data: paginatedTasks,
          total: totalItems,
          page: pageNum,
          totalPages: Math.ceil(totalItems / limitNum)
        }
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: paginatedTasks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const getOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email phone specializations about avatar")
      .populate("assignedBy", "name phone specializations about avatar");
    if (!task) return res.status(404).json({
      success: false,
      status: 404,
      message: "Office Task not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const createOfficeTask = async (req, res) => {
  try {
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress') req.body.progress = 50;
      else if (req.body.status === 'Pending') req.body.progress = 0;
    }
    req.body.assignedBy = req.user._id;
    const task = await OfficeTask.create(req.body);
    await recalculateProjectProgress(task.project);
    
    if (task.assignedTo && task.assignedTo.length > 0) {
      await sendNotification(task.assignedTo, `New Office Task assigned: ${task.title}`, 'task_assigned', task._id);
    }

    res.status(201).json({
      success: true,
      status: 201,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const updateOfficeTask = async (req, res) => {
  try {
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress') req.body.progress = 50;
      else if (req.body.status === 'Pending') req.body.progress = 0;
    }
    const task = await OfficeTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({
      success: false,
      status: 404,
      message: "Office Task not found"
    });
    await recalculateProjectProgress(task.project);
    
    if (req.body.status && req.body.status !== 'Pending') {
      await notifyDirectors(`Office Task "${task.title}" is now ${req.body.status}`, 'task_completed', task._id);
    }
    
    res.status(200).json({
      success: true,
      status: 200,
      data: task
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const deleteOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({
      success: false,
      status: 404,
      message: "Office Task not found"
    });
    await recalculateProjectProgress(task.project);
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Office Task deleted" }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const uploadOfficeTaskImages = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id);
    if (!task) return res.status(404).json({
      success: false,
      status: 404,
      message: "Office Task not found"
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No files uploaded"
      });
    }

    const uploadPromises = req.files.map(file => uploadToExternalAPI(file, 'architect', 'office-tasks'));
    const imageUrls = await Promise.all(uploadPromises);
    const validUrls = imageUrls.filter(url => url !== null);

    task.images = [...(task.images || []), ...validUrls];
    await task.save();

    res.status(200).json({
      success: true,
      status: 200,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const deleteOfficeTaskImage = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id);
    if (!task) return res.status(404).json({
      success: false,
      status: 404,
      message: "Office Task not found"
    });
    const { imageUrl } = req.body;
    task.images = (task.images || []).filter(img => img !== imageUrl);
    await task.save();
    res.status(200).json({
      success: true,
      status: 200,
      data: task
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getOfficeTasks, getOfficeTask, createOfficeTask, updateOfficeTask, deleteOfficeTask, uploadOfficeTaskImages, deleteOfficeTaskImage };
