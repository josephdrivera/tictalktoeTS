const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production'; // Check if we are in development
const app = next({ dev }); // Create a Next.js app
const handle = app.getRequestHandler(); // Get the request handler from Next.js

// Prepare the Next.js app
app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);
// Handle socket connections
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });
// Send message to all clients in the room
    socket.on('sendMessage', (message) => {
      const rooms = Object.keys(socket.rooms);
      if (rooms.length > 1) {
        const room = rooms[1];
        io.to(room).emit('message', message);
      }
    });
// Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
// Start the server
  httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});