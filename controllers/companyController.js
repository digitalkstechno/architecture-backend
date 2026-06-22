const Company = require("../models/Company");

const getCompany = async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({});
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCompany = async (req, res) => {
  try {
    let company = await Company.findOne();
    if (!company) {
      company = await Company.create({});
    }
    company = await Company.findByIdAndUpdate(company._id, req.body, { new: true, runValidators: true });
    res.json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getCompany, updateCompany };
