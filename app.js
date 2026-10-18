// ==========================================================================
// Global State Variables
// ==========================================================================
let board = ['', '', '', '', '', '', '', '', '']; // 9 empty spaces
let currentPlayer = 'X';
let isGameActive = true;

// ==========================================================================
// DOM Elements
// ==========================================================================
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');

// ==========================================================================
// Initialization
// ==========================================================================

// Listen for the HTML document to fully load before running our JS
document.addEventListener('DOMContentLoaded', initGame);

/**
 * Sets up the initial game board by creating 9 div elements,
 * attaching click listeners to them, and putting them on the screen.
 */
function initGame() {
  // Clear any existing HTML inside the board container
  // This is important for resetting the game
  boardElement.innerHTML = '';

  // Loop 9 times to create the 3x3 grid
  for (let i = 0; i < 9; i++) {
    // 1. Create a new div element
    const cell = document.createElement('div');
    
    // 2. Add the 'cell' CSS class to it
    cell.classList.add('cell');
    
    // 3. Store the index (0-8) inside the HTML element so we know which one was clicked
    cell.dataset.index = i;
    
    // 4. Attach an event listener: When this cell is clicked, call handleCellClick
    cell.addEventListener('click', handleCellClick);
    
    // 5. Append the cell to the board element in the DOM
    boardElement.appendChild(cell);
  }

  // Attach event listener to the reset button
  resetBtn.addEventListener('click', resetGame);
}

// ==========================================================================
// Game Logic & Event Handling
// ==========================================================================

/**
 * Handles what happens when a user clicks on a cell.
 * @param {Event} event - The click event object
 */
function handleCellClick(event) {
  // 'event.target' refers to the exact HTML element that was clicked
  const clickedCell = event.target;
  
  // Retrieve the index we stored earlier and convert it to a number
  const cellIndex = parseInt(clickedCell.dataset.index);

  // Check if the cell is already filled OR if the game is over.
  // If either is true, exit the function early (do nothing).
  if (board[cellIndex] !== '' || isGameActive === false) {
    return;
  }
  makeMove(cellIndex);
  if (isGameActive && currentPlayer === 'O') {
    makeMove(bestMove());
  }
}

function makeMove(index) {
  const cell = document.querySelector(`[data-index="${index}"]`);
  // TODO 1: Update the internal state (the 'board' array) with the current player
  board[index] = currentPlayer;
  // TODO 2: Update the DOM to reflect the internal state!
  // you may need to update both inner html and css classes of DOM elements
  cell.textContent = currentPlayer;
  cell.classList.add('taken', currentPlayer.toLowerCase());
  // TODO 3: Check for (and possibly handle) a winner (Call the checkWin() function)
  if (checkWin(board, currentPlayer)) {
    statusElement.textContent = `Player ${currentPlayer} Wins!`;
    isGameActive = false;
    return;
  }

  // TODO 4: Check for (and possibly handle) a tie (Call the checkTie() function)
  if (checkTie()) {
    statusElement.textContent = "It's a tie!";
    isGameActive = false;
    return;
  }

  // TODO 5: Swap the currentPlayer from 'X' to 'O' or 'O' to 'X'
      if (currentPlayer === 'X') {
    currentPlayer = 'O';
  } else {
    currentPlayer = 'X';
  }
  // TODO 6: Update the statusElement to show whose turn it is now
 statusElement.textContent = `Player ${currentPlayer}'s Turn`;
}
 /**
 * Checks for a winner.
 * @returns {boolean} true if there is a winner, false otherwise
 */
function checkWin(b, player) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (const line of winningLines) {
    if (
      b[line[0]] === player &&
      b[line[1]] === player &&
      b[line[2]] === player
    ) {
      return true;
    }
  }
  return false;
}
/**
 * Checks for a tie game.
 * @returns {boolean} true if it's a tie, false otherwise
 */
function checkTie() {
  if (board.includes('')) {
    return false;
  }
  return true;
}

function minimax(b, isOTurn) {
  if (checkWin(b, 'O')) {
    return 1;
  }
  if (checkWin(b, 'X')) {
    return -1;
  }
  if (!b.includes('')) {
    return 0;
  }

  if (isOTurn) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'O';
        const score = minimax(b, false);
        b[i] = '';
        best = Math.max(best, score);
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'X';
        const score = minimax(b, true);
        b[i] = '';
        best = Math.min(best, score);
      }
    }
    return best;
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let bestIndex = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      const score = minimax(board, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
  }
  return bestIndex;
}

/**
 * Resets all state variables and the DOM to start a new game.
 */
function resetGame() {
  // TODO: reset internal state
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  statusElement.textContent = `Player ${currentPlayer}'s Turn`;
  // To clear the DOM easily, just call initGame() again to rebuild the empty cells!
  initGame();
}