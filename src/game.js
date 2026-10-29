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

/**
 * Returns a new board with the player's mark at index, leaving the old board alone.
 */
export function placeMark(board, index, player) {
  return board.map((cell, i) => (i === index ? player : cell));
}

/**
 * Scores a board by playing out every possible game from it.
 * Positive is good for O, negative is good for X. Subtracting the depth
 * makes the bot prefer quicker wins and slower losses.
 */
function minimax(board, isOTurn, depth) {
  if (checkWin(board, 'O')) {
    return 10 - depth;
  }
  if (checkWin(board, 'X')) {
    return depth - 10;
  }
  if (checkTie(board)) {
    return 0;
  }

  const player = isOTurn ? 'O' : 'X';
  const scores = [];
  board.forEach((cell, index) => {
    if (cell === '') {
      scores.push(minimax(placeMark(board, index, player), !isOTurn, depth + 1));
    }
  });
  // O picks the highest score, X picks the lowest
  return isOTurn ? Math.max(...scores) : Math.min(...scores);
}

/**
 * Picks the best cell for O to play.
 * @returns {number} the index of the cell
 */
export function bestMove(board) {
  let bestScore = -Infinity;
  let bestIndex = -1;
  board.forEach((cell, index) => {
    if (cell === '') {
      const score = minimax(placeMark(board, index, 'O'), false, 1);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
  });
  return bestIndex;
}
