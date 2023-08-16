import { Server } from "socket.io";

export default function SocketHandler(req:any, res:any) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server , {path:"/api/socket"});
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("send-messages", (obj) => {
      io.emit("receive-messages", obj);
    });
  });

  console.log("Setting up socket");
  res.end();
}