const player = {
    row: start.row,
    col: start.col
};

function movePlayer(key) {
    let r = player.row;
    let c = player.col;

    if (key === "ArrowUp") r--;
    if (key === "ArrowDown") r++;
    if (key === "ArrowLeft") c--;
    if (key === "ArrowRight") c++;

    if (maze[r][c] === 0) {
        player.row = r;
        player.col = c;
    }
}
