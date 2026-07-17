const Project = require("../models/Project");
const User = require("../models/User");

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const { page, limit, search, role, userId } = req.query;
    let filter = {};

    if (search) {
      const matchingUsers = await User.find({ name: { $regex: search, $options: "i" } }).select('_id');
      const userIds = matchingUsers.map(u => u._id);

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];

      if (userIds.length > 0) {
        filter.$or.push({ client: { $in: userIds } });
        filter.$or.push({ projectManager: { $in: userIds } });
      }
    }

    const userRole = req.user && req.user.role ? (req.user.role.name || req.user.role).toLowerCase() : 'guest';
    const isAdminOrDirector = ['admin', 'director', 'architect'].includes(userRole);

    if (!isAdminOrDirector) {
      if (userRole === 'client') {
        filter.client = req.user._id;
      } else {
        // Staff (including project manager) only see their assigned projects
        filter.$or = [
          ...(filter.$or || []),
          { projectManager: req.user._id },
          { supervisor: req.user._id },
          { workers: req.user._id }
        ];
      }
    }

    let query = Project.find(filter)
      .populate("client", "name email phone avatar")
      .populate("projectManager", "name email phone specializations about avatar")
      .populate("supervisor", "name email phone specializations about avatar")
      .populate("workers", "name email role phone specializations about avatar");

    let projects = await query.sort({ createdAt: -1 });

    const statusOrder = { "Pending": 1, "In Progress": 2, "Completed": 3, "Critical": 0, "Delayed": 0, "On Track": 2 };
    projects.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));

    const totalItems = projects.length;
    let paginatedProjects = projects;

    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      paginatedProjects = projects.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.json({
        data: paginatedProjects,
        total: totalItems,
        page: pageNum,
        totalPages: Math.ceil(totalItems / limitNum)
      });
    }

    res.json(paginatedProjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email phone avatar")
      .populate("projectManager", "name email phone specializations about avatar")
      .populate("supervisor", "name email phone specializations about avatar")
      .populate("workers", "name email role phone specializations about avatar");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/projects/:id/stage
const updateStage = async (req, res) => {
  try {
    const { stageName, status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const stage = project.stages.find((s) => s.name === stageName);
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    stage.status = status;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, updateStage };
