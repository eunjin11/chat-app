import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();

const server = createServer(app);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Socket.IO Test</title>
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          
          socket.on('connect', () => {
            console.log('Connected to server');
          });
          
          socket.on('disconnect', () => {
            console.log('Disconnected from server');
          });
        </script>
      </head>
      <body>
        <h1>Socket.IO Test</h1>
      </body>
    </html>
  `);
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
