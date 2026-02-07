const COLS = 30; 
const ROWS = 30;
const CELL_SIZE = 20; 
let maze = [];

// Definiramo vhod in izhod (celice)
const start = { x: 0, y: 0 };
const goal = { x: COLS - 1, y: ROWS - 1 };

function generateMaze() {
    // 1. USTVARIMO MREŽO CELIC
    maze = [];
    for (let y = 0; y < ROWS; y++) {
        maze[y] = [];
        for (let x = 0; x < COLS; x++) {
            maze[y][x] = {
                x: x,
                y: y,
                visited: false,
                walls: { top: true, right: true, bottom: true, left: true }
            };
        }
    }

    // 2. DFS ALGORITEM (Recursive Backtracker)
    let stack = [];
    let current = maze[0][0];
    current.visited = true;

    function getNeighbors(cell) {
        let neighbors = [];
        let { x, y } = cell;

        if (y > 0) neighbors.push(maze[y - 1][x]);
        if (x < COLS - 1) neighbors.push(maze[y][x + 1]);
        if (y < ROWS - 1) neighbors.push(maze[y + 1][x]);
        if (x > 0) neighbors.push(maze[y][x - 1]);

        return neighbors.filter(n => !n.visited);
    }

    function removeWalls(a, b) {
        let x = a.x - b.x;
        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }

        let y = a.y - b.y;
        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    stack.push(current);
    while (stack.length > 0) {
        let nextNeighbors = getNeighbors(current);

        if (nextNeighbors.length > 0) {
            let next = nextNeighbors[Math.floor(Math.random() * nextNeighbors.length)];
            removeWalls(current, next);
            next.visited = true;
            stack.push(current);
            current = next;
        } else {
            current = stack.pop();
        }
    }

    // 3. KLJUČNI DEL: LUKNJE V STENI (Vhod in Izhod)
    
    // Vhod: Odstranimo zgornjo steno v prvi celici (0,0)
    // To naredi luknjo na vrhu labirinta
    maze[0][0].walls.top = false;
    
    // Izhod: Odstranimo spodnjo steno v zadnji celici (29,29)
    // To naredi luknjo na dnu labirinta
    maze[ROWS - 1][COLS - 1].walls.bottom = false;
}