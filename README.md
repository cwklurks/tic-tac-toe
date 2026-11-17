# Tic-Tac-Toe

My Computer Programming 12 tic-tac-toe project. This branch is the React refactor of the 3x3 game. You play X and the computer plays O.

## Branches

- `main` is the original two-player game in vanilla JavaScript.
- `minimax` is the vanilla game with a computer player.
- `react` is this branch. It is the same game rebuilt in React.

I also made a 4x4 version in its own repo: https://github.com/cwklurks/tic-tac-toe-4x4

## How to run it

```
npm install
npm run dev
```

Then open the link that Vite prints.

## How it is built

- `src/App.jsx` holds the state, which is the board and whose turn it is. It works out the winner and the tie from the board each time it renders.
- `src/components/Board.jsx` draws the nine cells.
- `src/components/Cell.jsx` is one square. It gets its value and its click handler as props.
- `src/game.js` has the game logic with no React in it: `checkWin`, `checkTie`, `placeMark` and the minimax functions that pick the computer's move.
