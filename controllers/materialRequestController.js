const MaterialRequest = require("../models/MaterialRequest");

const getMaterialRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    const requests = await MaterialRequest.find(filter).populate("requestedBy", "name email").populate("project", "name");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMaterialRequest = async (req, res) => {
  try {
    await MaterialRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Material Request deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMaterialRequests, createMaterialRequest, updateMaterialRequest, deleteMaterialRequest };
