import { useState } from 'react';
import Board from './components/Board';
import { checkWin, checkTie } from './game';

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

  function handleCellClick(index) {
    if (board[index] !== '' || !isGameActive) {
      return;
    }
    // Make a new array instead of changing the old one, so React sees the update
    const nextBoard = board.map((cell, i) => (i === index ? currentPlayer : cell));
    setBoard(nextBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
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
