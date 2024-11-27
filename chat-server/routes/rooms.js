import express from "express";
import { Room } from "../models/Room.js";

const router = express.Router();

//채팅방 불러오기 GET
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 채팅방 생성 POST
router.post("/rooms", async (req, res) => {
  try {
    const { name, userId, username, userProfileImage } = req.body;

    // 필수 필드 검증
    if (!name || !userId || !username) {
      return res.status(400).json({
        error: "방 이름과 사용자 정보는 필수입니다.",
      });
    }

    // 채팅방 생성
    const room = new Room({
      name,
      participants: [
        {
          userId,
          username,
          userProfileImage,
          joinedAt: new Date(),
          lastRead: new Date(),
        },
      ],
      // lastMessage는 처음에는 null로 시작
      lastMessage: null,
    });

    // 데이터베이스에 저장
    await room.save();

    // 생성된 방 정보를 프론트엔드 형식으로 변환
    const formattedRoom = {
      id: room._id,
      name: room.name,
      participants: 1,
      lastMessage: "",
      lastActivityTime: "방금 전",
      unreadCount: 0,
      lastSender: null,
    };

    res.status(201).json({
      message: "채팅방이 생성되었습니다.",
      room: formattedRoom,
    });
  } catch (error) {
    console.error("채팅방 생성 에러:", error);
    res.status(500).json({
      error: "채팅방 생성 중 오류가 발생했습니다.",
    });
  }
});

export default router;
