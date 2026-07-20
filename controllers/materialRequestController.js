const MaterialRequest = require("../models/MaterialRequest");

const getMaterialRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    const requests = await MaterialRequest.find(filter).populate("requestedBy", "name email").populate("project", "name");
    res.status(200).json({
      success: true,
      status: 200,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

const createMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.create(req.body);
    res.status(201).json({
      success: true,
      status: 201,
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: error.message
    });
  }
};

const updateMaterialRequest = async (req, res) => {
  try {
    const request = await MaterialRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      status: 200,
      data: request
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: error.message
    });
  }
};

const deleteMaterialRequest = async (req, res) => {
  try {
    await MaterialRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Material Request deleted" }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

module.exports = { getMaterialRequests, createMaterialRequest, updateMaterialRequest, deleteMaterialRequest };
