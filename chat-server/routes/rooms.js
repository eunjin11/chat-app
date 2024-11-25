import express from "express";
import { Room } from "../models/Room.js";

const router = express.Router();

// 채팅방 생성 API
router.post("/rooms", async (req, res) => {
  try {
    console.log("받은 요청:", req.body);
    const { name, userId, username } = req.body;

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
          joinedAt: new Date(),
        },
      ],
    });

    // 데이터베이스에 저장
    await room.save();

    res.status(201).json({
      message: "채팅방이 생성되었습니다.",
      room,
    });
  } catch (error) {
    console.error("채팅방 생성 에러:", error);
    res.status(500).json({
      error: "채팅방 생성 중 오류가 발생했습니다.",
    });
  }
});

export default router;
