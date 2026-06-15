const Message = require("../models/Message");
const User = require("../models/User");
const socketUtil = require("../utils/socket");

// Format message for frontend
const formatMessage = (msg) => ({
  _id: msg._id,
  senderId: msg.from._id || msg.from,
  receiverId: msg.to._id || msg.to,
  text: msg.text,
  isRead: !msg.unread,
  createdAt: msg.createdAt
});

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ from: userId }, { to: userId }]
    }).populate({
      path: 'from to',
      select: 'name role',
      populate: { path: 'role', select: 'name' }
    }).sort({ createdAt: -1 });

    const conversationsMap = new Map();

    for (const msg of messages) {
      if (!msg.from || !msg.to) continue; // Skip if a user was deleted
      
      const isSender = msg.from._id.toString() === userId.toString();
      const contact = isSender ? msg.to : msg.from;
      
      if (!contact || !contact._id) continue;
      
      const contactIdStr = contact._id.toString();

      if (!conversationsMap.has(contactIdStr)) {
        conversationsMap.set(contactIdStr, {
          _id: contactIdStr,
          contactName: contact.name,
          contactRole: contact.role ? (contact.role.name || contact.role) : 'User',
          lastMessage: msg.text,
          lastMessageTime: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unreadCount: 0,
          _latestDate: msg.createdAt
        });
      }

      // If user received it and it's unread
      if (!isSender && msg.unread) {
        conversationsMap.get(contactIdStr).unreadCount += 1;
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort((a, b) => b._latestDate - a._latestDate);
    // remove temp field
    conversations.forEach(c => delete c._latestDate);

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessagesByContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { from: userId, to: contactId },
        { from: contactId, to: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages.map(formatMessage));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    const msg = await Message.create({
      from: senderId,
      to: receiverId,
      text: text,
      unread: true
    });

    const formattedMessage = formatMessage(msg);

    // Emit socket event
    try {
      const io = socketUtil.getIO();
      // Emit to receiver
      io.to(receiverId.toString()).emit("receive_message", formattedMessage);
      // Emit to sender
      io.to(senderId.toString()).emit("receive_message", formattedMessage);
    } catch (socketErr) {
      console.warn("Socket not available or error:", socketErr.message);
    }

    res.status(201).json(formattedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      { from: contactId, to: userId, unread: true },
      { unread: false }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.from.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.deleteOne({ _id: id });

    // Emit socket event
    try {
      const io = socketUtil.getIO();
      io.to(message.to.toString()).emit("delete_message", id);
      io.to(message.from.toString()).emit("delete_message", id);
    } catch (socketErr) {
      console.warn("Socket not available or error:", socketErr.message);
    }

    res.json({ message: "Message deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getConversations,
  getMessagesByContact,
  sendMessage,
  markMessagesRead,
  deleteMessage
};
