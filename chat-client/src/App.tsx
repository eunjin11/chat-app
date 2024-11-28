import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRoomList from "./components/chat/ChatRoomList";
import EmptyChatList from "./components/chat/EmptyChatList";
import ChatList from "./components/chat/ChatList";

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <div className="w-1/2 p-4">
          <ChatRoomList />
        </div>
        <div className="w-1/2 p-4">
          <Routes>
            <Route path="/" element={<EmptyChatList />} />
            <Route path="/chat/:roomId" element={<ChatList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
