import { describe, it, expect } from 'vitest';
import { checkWin, checkTie } from './game';

describe('checkWin', () => {
  it('finds a row, a column, and a diagonal', () => {
    expect(checkWin(['X', 'X', 'X', '', '', '', '', '', ''], 'X')).toBe(true);
    expect(checkWin(['O', '', '', 'O', '', '', 'O', '', ''], 'O')).toBe(true);
    expect(checkWin(['', '', 'X', '', 'X', '', 'X', '', ''], 'X')).toBe(true);
  });

  it('only counts the given player', () => {
    expect(checkWin(['X', 'X', 'X', '', '', '', '', '', ''], 'O')).toBe(false);
  });

  it('returns false when nobody has three in a row', () => {
    expect(checkWin(['X', 'O', 'X', '', '', '', '', '', ''], 'X')).toBe(false);
  });
});

describe('checkTie', () => {
  it('is true only when every cell is filled', () => {
    expect(checkTie(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBe(true);
    expect(checkTie(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', ''])).toBe(false);
  });
});
