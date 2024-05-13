const ijToxy = (i, j) => {
    return {
        x: i * (D / COL),
        y: j * (D / COL)
    };
};

const xyToij = (x, y) => {
    return {
        i: Math.floor(x / CELL_SIZE),
        j: Math.floor(y / CELL_SIZE)
    };
};

const ijToIndex = (i, j) => {
    return i + COL * j;
};

const indexToij = (index) => {
    return {
        i: index % COL,
        j: Math.floor(index / COL)
    };
};

function clickCell(x, y) {
    // Don't accept inputs when user lost
    if (game.lost) {
        return;
    }

    const { i, j } = xyToij(x, y);
    const cell = game.cells[ijToIndex(i, j)];

    if (mouseButton === 'left') {
        // Don't click already clicked cells or the flagged ones
        if (cell.isOpen || cell.flagged) {
            return;
        }

        if (cell.bomb) {
            loseGame();
        }

        openCells(cell.index, new Set());
    }

    if (mouseButton === 'right' && !cell.isOpen) {
        cell.flagToggle();
        updateFlagsSpan();
    }

    if (game.flaggedCells.size === game.bombs && game.openedCells.size === COL * COL - game.bombs) {
        winGame();
    }
}

function openCells(index, visited) {
    const cell = game.cells[index];
    cell.open();
    visited.add(cell.index);

    if (cell.countBombNeighbors > 0) {
        return;
    }

    cell.neighbors.forEach((n) => {
        if (!visited.has(n.index)) {
            openCells(n.index, visited);
        }
    });
}

function newGame() {
    game = new Game(FILLING_RATIO);
    updateFlagsSpan(game.flagsLeft);
}
function loseGame() {
    game.lost = true;
    game.cells.filter((c) => c.bomb).forEach((c) => c.open());
}

function winGame() {
    game.won = true;
}
