const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`Client joined room: ${room}`);
    });

    socket.on('sendMessage', (message) => {
      const rooms = Array.from(socket.rooms);
      if (rooms.length > 1) {
        const room = rooms[1];
        io.to(room).emit('message', message);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});