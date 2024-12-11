import { ReactNode } from "react";
import Message from "~/models/message";

interface MessageProps {
  username: string;
  message: Message | null; // Izinkan null untuk keamanan
}

export default function MessageComponent({
  username,
  message,
}: MessageProps): ReactNode {
  const isCurrentUser = message?.username === username;

  if (!message) {
    return null; // Atau tampilkan loading indicator jika message masih dimuat
  }

  return (
    <div className="message-container">
      <div className="px-4 pt-2">
        {message.type === 2 ? (
          <p className="text-lg text-gray-400">{message.message}</p>
        ) : (
          <div
            className={`${
              isCurrentUser ? "text-right" : ""
            } text-lg message-content`}
          >
            <div className="text-lg text-indigo-500">{message.username}</div>
            <p className="mt-1 text-lg text-gray-600">{message.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
