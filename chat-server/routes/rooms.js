import express from "express";
import { Room } from "../models/Room.js";

const router = express.Router();

//채팅방 불러오기 GET
router.get("/rooms", async (req, res) => {
  try {
    // 모든 채팅방 정보를 가져옵니다
    const rooms = await Room.find();

    // 시간 차이를 계산하는 유틸리티 함수
    const getTimeAgo = (date) => {
      if (!date) return "";

      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return "방금 전";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}분 전`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}시간 전`;
      const days = Math.floor(hours / 24);
      return `${days}일 전`;
    };

    // 읽지 않은 메시지 수를 계산하는 함수
    const getUnreadCount = async (room, userId) => {
      const participant = room.participants.find((p) => p.userId === userId);
      if (!participant) return 0;

      // 사용자의 마지막 읽은 시간 이후의 메시지 수를 계산
      const count = await Message.countDocuments({
        roomId: room._id,
        createdAt: { $gt: participant.lastRead },
      });

      return count;
    };

    // 프론트엔드에서 필요한 형식으로 데이터 변환
    const formattedRooms = await Promise.all(
      rooms.map(async (room) => ({
        id: room._id,
        name: room.name,
        participants: room.participants.length,
        // lastMessage 정보가 있으면 사용, 없으면 기본값 설정
        lastMessage: room.lastMessage?.content || "",
        lastActivityTime: getTimeAgo(
          room.lastMessage?.sentAt || room.updatedAt
        ),
        unreadCount: await getUnreadCount(room, req.query.userId), // userId는 쿼리 파라미터로 받음
        lastSender: room.lastMessage
          ? {
              name: room.lastMessage.senderName,
              profileImage: room.lastMessage.senderProfileImage || "",
            }
          : null,
      }))
    );

    res.json(formattedRooms);
  } catch (error) {
    console.error("채팅방 목록 조회 에러:", error);
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
