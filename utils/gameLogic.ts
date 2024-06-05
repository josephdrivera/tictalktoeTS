export const calculateWinner = (squares: string[]): string | null => {
    // Check for a winner
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]; // All possible winning lines
    // Check if any of the winning lines have the same value
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    // Check for a tie
    if (squares.every(square => square !== null)) {
      return 'Tie';
    }
    return null;
  };