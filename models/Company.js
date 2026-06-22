const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, default: "Arkiton Pro Designs" },
    taxId: { type: String, default: "" },
    address: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
