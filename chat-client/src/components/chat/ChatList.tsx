import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Input } from "../ui/input";
import { Avatar, AvatarImage } from "../ui/avatar";

interface MessageProps {
  text: string;
  username: string;
  timestamp: string;
}

const ChatList = () => {
  const { roomId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("테스트 닉네임");

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      query: { roomId },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected");
    });

    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      console.log(message);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("message");
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const messageData = {
        text: messageInput,
        username: username,
        timestamp: new Date().toISOString(),
        roomId: roomId,
      };
      socket?.emit("send_message", messageData);
      setMessageInput("");
    }
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={"./../image/profile.png"} />
          </Avatar>
          <div>
            <div className="font-semibold">채팅방 제목</div>
            <div className="text-sm text-gray-500 p-0">채팅방 설명</div>
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.username === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col ${
                msg.username === username ? "items-end" : "items-start"
              }`}
            >
              {msg.username !== username && (
                <span className="text-sm text-gray-500 mb-1">
                  {msg.username}
                </span>
              )}
              <div
                className={`${
                  msg.username === username
                    ? "bg-black text-white text-left"
                    : "bg-gray-100 text-black text-left"
                } rounded-lg py-2 px-3 text-sm`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={sendMessage}
        className="flex w-full items-center space-x-2"
      >
        <Input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1"
        />
        <Button>전송</Button>
      </form>
    </>
  );
};

export default ChatList;
