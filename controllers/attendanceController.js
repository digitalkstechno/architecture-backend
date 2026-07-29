const Attendance = require("../models/Attendance");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const path = require("path");

const getLocalDateString = () => {
  const date = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getAttendance = async (req, res) => {
  try {
    const { user, date, startDate, endDate, team } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (date) filter.date = date;
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    let records = await Attendance.find(filter)
      .populate({
        path: "user",
        select: "name role team payoutType salaryAmount config",
        populate: { path: "role", select: "name" }
      })
      .sort({ date: -1 });

    if (team) {
      records = records.filter(r => r.user && r.user.team && r.user.team.toLowerCase() === team.toLowerCase());
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: records
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getLocalDateString();
    
    let attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      attendance = new Attendance({
        user: userId,
        date: today,
        status: "Present",
        isManual: false,
        logs: [{ checkIn: new Date() }]
      });
    } else {
      // Check if last log is not closed
      const lastLog = attendance.logs[attendance.logs.length - 1];
      if (lastLog && !lastLog.checkOut) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Already checked in"
        });
      }
      
      if (lastLog && lastLog.checkOut) {
        const timeSinceCheckOut = new Date() - lastLog.checkOut;
        if (timeSinceCheckOut < 60000) { // 60 seconds grace period for page refresh
          lastLog.checkOut = undefined;
          lastLog.duration = undefined;
          attendance.status = "Present";
          attendance.isManual = false;
          await attendance.save();
          return res.status(200).json({
            success: true,
            status: 200,
            data: attendance
          });
        }
      }

      attendance.logs.push({ checkIn: new Date() });
      attendance.status = "Present";
      attendance.isManual = false;
    }
    
    await attendance.save();
    res.status(200).json({
      success: true,
      status: 200,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getLocalDateString();
    
    let attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      // Look for any open log from previous days (edge case)
      attendance = await Attendance.findOne({ 
        user: userId, 
        "logs.checkOut": { $exists: false } 
      }).sort({ date: -1 });
    }

    if (!attendance) return res.status(404).json({
      success: false,
      status: 404,
      message: "No attendance record found to check out"
    });
    
    const lastLog = attendance.logs[attendance.logs.length - 1];
    if (!lastLog || lastLog.checkOut) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Not checked in or already checked out"
      });
    }
    
    lastLog.checkOut = new Date();
    lastLog.duration = Math.round((lastLog.checkOut - lastLog.checkIn) / (1000 * 60)); // minutes
    
    attendance.totalMinutes = attendance.logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    attendance.isManual = false;
    
    await attendance.save();
    res.status(200).json({
      success: true,
      status: 200,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    let record;
    
    if (id === "new") {
      const { user, date } = req.body;
      record = await Attendance.findOne({ user, date });
      if (record) {
        Object.assign(record, { ...req.body, isManual: true });
        await record.save();
      } else {
        record = new Attendance({ ...req.body, isManual: true });
        await record.save();
      }
    } else {
      record = await Attendance.findByIdAndUpdate(id, { ...req.body, isManual: true }, { new: true });
    }

    if (!record) return res.status(404).json({
      success: false,
      status: 404,
      message: "Attendance record not found"
    });
    res.status(200).json({
      success: true,
      status: 200,
      data: record
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: err.message
    });
  }
};

const getMyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the most recent record with an open log OR today's record
    const today = getLocalDateString();
    let attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      // Look for any open log from previous days (edge case)
      attendance = await Attendance.findOne({ 
        user: userId, 
        "logs.checkOut": { $exists: false } 
      }).sort({ date: -1 });
    }
    
    res.status(200).json({
      success: true,
      status: 200,
      data: attendance
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

const downloadSalarySlip = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { month, present = 0, absent = 0, halfDay = 0, salary = 0, overtime = 0, total = 0 } = req.query;

    const staff = await User.findById(staffId).populate("role", "name");
    if (!staff) return res.status(404).json({
      success: false,
      status: 404,
      message: "Staff not found"
    });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Salary_Slip_${staff.name.replace(/[^a-zA-Z0-9-]/g, '_')}_${month}.pdf`
    );

    doc.pipe(res);

    // --- Header Section ---
    const logoPath = path.join(__dirname, '../../architect-site/public/logo.jpeg');
    
    // Add logo
    try {
      doc.image(logoPath, 50, 40, { height: 40 });
    } catch (e) {
      console.log('Logo not found or could not be loaded:', e);
    }
    
    // Header texts
    doc.fillColor('#64748b').fontSize(10).font("Helvetica-Bold").text("ARCHITECTURE & INTERIOR DESIGN", 50, 95, { align: "left" });
    
    // Salary slip badge (top right)
    doc.rect(430, 40, 120, 22).strokeColor('#0f172a').lineWidth(1).stroke();
    doc.fillColor('#0f172a').fontSize(12).font("Helvetica-Bold").text("SALARY SLIP", 430, 46, { width: 120, align: "center" });
    
    // Date
    const formattedDate = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    doc.fillColor('#64748b').fontSize(8).font("Helvetica-Bold").text(formattedDate, 430, 75, { width: 120, align: "right" });
    
    // Horizontal Line
    doc.moveTo(50, 115).lineTo(550, 115).lineWidth(2).strokeColor('#0f172a').stroke();
    
    // --- Employee Details & Summary ---
    doc.fillColor('#94a3b8').fontSize(10).font("Helvetica-Bold").text("EMPLOYEE DETAILS", 50, 140)
       .font("Helvetica").moveDown(0.5);
      
    doc.fillColor('#64748b').text("Name", 50, 160);
    doc.fillColor('#0f172a').font("Helvetica-Bold").text(staff.name, 150, 160);
    
    doc.fillColor('#64748b').font("Helvetica").text("Role", 50, 180);
    doc.fillColor('#4f46e5').font("Helvetica-Bold").text(staff.role ? staff.role.name : "N/A", 150, 180);
    
    doc.fillColor('#64748b').font("Helvetica").text("Payout Type", 50, 200);
    doc.fillColor('#0f172a').font("Helvetica-Bold").text(staff.payoutType, 150, 200);
    
    doc.fillColor('#64748b').font("Helvetica").text("Month", 50, 220);
    doc.fillColor('#0f172a').font("Helvetica-Bold").text(month, 150, 220);

    doc.fillColor('#94a3b8').fontSize(10).font("Helvetica-Bold").text("ATTENDANCE SUMMARY", 350, 140).font("Helvetica");
    
    doc.fillColor('#64748b').text("Present Days", 350, 160);
    doc.fillColor('#10b981').font("Helvetica-Bold").text(present, 450, 160);
    
    doc.fillColor('#64748b').font("Helvetica").text("Absent Days", 350, 180);
    doc.fillColor('#ef4444').font("Helvetica-Bold").text(absent, 450, 180);
    
    doc.fillColor('#64748b').font("Helvetica").text("Half Days", 350, 200);
    doc.fillColor('#f59e0b').font("Helvetica-Bold").text(halfDay, 450, 200);

    doc.moveTo(50, 240).lineTo(550, 240).lineWidth(1).strokeColor('#e5e7eb').stroke();

    // --- Table Header ---
    doc.rect(50, 260, 500, 30).fill('#f8fafc');
    doc.fillColor('#475569');
    doc.fontSize(10).font("Helvetica-Bold")
       .text("DESCRIPTION", 60, 270)
       .text("AMOUNT", 450, 270, { width: 90, align: "right" });

    // --- Table Content ---
    doc.fillColor('#0f172a').font("Helvetica");
    doc.text("Basic Salary", 60, 310);
    doc.text(`Rs. ${Number(salary).toLocaleString('en-IN')}`, 450, 310, { width: 90, align: "right" });

    let currentY = 340;
    if (Number(overtime) > 0) {
      doc.text("Overtime", 60, currentY);
      doc.text(`Rs. ${Number(overtime).toLocaleString('en-IN')}`, 450, currentY, { width: 90, align: "right" });
      currentY += 30;
    }

    doc.moveTo(50, currentY).lineTo(550, currentY).lineWidth(1).strokeColor('#e5e7eb').stroke();

    // --- Total Amount ---
    doc.rect(350, currentY + 20, 200, 40).fill('#f1f5f9');
    doc.fillColor('#0f172a').fontSize(12).font("Helvetica-Bold")
       .text("Total Payable:", 360, currentY + 34)
       .text(`Rs. ${Number(total).toLocaleString('en-IN')}`, 430, currentY + 34, { width: 110, align: "right" });

    // --- Signatures ---
    currentY += 120;
    doc.moveTo(50, currentY).lineTo(200, currentY).lineWidth(1).strokeColor('#cbd5e1').stroke();
    doc.fillColor('#94a3b8').fontSize(9).font("Helvetica-Bold")
       .text("EMPLOYEE SIGNATURE", 50, currentY + 10);
       
    doc.moveTo(400, currentY).lineTo(550, currentY).lineWidth(1).strokeColor('#cbd5e1').stroke();
    doc.fillColor('#94a3b8').fontSize(9).font("Helvetica-Bold")
       .text("AUTHORIZED SIGNATORY", 400, currentY + 10, { width: 150, align: "right" });

    // --- Footer ---
    doc.fillColor('#94a3b8').fontSize(9).font("Helvetica")
       .text("This is an electronically generated salary slip and does not require a signature.", 50, 750, { align: "center", width: 500 });
    
    doc.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 500,
      message: err.message
    });
  }
};

module.exports = { getAttendance, checkIn, checkOut, updateAttendance, getMyStatus, downloadSalarySlip };
