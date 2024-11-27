import "./App.css";
import ChatRoomList from "./components/chat/ChatRoomList";
import EmptyChatList from "./components/chat/EmptyChatList";

const App = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-4">
        <ChatRoomList />
      </div>
      <div className="w-1/2 p-4">
        <EmptyChatList />
      </div>
    </div>
  );
};

export default App;
