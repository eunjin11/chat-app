import React from "react";

const ChatRoomList = () => {
  const chatRooms = [
    {
      id: 1,
      name: "일반 채팅방",
      participants: 15,
      lastMessage: "안녕하세요!",
      lastActivityTime: "방금 전",
      isPrivate: false,
      unreadCount: 3,
    },
    {
      id: 2,
      name: "개발자 모임",
      participants: 8,
      lastMessage: "리액트 너무 재밌어요",
      lastActivityTime: "5분 전",
      isPrivate: true,
      unreadCount: 0,
    },
    {
      id: 3,
      name: "취미 공유방",
      participants: 23,
      lastMessage: "저도 같이 하고 싶어요",
      lastActivityTime: "30분 전",
      isPrivate: false,
      unreadCount: 5,
    },
  ];
  return <div></div>;
};

export default ChatRoomList;
