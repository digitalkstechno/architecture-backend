const Client = require("../models/Client");

const getClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("projects", "name status progress").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      status: 200,
      data: clients
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("projects");
    if (!client) return res.status(404).json({
      success: false,
      status: 404,
      message: "Client not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: client
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({
      success: true,
      status: 201,
      data: client
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({
      success: false,
      status: 404,
      message: "Client not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: client
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({
      success: false,
      status: 404,
      message: "Client not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Client deleted" }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };
