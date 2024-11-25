import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import roomRouter from "./routes/rooms.js";

const app = express();
app.use(express.json());

connectDB();

app.use(roomRouter);

const server = createServer(app);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.id}`);

  socket.on("send_message", (messageData) => {
    console.log(messageData);
    io.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
