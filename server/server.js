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

  const gameState = {};

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room: ${room}`);

      if (!gameState[room]) {
        gameState[room] = {
          board: Array(9).fill(null),
          xIsNext: true,
          messages: [],
          players: [],
        };
      }

      if (gameState[room].players.length < 2) {
        gameState[room].players.push(socket.id);
      }

      io.to(room).emit('updateGameState', gameState[room]);
    });

    socket.on('sendMessage', (message) => {
      const rooms = Array.from(socket.rooms);
      if (rooms.length > 1) {
        const room = rooms[1];
        gameState[room].messages.push(message);
        io.to(room).emit('message', message);
      }
    });

    socket.on('makeMove', ({ index, room }) => {
      const currentGameState = gameState[room];
      const currentPlayer = socket.id;
      const currentPlayerIndex = currentGameState.xIsNext ? 0 : 1;

      if (currentGameState.players[currentPlayerIndex] !== currentPlayer) {
        return;
      }

      if (currentGameState.board[index] || calculateWinner(currentGameState.board)) {
        return;
      }

      currentGameState.board[index] = currentGameState.xIsNext ? 'X' : 'O';
      currentGameState.xIsNext = !currentGameState.xIsNext;

      io.to(room).emit('updateGameState', currentGameState);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };
});