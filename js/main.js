const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const mCanvas = document.getElementById('matrixBG');
const mCtx = mCanvas.getContext('2d');
const timerDisplay = document.getElementById('timer-box');
const solveBtn = document.getElementById('solveBtn');
const autoSolveBtn = document.getElementById('autoSolveBtn');

canvas.width = COLS * CELL_SIZE;
canvas.height = ROWS * CELL_SIZE;

let showSolution = false;
let timeLeft = 60;
let timerInterval = null;
let isAutoSolving = false;
let autoSolveInterval = null;

function resizeMatrix() {
    mCanvas.width = window.innerWidth;
    mCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeMatrix);
resizeMatrix();

const mFontSize = 14;
const mColumns = Math.floor(mCanvas.width / mFontSize);
const mDrops = new Array(mColumns).fill(1);

function drawMatrix() {
    mCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
    mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
    mCtx.fillStyle = "#00ff41";
    mCtx.font = mFontSize + "px monospace";
    for (let i = 0; i < mDrops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0";
        mCtx.fillText(text, i * mFontSize, mDrops[i] * mFontSize);
        if (mDrops[i] * mFontSize > mCanvas.height && Math.random() > 0.975) {
            mDrops[i] = 0;
        }
        mDrops[i]++;
    }
}

function updateBinaryTimer() {
    if (timerDisplay) {
        timerDisplay.innerText = timeLeft.toString(2).padStart(6, '0');
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#00ff41";
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = maze[y][x];
            const px = x * CELL_SIZE;
            const py = y * CELL_SIZE;
            ctx.beginPath();
            if (cell.walls.top) { ctx.moveTo(px, py); ctx.lineTo(px + CELL_SIZE, py); }
            if (cell.walls.right) { ctx.moveTo(px + CELL_SIZE, py); ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE); }
            if (cell.walls.bottom) { ctx.moveTo(px, py + CELL_SIZE); ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE); }
            if (cell.walls.left) { ctx.moveTo(px, py); ctx.lineTo(px, py + CELL_SIZE); }
            ctx.stroke();
        }
    }
    ctx.shadowBlur = 0;

    const tx = (COLS - 1) * CELL_SIZE;
    const ty = (ROWS - 1) * CELL_SIZE;
    ctx.fillStyle = "#00ff41";
    ctx.fillRect(tx + 4, ty + 4, CELL_SIZE - 8, CELL_SIZE - 12);
    ctx.fillRect(tx + 6, ty + CELL_SIZE - 6, CELL_SIZE - 12, 2);

    if (showSolution) {
        const path = getSolutionPath(player.x, player.y);
        ctx.fillStyle = "rgba(0, 255, 65, 0.8)";
        ctx.font = "bold 10px monospace";
        const slowChar = Math.floor(Date.now() / 200);
        path.forEach(([px, py]) => {
            const seed = (px + py * COLS) + slowChar;
            const char = seed % 2 === 0 ? "1" : "0";
            ctx.fillText(char, px * CELL_SIZE + 6, py * CELL_SIZE + 15);
        });
    }

    const hx = player.x * CELL_SIZE;
    const hy = player.y * CELL_SIZE;
    const center = CELL_SIZE / 2;
    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#00ff41";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(hx + center - 4, hy + CELL_SIZE - 5, 3, 4);
    ctx.fillRect(hx + center + 1, hy + CELL_SIZE - 5, 3, 4);
    ctx.fillRect(hx + center - 5, hy + center + 4, 10, 6);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hx + center - 5, hy + center + 2); ctx.lineTo(hx + center - 7, hy + center + 8);
    ctx.moveTo(hx + center + 5, hy + center + 2); ctx.lineTo(hx + center + 7, hy + center + 8);
    ctx.stroke();
    ctx.fillStyle = "#cccccc"; ctx.fillRect(hx + center - 2, hy + center + 2, 4, 2);
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(hx + center, hy + center - 1, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000000"; ctx.beginPath(); ctx.arc(hx + center, hy + center - 1, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#00ff41"; ctx.fillRect(hx + center - 2, hy + center - 2, 1.5, 1.5); ctx.fillRect(hx + center + 0.5, hy + center - 2, 1.5, 1.5);
    ctx.restore();
}

function gameLoop() {
    drawMatrix();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    generateMaze();
    player = { x: start.x, y: start.y };
    showSolution = false;
    isAutoSolving = false;
    clearInterval(autoSolveInterval);
    clearInterval(timerInterval);
    solveBtn.innerText = "Pokaži rešitev";
    autoSolveBtn.innerText = "Auto Hack";
    autoSolveBtn.classList.remove("stop-mode");
    timeLeft = 60;
    updateBinaryTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateBinaryTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            Swal.fire({
                title: 'TIME OVERLOAD',
                text: 'Sistem se je zaklenil!',
                icon: 'error',
                background: '#000',
                color: '#ff3333',
                confirmButtonColor: '#ff3333'
            }).then(() => resetGame());
        }
    }, 1000);
}

function autoSolve() {
    if (isAutoSolving) {
        clearInterval(autoSolveInterval);
        isAutoSolving = false;
        autoSolveBtn.innerText = "Auto Hack";
        autoSolveBtn.classList.remove("stop-mode");
        return;
    }
    const path = getSolutionPath(player.x, player.y);
    if (!path || path.length === 0) return;
    isAutoSolving = true;
    autoSolveBtn.innerText = "Stop Auto Hack";
    autoSolveBtn.classList.add("stop-mode");
    let step = 0;
    autoSolveInterval = setInterval(() => {
        if (step < path.length) {
            player.x = path[step][0];
            player.y = path[step][1];
            if (player.x === COLS - 1 && player.y === ROWS - 1) {
                clearInterval(autoSolveInterval);
                clearInterval(timerInterval);
                isAutoSolving = false;
                Swal.fire({
                    title: 'ACCESS GRANTED',
                    text: 'Vdor uspel!',
                    icon: 'success',
                    background: '#000',
                    color: '#00ff41',
                    confirmButtonColor: '#00ff41'
                }).then(() => resetGame());
            }
            step++;
        } else {
            clearInterval(autoSolveInterval);
            isAutoSolving = false;
            autoSolveBtn.innerText = "Auto Hack";
            autoSolveBtn.classList.remove("stop-mode");
        }
    }, 100);
}

window.addEventListener('keydown', (e) => {
    if (isAutoSolving) return;
    const result = movePlayer(e.key);
    if (result === "DEAD") {
        clearInterval(timerInterval);
        Swal.fire({
            title: 'CONNECTION LOST',
            text: 'Zadel si steno!',
            icon: 'error',
            background: '#000',
            color: '#ff3333',
            confirmButtonColor: '#ff3333'
        }).then(() => resetGame());
    } else if (result === "WIN") {
        clearInterval(timerInterval);
        Swal.fire({
            title: 'ACCESS GRANTED',
            text: 'Vdor uspel!',
            icon: 'success',
            background: '#000',
            color: '#00ff41',
            confirmButtonColor: '#00ff41'
        }).then(() => resetGame());
    }
});

solveBtn.onclick = () => {
    showSolution = !showSolution;
    solveBtn.innerText = showSolution ? "Skrij rešitev" : "Pokaži rešitev";
};

autoSolveBtn.onclick = autoSolve;
document.getElementById('resetBtn').onclick = resetGame;

resetGame();
gameLoop();