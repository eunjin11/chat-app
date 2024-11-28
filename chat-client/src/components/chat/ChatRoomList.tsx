import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getChatRooms } from "@/utils/api";

interface LastSender {
  name: string;
  profileImage: string;
}

interface ChatRoom {
  id: string;
  lastActivityTime: string;
  lastMessage: string;
  lastSender: LastSender;
  name: string;
  participants: number;
  unreadCount: number;
}

const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  const fetchChatRooms = async () => {
    const result = await getChatRooms();
    setChatRooms(result);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <div className="p-4">
      {chatRooms.map((chatRoom) => (
        <div
          key={chatRoom.id}
          className="flex items-center justify-between p-5 border-b hover:bg-slate-50 cursor-pointer"
        >
          <div className="flex items-center gap-4 flex-1">
            <Avatar>
              <AvatarImage
                src={
                  chatRoom.lastSender.profileImage || "./../image/profile.png"
                }
              />
            </Avatar>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{chatRoom.name}</span>
                {chatRoom.participants > 1 && (
                  <span className="font-light text-xs text-gray-500">
                    {chatRoom.participants}명
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="line-clamp-1 max-w-[200px]">
                  {chatRoom.lastMessage}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 min-w-[80px]">
            <span className="text-xs text-gray-500">
              {chatRoom.lastActivityTime}
            </span>
            {chatRoom.unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {chatRoom.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
