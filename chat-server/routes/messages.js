import express from "express";
import { Message } from "../models/Message.js";
import { Room } from "../models/Room.js";

const router = express.Router();

router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "존재하지 않는 채팅방입니다." });
    }

    let query = { roomId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(messages.reverse());
  } catch (error) {
    console.error("메시지 조회 에러:", error);
    res.status(500).json({ error: "메시지 조회 중 오류가 발생했습니다." });
  }
});

export default router;
