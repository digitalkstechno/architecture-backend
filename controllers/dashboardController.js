const Project = require("../models/Project");
const OfficeTask = require("../models/OfficeTask");
const SiteTask = require("../models/SiteTask");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const SiteUpdate = require("../models/SiteUpdate");
const AgencyRegistration = require("../models/AgencyRegistration");

const getDashboardStats = async (req, res) => {
  try {
    // Role-based Access Control Setup
    const userRole = req.user && req.user.role ? (req.user.role.name || req.user.role).toLowerCase() : 'guest';
    const isAdminOrDirector = ['admin', 'director', 'architect'].includes(userRole);
    
    // Base filters
    let projectFilter = {};
    let officeTaskFilter = {};
    let siteTaskFilter = {};

    if (!isAdminOrDirector) {
      // Staff members only see their assigned projects and tasks
      projectFilter = {
        $or: [
          { workers: req.user._id },
          { supervisor: req.user._id },
          { designer: req.user._id }
        ]
      };
      officeTaskFilter = { assignedTo: req.user._id };
      siteTaskFilter = { assignedTo: req.user._id };
    }

    // 1. Project Stats
    const totalProjects = await Project.countDocuments(projectFilter);
    const activeProjects = await Project.countDocuments({ ...projectFilter, status: { $ne: "Completed" } });
    const completedProjects = await Project.countDocuments({ ...projectFilter, status: "Completed" });

    // 2. Task Stats
    const totalOfficeTasks = await OfficeTask.countDocuments(officeTaskFilter);
    const pendingOfficeTasks = await OfficeTask.countDocuments({ ...officeTaskFilter, status: { $ne: "Completed" } });
    
    const totalSiteTasks = await SiteTask.countDocuments(siteTaskFilter);
    const pendingSiteTasks = await SiteTask.countDocuments({ ...siteTaskFilter, status: { $ne: "Completed" } });

    // 3. Financial Stats (Only for Admins/Directors)
    let totalBudget = 0;
    let totalReceived = 0;
    let totalPending = 0;

    if (isAdminOrDirector) {
      const allProjects = await Project.find();
      totalBudget = allProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
      totalReceived = allProjects.reduce((sum, p) => sum + (Number(p.received) || 0), 0);
      totalPending = allProjects.reduce((sum, p) => sum + (Number(p.pending) || 0), 0);
    }

    // 4. Recent Activity
    let recentMessages = [];
    let pendingAgencies = [];
    if (isAdminOrDirector) {
      recentMessages = await Message.find().sort({ createdAt: -1 }).limit(10);
      pendingAgencies = await AgencyRegistration.find({ status: "Pending" })
        .populate("businessType", "name")
        .sort({ createdAt: -1 })
        .limit(5);
    } // Staff could potentially see messages for their projects if implemented, skipping for simplicity unless requested
    
    const recentSiteUpdates = await SiteUpdate.find(projectFilter.hasOwnProperty('$or') ? { project: { $in: await Project.find(projectFilter).distinct('_id') } } : {})
      .populate("project", "name")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 })
      .limit(10);
    
    // 5. Recent Tasks (for schedules)
    const upcomingOfficeTasks = await OfficeTask.find({ ...officeTaskFilter, status: { $ne: "Completed" } }).populate("project", "name").sort({ startDate: -1 }).limit(5);
    const upcomingSiteTasks = await SiteTask.find({ ...siteTaskFilter, status: { $ne: "Completed" } }).populate("project", "name").sort({ startDate: -1 }).limit(5);

    res.json({
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects
      },
      tasks: {
        office: { total: totalOfficeTasks, pending: pendingOfficeTasks },
        site: { total: totalSiteTasks, pending: pendingSiteTasks }
      },
      finances: {
        totalBudget,
        totalReceived,
        totalPending,
        isHidden: !isAdminOrDirector
      },
      recentActivity: {
        messages: recentMessages,
        siteUpdates: recentSiteUpdates,
        upcomingOfficeTasks,
        upcomingSiteTasks,
        pendingAgencies
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
