function getSolutionPath(currentX, currentY) {
    const queue = [[currentX, currentY, []]];
    const visited = new Set();
    
    while (queue.length > 0) {
        const [x, y, path] = queue.shift();
        const pos = `${x},${y}`;
        
        if (x === goal.x && y === goal.y) return [...path, [x, y]];
        if (visited.has(pos)) continue;
        visited.add(pos);

        const cell = maze[y][x];
        
        // Preverimo vse 4 smeri, ampak samo če NI zidu
        // Zgoraj
        if (!cell.walls.top && y > 0) queue.push([x, y - 1, [...path, [x, y]]]);
        // Spodaj
        if (!cell.walls.bottom && y < ROWS - 1) queue.push([x, y + 1, [...path, [x, y]]]);
        // Levo
        if (!cell.walls.left && x > 0) queue.push([x - 1, y, [...path, [x, y]]]);
        // Desno
        if (!cell.walls.right && x < COLS - 1) queue.push([x + 1, y, [...path, [x, y]]]);
    }
    return [];
}