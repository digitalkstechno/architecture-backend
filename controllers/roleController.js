const Role = require("../models/Role");

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      status: 200,
      data: roles
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({
      success: false,
      status: 404,
      message: "Role not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: role
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const roleExists = await Role.findOne({ name });
    if (roleExists) return res.status(400).json({
      success: false,
      status: 400,
      message: "Role already exists"
    });

    const role = await Role.create({ name, description, permissions });
    res.status(201).json({
      success: true,
      status: 201,
      data: role
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({
      success: false,
      status: 404,
      message: "Role not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: role
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({
      success: false,
      status: 404,
      message: "Role not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Role deleted" }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getRoles, getRole, createRole, updateRole, deleteRole };
