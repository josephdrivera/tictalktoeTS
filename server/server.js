import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const gameState = {};

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Socket.IO server');
});

const calculateWinner = (board) => {
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : 'Tie';
};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);

    if (!gameState[room]) {
      gameState[room] = {
        board: Array(9).fill(null),
        xIsNext: true,
        players: [],
        winner: null,
        messages: []
      };
    }

    if (gameState[room].players.length < 2) {
      gameState[room].players.push(socket.id);
      if (gameState[room].players.length === 2) {
        gameState[room].xIsNext = Math.random() < 0.5;
      }
    }

    io.to(room).emit('updateGameState', gameState[room]);
  });

  socket.on('makeMove', ({ index, room }) => {
    const game = gameState[room];
    if (game && game.players.indexOf(socket.id) !== -1 && !game.board[index] && !game.winner) {
      game.board[index] = game.xIsNext ? 'X' : 'O';
      game.xIsNext = !game.xIsNext;
      game.winner = calculateWinner(game.board);

      io.to(room).emit('updateGameState', game);
    }
  });

  socket.on('sendMessage', (message) => {
    const rooms = Array.from(socket.rooms);
    if (rooms.length > 1) {
      const room = rooms[1]; // The first room is always the socket ID
      gameState[room].messages.push(message);
      io.to(room).emit('updateGameState', gameState[room]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    // Handle player disconnection here
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});