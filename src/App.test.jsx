import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function setup() {
  const user = userEvent.setup();
  render(<App />);
  const cells = within(screen.getByRole('group', { name: 'Board' })).getAllByRole('button');
  const play = async (moves) => {
    for (const index of moves) {
      await user.click(cells[index]);
    }
  };
  return { user, cells, play };
}

describe('App', () => {
  it('starts with an empty board and X to move', () => {
    const { cells } = setup();
    expect(cells).toHaveLength(9);
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
  });

  it('places marks and swaps turns', async () => {
    const { cells, play } = setup();
    await play([4]);
    expect(cells[4]).toHaveTextContent('X');
    expect(screen.getByText("Player O's Turn")).toBeInTheDocument();
  });

  it('ignores clicks on a taken cell', async () => {
    const { cells, play } = setup();
    await play([4, 4]);
    expect(cells[4]).toHaveTextContent('X');
    expect(screen.getByText("Player O's Turn")).toBeInTheDocument();
  });

  it('announces a winner and stops the game', async () => {
    const { cells, play } = setup();
    await play([0, 3, 1, 4, 2]);
    expect(screen.getByText('Player X Wins!')).toBeInTheDocument();
    await play([5]);
    expect(cells[5]).toHaveTextContent('');
  });

  it('announces a tie', async () => {
    const { play } = setup();
    await play([0, 1, 2, 4, 3, 5, 7, 6, 8]);
    expect(screen.getByText("It's a Tie!")).toBeInTheDocument();
  });

  it('restarts the game', async () => {
    const { user, cells, play } = setup();
    await play([0, 3, 1, 4, 2]);
    await user.click(screen.getByRole('button', { name: 'Restart Game' }));
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
    cells.forEach((cell) => expect(cell).toHaveTextContent(''));
  });
});
