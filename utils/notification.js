const Notification = require("../models/Notification");
const User = require("../models/User");
const Role = require("../models/Role");

const sendNotification = async (recipientIds, text, type, relatedId) => {
  try {
    const ids = Array.isArray(recipientIds) ? recipientIds : [recipientIds];

    for (const recipient of ids) {
      if (!recipient) continue;
      
      const notification = await Notification.create({
        recipient,
        text,
        type,
        relatedId
      });

    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const notifyDirectors = async (text, type, relatedId) => {
  try {
    const directors = await User.find().populate("role");
    const directorIds = directors
      .filter(d => d.role && d.role.name && (d.role.name.toLowerCase().includes("director") || d.role.name.toLowerCase().includes("admin")))
      .map(d => d._id);
    
    if (directorIds.length > 0) {
      await sendNotification(directorIds, text, type, relatedId);
    }
  } catch (error) {
    console.error("Error notifying directors:", error);
  }
};

module.exports = { sendNotification, notifyDirectors };
