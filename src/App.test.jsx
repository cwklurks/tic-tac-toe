import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Fake timers let the tests skip the bot's 500ms pause instead of really waiting
// (shouldAdvanceTime keeps Testing Library's own internal timers working)
beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

function setup() {
  const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  render(<App />);
  const cells = within(screen.getByRole('group', { name: 'Board' })).getAllByRole('button');
  const waitForBot = () => act(() => vi.advanceTimersByTime(500));
  // Clicks each of X's moves and lets the bot answer after each one
  const play = async (moves) => {
    for (const index of moves) {
      await user.click(cells[index]);
      waitForBot();
    }
  };
  return { user, cells, play, waitForBot };
}

const countOs = (cells) => cells.filter((cell) => cell.textContent === 'O').length;

describe('App', () => {
  it('starts with an empty board and X to move', () => {
    const { cells } = setup();
    expect(cells).toHaveLength(9);
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
  });

  it('places X, then the bot answers with O after a pause', async () => {
    const { user, cells } = setup();
    await user.click(cells[4]);
    expect(cells[4]).toHaveTextContent('X');
    expect(screen.getByText("Player O's Turn")).toBeInTheDocument();
    expect(countOs(cells)).toBe(0);

    act(() => vi.advanceTimersByTime(500));
    expect(countOs(cells)).toBe(1);
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
  });

  it('ignores clicks while the bot is thinking', async () => {
    const { user, cells } = setup();
    await user.click(cells[4]);
    await user.click(cells[0]);
    expect(cells[0]).toHaveTextContent('');
  });

  it('ignores clicks on a taken cell', async () => {
    const { user, cells, play } = setup();
    await play([4]);
    await user.click(cells[4]);
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
  });

  it('lets the bot win and then stops the game', async () => {
    const { cells, play } = setup();
    await play([0, 1, 3]);
    expect(screen.getByText('Player O Wins!')).toBeInTheDocument();
    await play([5]);
    expect(cells[5]).toHaveTextContent('');
  });

  it('announces a tie', async () => {
    const { play } = setup();
    await play([0, 1, 6, 5, 8]);
    expect(screen.getByText("It's a Tie!")).toBeInTheDocument();
  });

  it('restarts the game', async () => {
    const { user, cells, play } = setup();
    await play([0, 1, 3]);
    await user.click(screen.getByRole('button', { name: 'Restart Game' }));
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
    cells.forEach((cell) => expect(cell).toHaveTextContent(''));
  });

  it('cancels the bot move if you restart during its pause', async () => {
    const { user, cells, waitForBot } = setup();
    await user.click(cells[4]);
    await user.click(screen.getByRole('button', { name: 'Restart Game' }));
    waitForBot();
    expect(countOs(cells)).toBe(0);
    expect(screen.getByText("Player X's Turn")).toBeInTheDocument();
  });
});
