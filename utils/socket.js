const { Server } = require("socket.io");

let io;

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

      // When a user logs in, they join a room with their userId
      socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
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
