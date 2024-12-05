import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import roomRouter from "./routes/rooms.js";
import messageRouter from "./routes/messages.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

connectDB()
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error);
  });

app.use("/api", roomRouter);
app.use("/api", messageRouter);

const server = createServer(app);

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});

app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행중입니다.");
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  console.log(`User connected to room ${roomId}`);

  socket.on("send_message", (messageData) => {
    console.log(messageData);
    io.to(messageData.roomId).emit("message", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${roomId}`);
    socket.leave(roomId);
  });
});
