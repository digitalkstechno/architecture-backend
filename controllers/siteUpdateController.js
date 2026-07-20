const SiteUpdate = require("../models/SiteUpdate");

const getSiteUpdates = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const updates = await SiteUpdate.find(filter)
      .populate("project", "name")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      status: 200,
      data: updates
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const getSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findById(req.params.id)
      .populate("project", "name")
      .populate("postedBy", "name");
    if (!update) return res.status(404).json({
      success: false,
      status: 404,
      message: "Site update not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: update
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const createSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({
      success: true,
      status: 201,
      data: update
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const updateSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) return res.status(404).json({
      success: false,
      status: 404,
      message: "Site update not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: update
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const deleteSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findByIdAndDelete(req.params.id);
    if (!update) return res.status(404).json({
      success: false,
      status: 404,
      message: "Site update not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Site update deleted" }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getSiteUpdates, getSiteUpdate, createSiteUpdate, updateSiteUpdate, deleteSiteUpdate };
