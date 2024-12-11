// import { getWsApiUrl } from "./config";

const wsApiUrl = "ws://localhost:8080/ws";
let socket: WebSocket;

const connect = (cb: (msg: string) => void) => {
  console.log("Attempting Connection...");
  socket = new WebSocket(wsApiUrl);

  socket.onopen = () => {
    console.log("Successfully connected");
  };

  socket.onmessage = (msg) => {
    cb(msg.data);
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    console.log("Close code: ", event.code);
    console.log("Close reason: ", event.reason);
    console.log("Was clean: ", event.wasClean);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

const sendMsg = (msg: string) => {
  socket.send(msg);
};

export { connect, sendMsg };
