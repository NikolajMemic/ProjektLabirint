redraw(player);

document.addEventListener("keydown", (e) => {
    movePlayer(e.key);
    redraw(player);

    if (player.row === goal.row && player.col === goal.col) {
        alert("Cilj dosežen 🎉");
    }
});
