const Project = require("../models/Project");
const OfficeTask = require("../models/OfficeTask");
const SiteTask = require("../models/SiteTask");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const SiteUpdate = require("../models/SiteUpdate");

const getDashboardStats = async (req, res) => {
  try {
    // 1. Project Stats
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $ne: "Completed" } });
    const completedProjects = await Project.countDocuments({ status: "Completed" });

    // 2. Task Stats
    const totalOfficeTasks = await OfficeTask.countDocuments();
    const pendingOfficeTasks = await OfficeTask.countDocuments({ status: { $ne: "Completed" } });
    
    const totalSiteTasks = await SiteTask.countDocuments();
    const pendingSiteTasks = await SiteTask.countDocuments({ status: { $ne: "Completed" } });

    // 3. Financial Stats
    const payments = await Payment.find();
    let totalBudget = 0;
    let totalReceived = 0;
    let totalPending = 0;

    payments.forEach(p => {
      const amount = Number(p.amount) || 0;
      totalBudget += amount;
      if (p.status === "Paid") totalReceived += amount;
      else if (p.status === "Pending") totalPending += amount;
    });

    // 4. Recent Activity
    const recentMessages = await Message.find().sort({ createdAt: -1 }).limit(10);
    const recentSiteUpdates = await SiteUpdate.find().populate("project", "name").sort({ createdAt: -1 }).limit(10);
    
    // 5. Recent Tasks (for schedules)
    const upcomingOfficeTasks = await OfficeTask.find({ status: { $ne: "Completed" } }).populate("project", "name").sort({ startDate: -1 }).limit(5);
    const upcomingSiteTasks = await SiteTask.find({ status: { $ne: "Completed" } }).populate("project", "name").sort({ startDate: -1 }).limit(5);

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
        totalPending
      },
      recentActivity: {
        messages: recentMessages,
        siteUpdates: recentSiteUpdates,
        upcomingOfficeTasks,
        upcomingSiteTasks
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
