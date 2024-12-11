import type { MetaFunction } from "@remix-run/node";
import Input from "~/components/input";
import { useEffect, useState } from "react";
import { connect, sendMsg } from "~/api";
import ChatHistory from "~/components/chat_history";
import Header from "~/components/header";
import UsernameModal from "~/components/username_modal";

export const meta: MetaFunction = () => {
  return [
    { title: "Realtime Chat App" },
    {
      name: "description",
      content:
        "Real-time chat application with user authentication. Built using React.js, Go and WebSockets!",
    },
  ];
};

export default function Index() {
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      setShowModal(true);
    } else {
      setUsername(storedUsername);
    }

    connect((msg: string) => {
      console.log("Got message: ", msg);
      setChatHistory((prevState) => [...prevState, msg]);
    });
  }, []);

  const send = () => {
    if (message.trim() === "") {
      return;
    }

    const requestBody = JSON.stringify({
      message: message,
      username: username,
    });

    console.log("Sending msg: ", requestBody);
    sendMsg(requestBody);
    setMessage("");
  };

  const handleUsernameSubmit = (username: string) => {
    setUsername(username);
    localStorage.setItem("username", username);
    setShowModal(false);
  };

  return (
    <div className="relative mx-auto mt-8 flex h-[80vh] max-w-2xl flex-col rounded-lg border border-indigo-200 bg-white">
      <Header />
      {showModal && <UsernameModal onSubmit={handleUsernameSubmit} />}
      <ChatHistory username={username} messages={chatHistory} />
      <Input message={message} setMessage={setMessage} send={send} />
    </div>
  );
}
