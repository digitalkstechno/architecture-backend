const express = require("express");
const { getDocuments, createDocument, deleteDocument, downloadDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

router.use(protect);
router.route("/").get(getDocuments).post(upload.single("file"), createDocument);
router.route("/:id").delete(deleteDocument);
router.route("/:id/download").get(downloadDocument);

module.exports = router;
