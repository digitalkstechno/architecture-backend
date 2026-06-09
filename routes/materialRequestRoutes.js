const express = require("express");
const { getMaterialRequests, createMaterialRequest, updateMaterialRequest, deleteMaterialRequest } = require("../controllers/materialRequestController");
const router = express.Router();

router.route("/").get(getMaterialRequests).post(createMaterialRequest);
router.route("/:id").put(updateMaterialRequest).delete(deleteMaterialRequest);

module.exports = router;
