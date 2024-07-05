import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface GameBoardProps {
    room: string;
}

interface GameState {
    board: (string | null)[];
    xIsNext: boolean;
    players: string[];
    winner: string | null;
}

const GameBoard: React.FC<GameBoardProps> = ({ room }) => {
    const [gameState, setGameState] = useState<GameState>({
        board: Array(9).fill(null),
        xIsNext: true,
        players: [],
        winner: null
    });
    const [socket, setSocket] = useState<Socket | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        console.log('Connecting to socket...');
        const newSocket = io('http://localhost:3001', {
            transports: ['websocket'],
            upgrade: false
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server. Socket ID:', newSocket.id);
            // @ts-ignore
            setPlayerId(newSocket.id); // TODO: Fix this
            newSocket.emit('join', room);
        });

        newSocket.on('updateGameState', (newGameState: GameState) => {
            console.log('Received updated game state:', newGameState);
            setGameState(newGameState);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            console.log('Disconnecting socket...');
            newSocket.disconnect();
        };
    }, [room]);

    const handleClick = (index: number) => {
        console.log('Clicked square:', index);
        console.log('Current game state:', gameState);
        console.log('Is player turn:', isPlayerTurn());
        if (socket && isPlayerTurn() && !gameState.board[index] && !gameState.winner) {
            console.log('Emitting makeMove event');
            socket.emit('makeMove', { index, room });
        } else {
            console.log('Move not allowed');
        }
    };

    const isPlayerTurn = (): boolean => {
        const currentPlayerIndex = gameState.xIsNext ? 0 : 1;
        return gameState.players[currentPlayerIndex] === playerId;
    };

    const renderSquare = (index: number) => {
        const value = gameState.board[index];
        const display = value === 'X' ? '❌' : value === 'O' ? '⭕' : null;
        return (
            <button
                key={index}
                className="w-20 h-20 bg-white border border-gray-300 text-4xl font-bold flex items-center justify-center"
                onClick={() => handleClick(index)}
                disabled={!isPlayerTurn() || !!gameState.winner}
            >
                {display}
            </button>
        );
    };

    const getStatus = (): string => {
        if (gameState.winner) {
            return gameState.winner === 'Tie' ? "It's a tie!" : `Winner: ${gameState.winner === 'X' ? '❌' : '⭕'}`;
        } else if (gameState.players.length < 2) {
            return "Waiting for opponent to join...";
        } else if (!isPlayerTurn()) {
            return "Waiting for opponent's move";
        } else {
            return `Your turn (${gameState.xIsNext ? '❌' : '⭕'})`;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Game Room: {room}</h2>
            <div className="mb-4 text-xl font-semibold">{getStatus()}</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[0, 1, 2].map(row => (
                    <div key={`row-${row}`} className="flex">
                        {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm">
                <p>Your player ID: {playerId}</p>
                <p>Players in game: {gameState.players.join(', ')}</p>
                <p>Is your turn: {isPlayerTurn() ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};

export default GameBoard;