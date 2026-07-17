const SiteTask = require("../models/SiteTask");
const OfficeTask = require("../models/OfficeTask");

const getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};

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
    }

    const [siteTasks, officeTasks] = await Promise.all([
      SiteTask.find(filter).populate("project", "name").populate("assignedTo", "name email phone specializations about avatar").populate("assignedBy", "name phone specializations about avatar"),
      OfficeTask.find(filter).populate("project", "name").populate("assignedTo", "name email phone specializations about avatar").populate("assignedBy", "name phone specializations about avatar"),
    ]);

    const mapped = [
      ...siteTasks.map((t) => ({ ...t.toObject(), type: "Site" })),
      ...officeTasks.map((t) => ({ ...t.toObject(), type: "Office" })),
    ];

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks };
