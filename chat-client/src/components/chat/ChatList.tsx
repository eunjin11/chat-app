import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { io } from "socket.io-client";

interface MessageProps {
  text: string;
  username: string;
  timestamp: string;
}

const ChatList = () => {
  const socket = io("http://localhost:3001");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const username = "테스트";

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      console.log(message);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageInput.trim()) {
      const messageData = {
        text: messageInput,
        username: username,
        timestamp: new Date().toISOString(),
      };
      socket.emit("send_message", messageData);
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
