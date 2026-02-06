const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const rows = maze.length;
const cols = maze[0].length;
const cellSize = canvas.width / cols;

function drawMaze() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.fillStyle = maze[r][c] === 1 ? "black" : "white";
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
    }
}

function drawPlayer(player) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
        player.col * cellSize,
        player.row * cellSize,
        cellSize,
        cellSize
    );
}

function drawGoal() {
    ctx.fillStyle = "green";
    ctx.fillRect(
        goal.col * cellSize,
        goal.row * cellSize,
        cellSize,
        cellSize
    );
}

function redraw(player) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawGoal();
    drawPlayer(player);
}
