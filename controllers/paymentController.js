const Payment = require("../models/Payment");
const Project = require("../models/Project");
const PDFDocument = require("pdfkit");

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
    res.status(200).json({
      success: true,
      status: 200,
      data: payments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("project", "name")
      .populate("client", "name email");
    if (!payment) return res.status(404).json({
      success: false,
      status: 404,
      message: "Payment not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const project = await Project.findById(req.body.project || req.body.projectId);
    if (!project) return res.status(404).json({
      success: false,
      status: 404,
      message: "Project not found"
    });

    const budgetValue = typeof project.budget === 'number' ? project.budget : Number(String(project.budget).replace(/[^0-9.-]+/g, "")) || 0;
    const existingPayments = await Payment.find({ project: project._id, status: "Paid" });
    const receivedSoFar = existingPayments.reduce((sum, p) => sum + p.amount, 0);

    const amount = Number(req.body.amount);
    const maxAllowed = Math.max(0, budgetValue - receivedSoFar);

    if (amount > maxAllowed) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Amount exceeds Pending Balance. Maximum allowed: ₹${maxAllowed}`
      });
    }

    const payment = await Payment.create(req.body);
    await updateProjectFinances(payment.project);
    res.status(201).json({
      success: true,
      status: 201,
      data: payment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const paymentToUpdate = await Payment.findById(req.params.id);
    if (!paymentToUpdate) return res.status(404).json({
      success: false,
      status: 404,
      message: "Payment not found"
    });

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
      return res.status(400).json({
        success: false,
        status: 400,
        message: `Amount exceeds Pending Balance. Maximum allowed: ₹${maxAllowed}`
      });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    await updateProjectFinances(payment.project);
    res.status(200).json({
      success: true,
      status: 200,
      data: payment
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({
      success: false,
      status: 404,
      message: "Payment not found"
    });
    await updateProjectFinances(payment.project);
    res.status(200).json({
      success: true,
      status: 200,
      data: { message: "Payment deleted" }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const downloadPaymentSlip = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("project", "name client")
      .populate("client", "name email");

    if (!payment) return res.status(404).json({
      success: false,
      status: 404,
      message: "Payment not found"
    });

    // Create a new PDF Document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    // Sanitize project name for filename
    const sanitizedProjectName = payment.project?.name 
      ? payment.project.name.replace(/[^a-zA-Z0-9-]/g, '_') 
      : payment._id;

    // Setup response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Payment_Slip_${sanitizedProjectName}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // --- Header Section ---
    // Dark Indigo Background for Header
    doc.rect(0, 0, 600, 100).fill('#4f46e5');
    
    // Receipt Title
    doc
      .fillColor('#ffffff')
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("PAYMENT RECEIPT", 50, 35, { align: "left", characterSpacing: 2 });
      
    // Company Name in Header
    const Company = require("../models/Company");
    const company = (await Company.findOne()) || { name: "Arkiton Pro Designs" };
    
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(company.name, 50, 70, { align: "left" });
      
    // Reset fill color for text
    doc.fillColor('#333333');

    // --- Invoice Meta Information ---
    doc.moveDown(4); // Move down below header
    
    // Left side: Receipt Details
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("RECEIPT DETAILS", 50, 130)
      .font("Helvetica")
      .moveDown(0.5);
      
    doc.text(`Receipt ID: ${payment._id}`, 50, 150);
    doc.text(`Date: ${payment.date || new Date(payment.createdAt).toLocaleDateString()}`, 50, 165);
    doc.text(`Status: ${payment.status}`, 50, 180);

    // Right side: Billed To / Client Details
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("BILLED TO", 350, 130)
      .font("Helvetica");

    if (payment.client) {
      doc.text(`Name: ${payment.client.name}`, 350, 150);
      doc.text(`Email: ${payment.client.email}`, 350, 165);
    }
    
    // Highlighted Project Name
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor('#4f46e5')
      .text(`Project: ${payment.project?.name || "N/A"}`, 350, 180);
      
    // Reset color
    doc.fillColor('#333333');

    // --- Line Separator ---
    doc.moveTo(50, 220).lineTo(550, 220).lineWidth(1).strokeColor('#e5e7eb').stroke();

    // --- Table Header ---
    doc.rect(50, 240, 500, 30).fill('#f3f4f6');
    doc.fillColor('#374151');
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("DESCRIPTION / MILESTONE", 60, 250)
      .text("AMOUNT", 450, 250, { width: 90, align: "right" });

    // --- Table Content ---
    doc.fillColor('#111827');
    doc.font("Helvetica").text(payment.milestone || "Project Payment", 60, 290);
    doc.text(`Rs. ${payment.amount.toLocaleString('en-IN')}`, 450, 290, { width: 90, align: "right" });

    // --- Table Bottom Line ---
    doc.moveTo(50, 320).lineTo(550, 320).lineWidth(1).strokeColor('#e5e7eb').stroke();

    // --- Total Amount ---
    doc.rect(350, 340, 200, 40).fill('#f8fafc');
    doc.fillColor('#1e293b');
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Total Paid:", 360, 352)
      .text(`Rs. ${payment.amount.toLocaleString('en-IN')}`, 430, 352, { width: 110, align: "right" });

    // --- Notes ---
    if (payment.notes) {
      doc.fillColor('#64748b');
      doc.fontSize(10).font("Helvetica-Bold").text("Notes:", 50, 420);
      doc.font("Helvetica").text(payment.notes, 50, 435, { width: 250 });
    }

    // --- Footer ---
    doc.fillColor('#94a3b8');
    doc.fontSize(9).text("Thank you for your business. For any inquiries, please contact us.", 50, 750, { align: "center", width: 500 });
    
    // Finalize PDF file
    doc.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getPayments, getPayment, createPayment, updatePayment, deletePayment, downloadPaymentSlip };
