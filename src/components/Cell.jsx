function Cell({ value, onClick }) {
  // 'taken' and 'x' / 'o' are the same CSS classes the vanilla version added
  const className = value ? `cell taken ${value.toLowerCase()}` : 'cell';

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

export default Cell;
