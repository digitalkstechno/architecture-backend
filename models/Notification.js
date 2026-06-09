const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String, // 'task_assigned', 'task_completed', 'message', 'alert'
    default: "info",
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, // Could be task ID, project ID, message ID
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
