import express from "express";
import { Message } from "../models/Message.js";
import { Room } from "../models/Room.js";

const router = express.Router();

router.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, userId, username } = req.body;

    // 필수 필드 검증
    if (!content || !userId || !username) {
      return res.status(400).json({
        error: "메시지 내용과 사용자 정보는 필수입니다.",
      });
    }

    // 방이 존재하는지 확인
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "존재하지 않는 채팅방입니다." });
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

    res.status(201).json({
      message: "메시지가 저장되었습니다.",
      data: message,
    });
  } catch (error) {
    console.error("메시지 저장 에러:", error);
    res.status(500).json({ error: "메시지 저장 중 오류가 발생했습니다." });
  }
});

export default router;
