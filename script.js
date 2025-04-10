const board = document.getElementById('board');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const toggleModeBtn = document.getElementById('toggleMode');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let isGameOver = false;
let vsAI = false;

const winningCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Create board UI
function drawBoard() {
  board.innerHTML = '';
  cells.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = value;
    cell.addEventListener('click', () => handleClick(index));
    board.appendChild(cell);
  });
}

function handleClick(index) {
  if (cells[index] !== '' || isGameOver) return;

  cells[index] = currentPlayer;
  drawBoard();
  if (checkWinner(currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (!cells.includes('')) {
    statusText.textContent = "It's a draw!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 300);
  }
}

function aiMove() {
  const bestMove = minimax(cells, 'O').index;
  handleClick(bestMove);
}

// Minimax algorithm
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((v, i) => v === '' ? i : null)
    .filter(v => v !== null);

  if (checkWinner('X', newBoard)) return { score: -10 };
  if (checkWinner('O', newBoard)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWinner(player, boardState = cells) {
  return winningCombos.some(combo =>
    combo.every(i => boardState[i] === player)
  );
}

restartBtn.addEventListener('click', () => {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  isGameOver = false;
  statusText.textContent = "Player X's Turn";
  drawBoard();
});

toggleModeBtn.addEventListener('click', () => {
  vsAI = !vsAI;
  toggleModeBtn.textContent = vsAI ? 'Switch to 2-Player Mode' : 'Switch to AI Mode';
  restartBtn.click();
});

// Initialize
drawBoard();
