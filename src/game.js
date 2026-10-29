const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // the rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

/**
 * Checks if a player has three in a row.
 * @returns {boolean} true if there is a winner, false otherwise
 */
export function checkWin(board, player) {
  return winLines.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

/**
 * Checks if every cell is filled.
 * @returns {boolean} true if it's a tie, false otherwise
 */
export function checkTie(board) {
  return !board.includes('');
}
