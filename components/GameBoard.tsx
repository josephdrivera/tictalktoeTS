import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface GameBoardProps {
    room: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ room }) => {
    const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });
        setSocket(newSocket);

        newSocket.emit('join', room);

        newSocket.on('updateGameState', (gameState) => {
            setSquares(gameState.board);
            setXIsNext(gameState.xIsNext);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    const handleClick = (i: number): void => {
        if (socket) {
            socket.emit('makeMove', { index: i, room });
        }
    };

    const renderSquare = (i: number): JSX.Element => (
        <button className="square" onClick={() => handleClick(i)}>
            {squares[i]}
        </button>
    );

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
            </div>
        </div>
    );
};

export default GameBoard;

const calculateWinner = (squares: string[]): string | null => {
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