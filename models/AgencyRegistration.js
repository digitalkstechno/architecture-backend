const mongoose = require("mongoose");

const agencyRegistrationSchema = new mongoose.Schema(
  {
    agencyName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    businessType: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    officeAddress: { type: String },
    profilePhoto: { type: String },
    experience: { type: Number },
    servicesOffered: [{ type: String }],
    workingCities: [{ type: String }],
    aboutUs: { type: String },
    projectPhotos: [{ type: String }],
    completedProjectsCount: { type: Number },
    instagramLink: { type: String },
    clientReviews: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AgencyRegistration", agencyRegistrationSchema);
