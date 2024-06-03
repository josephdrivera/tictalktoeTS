import { useState } from 'react';
import { calculateWinner } from '../utils/gameLogic';

// GameBoard component
const GameBoard: React.FC = () => {
  const [squares, setSquares] = useState<string[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: number): void => {
    const newSquares = squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };
  // Render a square
  const renderSquare = (i: number): JSX.Element => (
    <button className="square" onClick={() => handleClick(i)}>
      {squares[i]}
    </button>
  );
  // Check for a winner
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = winner === 'Tie' ? "It's a Tie!" : `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  // Render the game board
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