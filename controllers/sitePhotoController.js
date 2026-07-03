const SitePhoto = require("../models/SitePhoto");
const { uploadToExternalAPI, deleteFromExternalAPI } = require("../middleware/upload");

const getSitePhotos = async (req, res) => {
  try {
    const { project } = req.query;
    let filter = project ? { project } : {};

    const userRole = req.user && req.user.role ? (req.user.role.name || req.user.role).toLowerCase() : 'guest';
    const isAdminOrDirector = ['admin', 'director', 'architect'].includes(userRole);
    
    if (!isAdminOrDirector) {
      const Project = require("../models/Project");
      
      if (userRole === 'project manager') {
        const managedProjects = await Project.find({ projectManager: req.user._id }).select("_id");
        const projectIds = managedProjects.map(p => p._id);
        
        filter.$or = [
          { uploadedBy: req.user._id },
          { project: { $in: projectIds } }
        ];
      } else {
        // Staff see photos for projects they are assigned to
        const userProjects = await Project.find({
          $or: [
            { workers: req.user._id },
            { supervisor: req.user._id }
          ]
        }).select("_id");
        const projectIds = userProjects.map(p => p._id);
        
        filter.$or = [
          { uploadedBy: req.user._id },
          { project: { $in: projectIds } }
        ];
      }
    }
    const photos = await SitePhoto.find(filter)
      .populate("project", "name")
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadSitePhoto = async (req, res) => {
  try {
    const files = req.files?.length ? req.files : req.file ? [req.file] : [];
    if (!files.length) return res.status(400).json({ message: "No file uploaded" });

    const photos = await Promise.all(
      files.map(async (file) => {
        const fileUrl = await uploadToExternalAPI(file, "architect", "site-photos");
        if (!fileUrl) throw new Error("Failed to upload to storage");
        return SitePhoto.create({
          project: req.body.project,
          caption: req.body.caption,
          stage: req.body.stage,
          date: req.body.date,
          fileUrl,
          uploadedBy: req.user._id,
        });
      })
    );

    res.status(201).json(photos.length === 1 ? photos[0] : photos);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSitePhoto = async (req, res) => {
  try {
    const photo = await SitePhoto.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    await deleteFromExternalAPI(photo.fileUrl);
    await photo.deleteOne();

    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSitePhotos, uploadSitePhoto, deleteSitePhoto };
