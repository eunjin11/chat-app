import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import roomRouter from "./routes/rooms.js";
import messageRouter from "./routes/messages.js";
import { Room } from "./models/Room.js";
import { Message } from "./models/Message.js";

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

  socket.on("send_message", async (messageData) => {
    try {
      const { roomId, content, sender } = messageData;
      const { userId, username } = sender;

      // 필수 필드 검증
      if (!content || !userId || !username) {
        socket.emit("message_error", {
          error: "메시지 내용과 사용자 정보는 필수입니다.",
        });
        return;
      }

      // 방이 존재하는지 확인
      const room = await Room.findById(roomId);
      if (!room) {
        socket.emit("message_error", {
          error: "존재하지 않는 채팅방입니다.",
        });
        return;
      }
      // 메시지 생성
      const message = new Message({
        roomId,
        sender: {
          userId,
          username,
        },
        content,
      });

      // 메시지 저장
      await message.save();

      // 채팅방의 lastMessage 정보 업데이트
      await Room.findByIdAndUpdate(roomId, {
        lastMessage: {
          content,
          senderId: userId,
          senderName: username,
          sentAt: message.createdAt,
        },
      });

      // 저장된 메시지를 포함하여 모든 클라이언트에게 브로드캐스트
      io.to(roomId).emit("message", message);
    } catch (error) {
      console.error("메시지 저장 에러:", error);
      socket.emit("message_error", {
        error: "메시지 저장 중 오류가 발생했습니다.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${roomId}`);
    socket.leave(roomId);
  });
});
