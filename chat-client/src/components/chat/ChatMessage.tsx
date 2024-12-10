import { Message } from "./ChatList";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {!isCurrentUser && (
          <span className="text-sm text-gray-500 mb-1">{message.username}</span>
        )}
        <div className="flex items-end gap-2">
          {isCurrentUser && (
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          )}
          <div
            className={`${
              isCurrentUser
                ? "bg-black text-white text-left"
                : "bg-gray-100 text-black text-left"
            } rounded-lg py-2 px-3 text-sm`}
          >
            {message.content}
          </div>
          {!isCurrentUser && (
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
