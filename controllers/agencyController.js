const AgencyRegistration = require("../models/AgencyRegistration");
const User = require("../models/User");
const Role = require("../models/Role");

const { uploadToExternalAPI } = require("../middleware/upload");
const sendEmail = require("../utils/sendEmail");

// Temporary in-memory OTP store (email -> { otp, expiresAt })
const otpStore = new Map();

const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    await sendEmail({
      email,
      subject: "ArchiSite - Verify your Email Address",
      message: `Your OTP for ArchiSite Agency Registration is: ${otp}\nThis code is valid for 10 minutes.`
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email: " + error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const record = otpStore.get(email);
    if (!record) return res.status(400).json({ message: "No OTP found or OTP expired" });

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(email);
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAgencyRoles = async (req, res) => {
  try {
    const roles = await Role.find({}).select("_id name");
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitRegistration = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Convert arrays if they came as comma separated strings
    if (typeof data.servicesOffered === 'string') data.servicesOffered = data.servicesOffered.split(',').map(s => s.trim());
    if (typeof data.workingCities === 'string') data.workingCities = data.workingCities.split(',').map(s => s.trim());

    if (req.files) {
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        data.profilePhoto = await uploadToExternalAPI(req.files.profilePhoto[0], 'architect', 'agencies');
      }
      if (req.files.projectPhotos && req.files.projectPhotos.length > 0) {
        const uploadPromises = req.files.projectPhotos.map(file => uploadToExternalAPI(file, 'architect', 'agencies'));
        const imageUrls = await Promise.all(uploadPromises);
        data.projectPhotos = imageUrls.filter(url => url !== null);
      }
    }

    const registration = await AgencyRegistration.create(data);
    res.status(201).json({ message: "Registration submitted successfully", data: registration });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPendingRegistrations = async (req, res) => {
  try {
    const registrations = await AgencyRegistration.find({ status: "Pending" })
      .populate("businessType", "name")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationById = async (req, res) => {
  try {
    const registration = await AgencyRegistration.findById(req.params.id)
      .populate("businessType", "name");
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await AgencyRegistration.findById(id);
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (registration.status !== "Pending") {
      return res.status(400).json({ message: "Registration is not in pending status" });
    }

    let roleName = registration.businessType || "Vendor";
    
    let role = await Role.findOne({ name: { $regex: new RegExp(`^${roleName}$`, "i") } });
    if (!role) {
      role = await Role.create({ name: roleName, permissions: ["read_projects"] });
    }

    const defaultPassword = "password123";

    const user = await User.create({
      name: registration.agencyName,
      email: registration.email,
      password: defaultPassword,
      phone: registration.mobile,
      role: role._id,
      address: registration.officeAddress,
      experience: registration.experience,
      specializations: registration.servicesOffered,
      team: "Site",
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0]
    });

    registration.status = "Approved";
    registration.userId = user._id;
    await registration.save();

    res.json({ message: "Registration approved and user created", user, registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await AgencyRegistration.findById(id);
    
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = "Rejected";
    await registration.save();

    res.json({ message: "Registration rejected", registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitRegistration,
  getPendingRegistrations,
  getRegistrationById,
  approveRegistration,
  rejectRegistration,
  sendEmailOtp,
  verifyEmailOtp,
  getAgencyRoles
};
