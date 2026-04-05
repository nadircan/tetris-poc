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

// Init
function init() {
    createBoardCells();
    createNextPieceCells();
    initBoard();
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', init);
