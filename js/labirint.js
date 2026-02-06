const maze = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1],
    [1,1,1,1,1,1,1]
];

const start = { row: 1, col: 1 };
const goal  = { row: maze.length - 2, col: maze[0].length - 2 };
