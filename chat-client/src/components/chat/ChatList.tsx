import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Input } from "../ui/input";
import ChatMessage from "./ChatMessage";
import { ChatHeader } from "./ChatHeader";
import ChatInputForm from "./ChatInputForm";
import { getChatMessages } from "@/utils/api";

export interface Message {
  content: string;
  username: string;
  userId: string;
  createdAt: string;
}

const ChatList = () => {
  const { roomId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState("테스트 닉네임");

  const fetchChatMessages = async () => {
    if (!roomId) return;
    const result = await getChatMessages(roomId);
    setMessages(result);
  };

  useEffect(() => {
    fetchChatMessages();

    const newSocket = io("http://localhost:3001", {
      query: { roomId },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("message");
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = async (text: string) => {
    const messageData = {
      content: text,
      username: username,
      userId: "1",
    };
    socket?.emit("send_message", messageData);
  };

  return (
    <>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="닉네임을 입력하세요"
        className="mb-10 max-w-sm"
      />
      <ChatHeader
        title={"채팅방 제목"}
        roomImageUrl={"./../image/profile.png"}
        description={"채팅방 설명"}
      />
      <div className="space-y-4 mb-6">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg}
            isCurrentUser={msg.username === username}
          />
        ))}
      </div>
      <ChatInputForm onSendMessage={handleSendMessage} />
    </>
  );
};

export default ChatList;
