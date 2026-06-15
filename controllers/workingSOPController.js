const WorkingSOP = require("../models/WorkingSOP");
const { uploadToExternalAPI, deleteFromExternalAPI } = require("../middleware/upload");

// @desc    Get all Working SOPs
// @route   GET /api/working-sops
// @access  Private
exports.getSOPs = async (req, res) => {
  try {
    const sops = await WorkingSOP.find().populate("allowedRoles", "name").sort({ createdAt: -1 });
    res.status(200).json(sops);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch SOPs", error: error.message });
  }
};

// @desc    Create a new Working SOP
// @route   POST /api/working-sops
// @access  Private (Admin/Architect)
exports.createSOP = async (req, res) => {
  try {
    const { title, allowedRoles, videoUrl } = req.body;
    let finalVideoUrl = videoUrl;

    if (req.file) {
      // Upload to external API if a file is provided
      const uploadedUrl = await uploadToExternalAPI(req.file, 'architect', 'sop_videos');
      if (uploadedUrl) {
        finalVideoUrl = uploadedUrl;
      } else {
        return res.status(400).json({ message: "Failed to upload video file" });
      }
    }

    if (!finalVideoUrl) {
      return res.status(400).json({ message: "Video URL or Video File is required" });
    }

    const newSOP = await WorkingSOP.create({
      title,
      videoUrl: finalVideoUrl,
      allowedRoles: allowedRoles ? JSON.parse(allowedRoles) : [],
      uploadedBy: req.user.id
    });

    const populatedSOP = await WorkingSOP.findById(newSOP._id).populate("allowedRoles", "name");
    
    res.status(201).json(populatedSOP);
  } catch (error) {
    res.status(500).json({ message: "Failed to create SOP", error: error.message });
  }
};

// @desc    Delete an SOP
// @route   DELETE /api/working-sops/:id
// @access  Private (Admin/Architect)
exports.deleteSOP = async (req, res) => {
  try {
    const sop = await WorkingSOP.findById(req.params.id);
    if (!sop) {
      return res.status(404).json({ message: "SOP not found" });
    }

    // Try to delete external file if it's hosted on our service
    if (sop.videoUrl && sop.videoUrl.includes('service.digitalks.co.in')) {
      await deleteFromExternalAPI(sop.videoUrl).catch(err => console.error("External file delete error:", err));
    }

    await sop.deleteOne();
    res.status(200).json({ message: "SOP deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete SOP", error: error.message });
  }
};

// @desc    Update an SOP
// @route   PUT /api/working-sops/:id
// @access  Private (Admin/Architect)
exports.updateSOP = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, allowedRoles, videoUrl } = req.body;
    const sop = await WorkingSOP.findById(id);

    if (!sop) {
      return res.status(404).json({ message: "SOP not found" });
    }

    let finalVideoUrl = videoUrl || sop.videoUrl;

    if (req.file) {
      // Upload new file
      const uploadedUrl = await uploadToExternalAPI(req.file, 'architect', 'sop_videos');
      if (uploadedUrl) {
        // Try to delete old file
        if (sop.videoUrl && sop.videoUrl.includes('service.digitalks.co.in')) {
          await deleteFromExternalAPI(sop.videoUrl).catch(err => console.error("External file delete error:", err));
        }
        finalVideoUrl = uploadedUrl;
      } else {
        return res.status(400).json({ message: "Failed to upload new video file" });
      }
    }

    sop.title = title || sop.title;
    sop.videoUrl = finalVideoUrl;
    if (allowedRoles) {
      sop.allowedRoles = JSON.parse(allowedRoles);
    }

    await sop.save();
    const populatedSOP = await WorkingSOP.findById(sop._id).populate("allowedRoles", "name");
    
    res.status(200).json(populatedSOP);
  } catch (error) {
    res.status(500).json({ message: "Failed to update SOP", error: error.message });
  }
};
