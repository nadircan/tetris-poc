// Tetris PoC - game.js

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const TETROMINOS = {
    I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: '#00f0f0' },
    O: { shape: [[1,1],[1,1]], color: '#f0f000' },
    T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: '#a000f0' },
    S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: '#00f000' },
    Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: '#f00000' },
    J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: '#0000f0' },
    L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: '#f0a000' }
};

const TETROMINO_NAMES = Object.keys(TETROMINOS);

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameRunning = false;
let gamePaused = false;
let dropInterval = null;
let dropSpeed = 1000;

// Board init
function initBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Create DOM cells
function createBoardCells() {
    const boardEl = document.getElementById('game-board');
    boardEl.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            boardEl.appendChild(cell);
        }
    }
}

// Create next piece preview cells
function createNextPieceCells() {
    const nextEl = document.getElementById('next-piece');
    nextEl.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const cell = document.createElement('div');
            cell.classList.add('next-cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            nextEl.appendChild(cell);
        }
    }
}

// Random piece
function randomPiece() {
    const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
    const t = TETROMINOS[name];
    return {
        shape: t.shape.map(row => [...row]),
        color: t.color,
        name: name,
        row: 0,
        col: Math.floor((COLS - t.shape[0].length) / 2)
    };
}

// Render board + current piece
function render() {
    // Clear all cells
    const boardEl = document.getElementById('game-board');
    const cells = boardEl.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        cell.style.backgroundColor = board[r][c] || '';
    });

    // Render current piece
    if (currentPiece) {
        const { shape, color, row, col } = currentPiece;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const boardRow = row + r;
                    const boardCol = col + c;
                    if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                        const cell = boardEl.querySelector(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                        if (cell) cell.style.backgroundColor = color;
                    }
                }
            }
        }
    }

    // Render next piece
    renderNextPiece();
}

// Render next piece preview
function renderNextPiece() {
    const nextEl = document.getElementById('next-piece');
    const cells = nextEl.querySelectorAll('.next-cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = '';
    });

    if (nextPiece) {
        const { shape, color } = nextPiece;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const cell = nextEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (cell) cell.style.backgroundColor = color;
                }
            }
        }
    }
}

// Update UI displays
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

// Collision detection
function isValidPosition(shape, row, col) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const newRow = row + r;
                const newCol = col + c;
                if (newCol < 0 || newCol >= COLS || newRow >= ROWS) return false;
                if (newRow >= 0 && board[newRow][newCol]) return false;
            }
        }
    }
    return true;
}

// Wall kick offsets to try when rotation collides
const WALL_KICKS = [
    [0, 0],   // no offset
    [0, -1],  // shift left
    [0, 1],   // shift right
    [0, -2],  // shift left 2 (for I piece)
    [0, 2],   // shift right 2 (for I piece)
    [-1, 0],  // shift up
    [-1, -1], // shift up-left
    [-1, 1],  // shift up-right
];

// Rotate matrix clockwise
function rotateMatrix(matrix) {
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            rotated[c][n - 1 - r] = matrix[r][c];
        }
    }
    return rotated;
}

// Rotate piece clockwise with wall kick
function rotatePiece() {
    const rotated = rotateMatrix(currentPiece.shape);
    for (const [dr, dc] of WALL_KICKS) {
        if (isValidPosition(rotated, currentPiece.row + dr, currentPiece.col + dc)) {
            currentPiece.shape = rotated;
            currentPiece.row += dr;
            currentPiece.col += dc;
            return;
        }
    }
}

// Move piece
function movePiece(dRow, dCol) {
    const newRow = currentPiece.row + dRow;
    const newCol = currentPiece.col + dCol;
    if (isValidPosition(currentPiece.shape, newRow, newCol)) {
        currentPiece.row = newRow;
        currentPiece.col = newCol;
        return true;
    }
    return false;
}

// Hard drop
function hardDrop() {
    while (movePiece(1, 0)) {}
    lockPiece();
}

// Lock piece to board
function lockPiece() {
    const { shape, color, row, col } = currentPiece;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const boardRow = row + r;
                const boardCol = col + c;
                if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
                    board[boardRow][boardCol] = color;
                }
            }
        }
    }
    spawnPiece();
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece || randomPiece();
    nextPiece = randomPiece();
    if (!isValidPosition(currentPiece.shape, currentPiece.row, currentPiece.col)) {
        gameOver();
    }
    render();
}

// Gravity tick
function drop() {
    if (!movePiece(1, 0)) {
        lockPiece();
    }
    render();
}

// Start game
function startGame() {
    initBoard();
    score = 0;
    level = 1;
    lines = 0;
    gameRunning = true;
    gamePaused = false;
    dropSpeed = 1000;
    updateDisplay();
    spawnPiece();
    startDropTimer();
    document.getElementById('start-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('restart-btn').disabled = false;
}

// Drop timer
function startDropTimer() {
    clearInterval(dropInterval);
    dropInterval = setInterval(drop, dropSpeed);
}

// Pause / resume
function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        clearInterval(dropInterval);
        document.getElementById('pause-btn').textContent = 'Devam Et';
    } else {
        startDropTimer();
        document.getElementById('pause-btn').textContent = 'Duraklat';
    }
}

// Restart
function restartGame() {
    clearInterval(dropInterval);
    gameRunning = false;
    startGame();
}

// Game over
function gameOver() {
    clearInterval(dropInterval);
    gameRunning = false;
    document.getElementById('pause-btn').disabled = true;
    alert('Oyun Bitti! Skor: ' + score);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;
    switch (e.key) {
        case 'ArrowLeft':
            movePiece(0, -1);
            break;
        case 'ArrowRight':
            movePiece(0, 1);
            break;
        case 'ArrowDown':
            movePiece(1, 0);
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':
            hardDrop();
            break;
    }
    render();
});

// Init
function init() {
    createBoardCells();
    createNextPieceCells();
    initBoard();
    updateDisplay();

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

document.addEventListener('DOMContentLoaded', init);
