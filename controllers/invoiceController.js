const Invoice = require("../models/Invoice");

const getInvoices = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    if (req.query.client) filter.client = req.query.client;
    const invoices = await Invoice.find(filter).populate("client", "name email").populate("project", "name");
    res.status(200).json({
      success: true,
      status: 200,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({
      success: true,
      status: 201,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: error.message
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      status: 200,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 400,
      message: error.message
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Invoice deleted" }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message
    });
  }
};

module.exports = { getInvoices, createInvoice, updateInvoice, deleteInvoice };
