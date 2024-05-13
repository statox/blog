function CellSquare(index, bomb) {
    Cell.call(this, index, bomb);

    this.show = () => {
        const { x, y } = ijToxy(this.i, this.j);
        stroke(100);
        rect(x + 2, y + 2, CELL_SIZE - 4);

        let cellColor = color(125, 125, 125);

        if (this.isOpen) {
            if (this.bomb) {
                cellColor = color(250, 10, 10);
            } else {
                cellColor = color(200, 200, 200);
            }
        }
        if (this.flagged) {
            cellColor = color(100, 250, 100);
        }
        fill(cellColor);
        rect(x, y, CELL_SIZE);

        if (this.flagged) {
            textSize(D / COL);
            text('🚩', x, y + D / COL);
        }

        if (this.isOpen && !this.bomb && this.countBombNeighbors > 0) {
            fill(color(NUMBER_COLORS[this.countBombNeighbors - 1]));
            textSize(D / COL);
            text(this.countBombNeighbors, x, y + D / COL);
        }

        if (this.isOpen && this.bomb) {
            textSize(D / COL);
            text('💣', x, y + D / COL);
        }
    };

    this.getNeighbors = () => {
        const { i, j } = indexToij(this.index);
        const neighbors = [];
        if (j > 0) {
            if (i > 0) {
                const index = ijToIndex(i - 1, j - 1);
                neighbors.push(game.cells[index]);
            }
            const index = ijToIndex(i, j - 1);
            neighbors.push(game.cells[index]);
            if (i < COL - 1) {
                const index = ijToIndex(i + 1, j - 1);
                neighbors.push(game.cells[index]);
            }
        }

        if (i > 0) {
            const index = ijToIndex(i - 1, j);
            neighbors.push(game.cells[index]);
        }
        if (i < COL - 1) {
            const index = ijToIndex(i + 1, j);
            neighbors.push(game.cells[index]);
        }

        if (j < COL - 1) {
            if (i > 0) {
                const index = ijToIndex(i - 1, j + 1);
                neighbors.push(game.cells[index]);
            }
            const index = ijToIndex(i, j + 1);
            neighbors.push(game.cells[index]);
            if (i < COL - 1) {
                const index = ijToIndex(i + 1, j + 1);
                neighbors.push(game.cells[index]);
            }
        }

        return neighbors;
    };
}
