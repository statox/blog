function ijtoIndex(i, j) {
    return i + j * COLS;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.alive = Math.random() > 0.5;
    this.nextAlive = this.alive;
    this.neighbors;

    this.show = () => {
        if (this.alive) {
            fill(cellColor);
            stroke(cellColor);
            ellipse(this.i * CELL_SIZE, this.j * CELL_SIZE, CELL_SIZE);
        }
    };

    this.setupNeighbors = () => {
        this.neigbors = [];
        if (this.j > 0) {
            if (this.i > 0) {
                this.neigbors.push(ijtoIndex(this.i - 1, this.j - 1));
            }
            this.neigbors.push(ijtoIndex(this.i, this.j - 1));
            if (this.i < COLS - 1) {
                this.neigbors.push(ijtoIndex(this.i + 1, this.j - 1));
            }
        }
        if (this.i > 0) {
            this.neigbors.push(ijtoIndex(this.i - 1, this.j));
        }
        if (this.i < COLS - 1) {
            this.neigbors.push(ijtoIndex(this.i + 1, this.j));
        }
        if (this.j < COLS - 1) {
            if (this.i > 0) {
                this.neigbors.push(ijtoIndex(this.i - 1, this.j + 1));
            }
            this.neigbors.push(ijtoIndex(this.i, this.j + 1));
            if (this.i < COLS - 1) {
                this.neigbors.push(ijtoIndex(this.i + 1, this.j + 1));
            }
        }
    };

    this.countNeighbors = () => this.neigbors.filter((n) => cells[n].alive).length;
}
