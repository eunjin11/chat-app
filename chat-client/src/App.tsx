import { useEffect, useState, FormEvent } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { Button } from "./components/ui/button";

interface MessageProps {
  text: string;
  username: string;
  timestamp: string;
}

const App = () => {
  const socket = io("http://localhost:3000");
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

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
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
      <Button>버튼이 생겼다!</Button>
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
          <button type="submit">전송</button>
        </div>
      </form>
    </>
  );
};

export default App;
