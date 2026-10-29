import { useState, useEffect } from 'react';
import Board from './components/Board';
import { checkWin, checkTie, placeMark, bestMove } from './game';

const emptyBoard = ['', '', '', '', '', '', '', '', ''];

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');

  // Derived from the board on every render, so there's no isGameActive state to keep in sync
  let winner = null;
  if (checkWin(board, 'X')) winner = 'X';
  if (checkWin(board, 'O')) winner = 'O';
  const isTie = !winner && checkTie(board);
  const isGameActive = !winner && !isTie;

  // The bot plays O. A timer is outside React, so it belongs in an effect
  useEffect(() => {
    if (!isGameActive || currentPlayer !== 'O') {
      return;
    }
    // Pause before moving so the bot doesn't feel instant
    const timeoutId = setTimeout(() => {
      setBoard(placeMark(board, bestMove(board), 'O'));
      setCurrentPlayer('X');
    }, 500);
    // Cleanup: if the game restarts during the pause, cancel the bot's move
    return () => clearTimeout(timeoutId);
  }, [board, currentPlayer, isGameActive]);

  function handleCellClick(index) {
    // Ignore taken cells, finished games, and clicks while the bot is thinking
    if (board[index] !== '' || !isGameActive || currentPlayer === 'O') {
      return;
    }
    // placeMark makes a new array instead of changing the old one, so React sees the update
    setBoard(placeMark(board, index, 'X'));
    setCurrentPlayer('O');
  }

  function resetGame() {
    setBoard(emptyBoard);
    setCurrentPlayer('X');
  }

  let status;
  if (winner) {
    status = `Player ${winner} Wins!`;
  } else if (isTie) {
    status = "It's a Tie!";
  } else {
    status = `Player ${currentPlayer}'s Turn`;
  }

  return (
    <div className="container">
      <header>
        <h1>Tic-Tac-Toe</h1>
      </header>

      <section className="status-panel">
        <div className="status-message">{status}</div>
        <button className="btn" onClick={resetGame}>Restart Game</button>
      </section>

      <main className="board-container">
        <Board board={board} onCellClick={handleCellClick} />
      </main>
    </div>
  );
}

export default App;
