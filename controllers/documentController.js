const Document = require("../models/Document");
const { uploadToExternalAPI, deleteFromExternalAPI } = require("../middleware/upload");
const axios = require("axios");

const getDocuments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    const documents = await Document.find(filter).populate("uploadedBy", "name email").populate("project", "name");
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const fileUrl = await uploadToExternalAPI(req.file, "architect", "documents");
    if (!fileUrl) throw new Error("Failed to upload file");

    const doc = await Document.create({
      ...req.body,
      fileUrl,
      uploadedBy: req.user._id
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    await deleteFromExternalAPI(doc.fileUrl);
    await doc.deleteOne();
    
    res.json({ message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    
    // Redirect to the external URL to trigger download
    // Cloudinary URLs can have 'fl_attachment' added to force download, but redirecting works generally
    const downloadUrl = doc.fileUrl.includes('cloudinary') 
      ? doc.fileUrl.replace('/upload/', '/upload/fl_attachment/')
      : doc.fileUrl;
      
    try {
      const response = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream'
      });
      
      const ext = downloadUrl.split('.').pop() || 'pdf';
      const safeTitle = (doc.title || 'document').replace(/[^a-zA-Z0-9-_\s]/g, '').trim().replace(/\s+/g, '_');
      const filename = `${safeTitle}.${ext}`;

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', response.headers['content-type']);
      
      response.data.pipe(res);
    } catch (fetchError) {
      console.error('Download stream error:', fetchError.message);
      res.redirect(downloadUrl);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDocuments, createDocument, deleteDocument, downloadDocument };
