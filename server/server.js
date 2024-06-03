const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('sendMessage', (message) => {
      const rooms = Object.keys(socket.rooms);
      if (rooms.length > 1) {
        const room = rooms[1];
        io.to(room).emit('message', message);
      }
    });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});