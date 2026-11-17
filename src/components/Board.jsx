import Cell from './Cell';

function Board({ board, onCellClick }) {
  return (
    <div className="board">
      {board.map((value, index) => (
        // The board never reorders, so the index is a safe key here
        <Cell key={index} value={value} onClick={() => onCellClick(index)} />
      ))}
    </div>
  );
}

export default Board;
