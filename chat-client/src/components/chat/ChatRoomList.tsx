import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ChatRoomList = () => {
  const chatRooms = [
    {
      id: 1,
      name: "일반 채팅방",
      participants: 15,
      lastMessage: "안녕하세요!",
      lastActivityTime: "방금 전",
      unreadCount: 3,
      lastSender: {
        name: "김철수",
        avatar: "./../public/image/profile.png",
      },
    },
    {
      id: 2,
      name: "개발자 모임",
      participants: 8,
      lastMessage: "리액트 너무 재밌어요",
      lastActivityTime: "5분 전",
      unreadCount: 0,
      lastSender: {
        name: "이영희",
        avatar: "",
      },
    },
    {
      id: 3,
      name: "취미 공유방",
      participants: 23,
      lastMessage: "저도 같이 하고 싶어요",
      lastActivityTime: "30분 전",
      isPrivate: false,
      unreadCount: 5,
      lastSender: {
        name: "박지민",
        avatar: "",
      },
    },
  ];

  return (
    <div className="p-4">
      {chatRooms.map((chatRoom) => (
        <div
          key={chatRoom.id}
          className="flex items-center justify-between p-5 border-b hover:bg-slate-50 cursor-pointer"
        >
          <div className="flex items-center gap-4 flex-1">
            <Avatar>
              <AvatarImage src={chatRoom.lastSender.avatar} />
              <AvatarFallback>{chatRoom.lastSender.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{chatRoom.name}</span>
                <span className="font-light text-xs text-gray-500">
                  {chatRoom.participants}명
                </span>
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
