const express = require("express");
const router = express.Router();
const { getConversations, getMessagesByContact, sendMessage, markMessagesRead, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:contactId", getMessagesByContact);
router.post("/", sendMessage);
router.patch("/:contactId/read", markMessagesRead);
router.delete("/:id", deleteMessage);

module.exports = router;
