let player = { x: 0, y: 0 };

function movePlayer(key) {
    const currentCell = maze[player.y][player.x];

    if (key === "ArrowUp" && !currentCell.walls.top) player.y--;
    else if (key === "ArrowDown" && !currentCell.walls.bottom) player.y++;
    else if (key === "ArrowLeft" && !currentCell.walls.left) player.x--;
    else if (key === "ArrowRight" && !currentCell.walls.right) player.x++;
    else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        // Če pritisne tipko v smer, kjer JE stena -> IZGUBIL SI
        return "DEAD";
    }

    if (player.x === goal.x && player.y === goal.y) return "WIN";
    return "OK";
}