import type { ReactNode } from "react";
import { useRef, useEffect } from "react";

import Message from "~/models/message";
import MessageComponent from "./message_component";

interface ChatHistoryProps {
  username: string;
  messages: string[];
}

export default function ChatHistory({
  username,
  messages,
}: ChatHistoryProps): ReactNode {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages
    .map((message) => JSON.parse(message))
    .filter((parsedMessage) => parsedMessage.type !== 2);

  return (
    <div className="flex-grow overflow-y-auto">
      {filteredMessages.map((filteredMessage, index) => {
        // Optional Chaining untuk keamanan jika parsedBody.message atau parsedBody.username null/undefined
        const parsedBody = JSON.parse(filteredMessage.body);
        const message = new Message(
          filteredMessage.type,
          parsedBody?.message ?? "", // Default ke string kosong jika tidak ada
          parsedBody?.username ?? "" // Default ke string kosong jika tidak ada
        );

        return (
          <MessageComponent
            key={index}
            username={username}
            message={message}
            // isLastMessage tidak diperlukan lagi karena smooth scrolling sudah ditangani oleh useEffect
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
