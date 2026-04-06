import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const rooms = {};

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, userId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];

    // send existing users
    socket.emit("all-users", rooms[roomId]);

    // add user
    rooms[roomId].push({ userId, name, socketId: socket.id });

    // notify others
    socket.to(roomId).emit("user-joined", {
      userId,
      name,
      socketId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.socketId !== socket.id
      );

      socket.to(roomId).emit("user-left", socket.id);
    }
  });

  socket.on("send-offer", ({ to, offer }) => {
    io.to(to).emit("receive-offer", {
      offer,
      from: socket.id,
    });
  });

  socket.on("send-answer", ({ to, answer }) => {
    io.to(to).emit("receive-answer", {
      answer,
      from: socket.id,
    });
  });

  socket.on("send-candidate", ({ to, candidate }) => {
    io.to(to).emit("receive-candidate", {
      candidate,
      from: socket.id,
    });
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});