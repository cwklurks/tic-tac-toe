import Cell from './Cell';

function Board({ board, onCellClick }) {
  return (
    <div className="board" role="group" aria-label="Board">
      {board.map((value, index) => (
        // The board never reorders, so the index is a safe key here
        <Cell key={index} value={value} onClick={() => onCellClick(index)} />
      ))}
    </div>
  );
}

export default Board;
