const Payment = require("../models/Payment");
const Project = require("../models/Project");

// Helper to update project financial stats
const updateProjectFinances = async (projectId) => {
  const payments = await Payment.find({ project: projectId, status: "Paid" });
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  
  const project = await Project.findById(projectId);
   if (project) {
     project.received = totalReceived;
     // budget is a number now, but handle string conversion for safety
     let budgetValue = project.budget;
     if (typeof budgetValue === 'string') {
       budgetValue = Number(budgetValue.replace(/[^0-9.-]+/g, "")) || 0;
     } else if (typeof budgetValue !== 'number') {
       budgetValue = 0;
     }
     project.pending = Math.max(0, budgetValue - totalReceived);
     await project.save();
   }
};

const getPayments = async (req, res) => {
  try {
    const { project, client } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (client) filter.client = client;
    const payments = await Payment.find(filter)
      .populate("project", "name")
      .populate("client", "name")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("project", "name")
      .populate("client", "name email");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const project = await Project.findById(req.body.project || req.body.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const budgetValue = typeof project.budget === 'number' ? project.budget : Number(String(project.budget).replace(/[^0-9.-]+/g, "")) || 0;
    const existingPayments = await Payment.find({ project: project._id, status: "Paid" });
    const receivedSoFar = existingPayments.reduce((sum, p) => sum + p.amount, 0);

    const amount = Number(req.body.amount);
    const maxAllowed = Math.max(0, budgetValue - receivedSoFar);

    if (amount > maxAllowed) {
      return res.status(400).json({ message: `Amount exceeds Pending Balance. Maximum allowed: ₹${maxAllowed}` });
    }

    const payment = await Payment.create(req.body);
    await updateProjectFinances(payment.project);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentToUpdate = await Payment.findById(req.params.id);
    if (!paymentToUpdate) return res.status(404).json({ message: "Payment not found" });

    const project = await Project.findById(paymentToUpdate.project);
    const budgetValue = typeof project.budget === 'number' ? project.budget : Number(String(project.budget).replace(/[^0-9.-]+/g, "")) || 0;
    
    const existingPayments = await Payment.find({ project: paymentToUpdate.project, status: "Paid" });
    let receivedSoFar = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    
    if (paymentToUpdate.status === "Paid") {
      receivedSoFar -= paymentToUpdate.amount; // Remove the old amount of this payment
    }

    const newAmount = req.body.amount !== undefined ? Number(req.body.amount) : paymentToUpdate.amount;
    const maxAllowed = Math.max(0, budgetValue - receivedSoFar);

    if (newAmount > maxAllowed) {
      return res.status(400).json({ message: `Amount exceeds Pending Balance. Maximum allowed: ₹${maxAllowed}` });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await updateProjectFinances(payment.project);
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    await updateProjectFinances(payment.project);
    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPayments, getPayment, createPayment, updatePayment, deletePayment };
