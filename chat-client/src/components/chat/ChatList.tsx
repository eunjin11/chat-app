import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

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
  const username = "테스트";

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
      {messages.map((msg, idx) => (
        <div key={idx}>
          <div>
            <span>{msg.username}</span>
            <span>{msg.text}</span>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}

      <form onSubmit={sendMessage}>
        <div>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <Button>전송</Button>
        </div>
      </form>
    </>
  );
};

export default ChatList;
