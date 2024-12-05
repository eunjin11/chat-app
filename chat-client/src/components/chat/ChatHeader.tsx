import { Avatar, AvatarImage } from "../ui/avatar";

interface ChatHeaderProps {
  title: string;
  roomImageUrl: string;
  description: string;
}

export const ChatHeader = ({
  title,
  roomImageUrl,
  description,
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={roomImageUrl} />
        </Avatar>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500 p-0">{description}</div>
        </div>
      </div>
    </div>
  );
};
