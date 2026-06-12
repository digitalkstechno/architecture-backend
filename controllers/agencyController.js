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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email is already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">ArchiSite</h1>
          <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 15px;">Secure Verification</p>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <p style="color: #475569; font-size: 16px; margin-bottom: 25px;">Please use the following verification code to complete your agency registration:</p>
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 25px; margin: 0 auto; max-width: 300px;">
            <h1 style="color: #1e293b; font-size: 42px; letter-spacing: 8px; margin: 0; font-weight: 700;">${otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 25px; line-height: 1.6;">
            This code is valid for exactly <strong>10 minutes</strong>.<br>
            If you did not request this code, please ignore this email.
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ArchiSite Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail({
      email,
      subject: "ArchiSite - Verify your Email Address",
      html: htmlContent
    }).catch(err => console.error("Failed to send OTP email:", err));

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to process OTP request: " + error.message });
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

    let roleId = registration.businessType;
    let role = await Role.findById(roleId);
    
    if (!role) {
      role = await Role.create({ name: "Vendor", permissions: ["dashboard.view", "projects.view", "tasks.view", "payments.view", "messages.view"] });
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

    await AgencyRegistration.updateOne({ _id: id }, { status: "Approved", userId: user._id });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <div style="background-color: #10b981; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">ArchiSite</h1>
          <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 15px;">Application Approved</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Welcome to the network, ${registration.agencyName}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">We are thrilled to inform you that your agency registration has been officially approved. You are now a partner on the ArchiSite platform.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #0f172a; margin-top: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Your Login Credentials</h3>
            <p style="color: #334155; margin: 10px 0 5px 0; font-size: 15px;"><strong>Email:</strong> <span style="color: #4f46e5;">${registration.email}</span></p>
            <p style="color: #334155; margin: 0; font-size: 15px;"><strong>Temporary Password:</strong> <span style="background-color: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-family: monospace;">${defaultPassword}</span></p>
          </div>
          
          <p style="color: #ef4444; font-size: 14px; font-weight: 600; text-align: center; background-color: #fef2f2; padding: 10px; border-radius: 6px;">
            ⚠️ Important: Please change your password immediately after logging in.
          </p>
          
          <div style="text-align: center; margin-top: 35px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">Login to Portal</a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ArchiSite Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail({
      email: registration.email,
      subject: "ArchiSite - Agency Registration Approved",
      html: htmlContent
    }).catch(err => console.error("Failed to send approval email:", err));

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

    await AgencyRegistration.updateOne({ _id: id }, { status: "Rejected" });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <div style="background-color: #ef4444; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">ArchiSite</h1>
          <p style="color: #fee2e2; margin: 8px 0 0 0; font-size: 15px;">Application Update</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 22px;">Hello ${registration.agencyName},</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for your interest in joining the ArchiSite platform.</p>
          
          <div style="background-color: #fff1f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
            <p style="color: #9f1239; margin: 0; font-size: 15px; line-height: 1.6;">
              After careful review of your submitted profile and credentials, we regret to inform you that we are unable to approve your agency registration at this time.
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 15px; line-height: 1.6;">
            Our network maintains specific criteria for partnerships. If you believe this decision was made in error or if you have updated credentials to share, please feel free to reach out to our support team.
          </p>
          
          <p style="color: #475569; font-size: 15px; margin-top: 30px; font-weight: 600;">
            Best regards,<br/>The ArchiSite Administration Team
          </p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ArchiSite Platform. All rights reserved.</p>
        </div>
      </div>
    `;

    sendEmail({
      email: registration.email,
      subject: "ArchiSite - Agency Registration Update",
      html: htmlContent
    }).catch(err => console.error("Failed to send rejection email:", err));

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
