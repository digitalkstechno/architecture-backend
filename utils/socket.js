const { Server } = require("socket.io");

let io;
const onlineUsers = new Map(); // Map<socket.id, userId>

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: "*", // Adjust for production
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
      }
    });

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Send the current list of online users to the newly connected socket
      socket.emit("online_users", Array.from(new Set(onlineUsers.values())));

      // When a user logs in, they join a room with their userId
      socket.on("join", (userId) => {
        socket.join(userId);
        
        // Track online status
        if (!Array.from(onlineUsers.values()).includes(userId)) {
          // If this is a new online user (not just another tab), broadcast it
          socket.broadcast.emit("user_status", { userId, isOnline: true });
        }
        onlineUsers.set(socket.id, userId);
        
        console.log(`User ${userId} joined room. Total online sockets: ${onlineUsers.size}`);
      });

      socket.on("disconnect", () => {
        const userId = onlineUsers.get(socket.id);
        onlineUsers.delete(socket.id);
        console.log(`Socket disconnected: ${socket.id}`);
        
        if (userId) {
          // Check if user has other active sockets (e.g. other tabs)
          const isStillOnline = Array.from(onlineUsers.values()).includes(userId);
          if (!isStillOnline) {
            io.emit("user_status", { userId, isOnline: false });
          }
        }
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};
