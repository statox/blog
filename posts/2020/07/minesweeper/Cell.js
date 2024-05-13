function Cell(index, bomb) {
    const { i, j } = indexToij(index);

    this.index = index;
    this.i = i;
    this.j = j;
    this.bomb = bomb;
    this.isOpen = false;
    this.flagged = false;
    this.countBombNeighbors;
    this.neighbors;

    this.open = () => {
        this.isOpen = true;
        game.openedCells.add(this.index);
        if (!this.neighbors) {
            this.neighbors = this.getNeighbors();
            this.countBombNeighbors = this.neighbors.filter((n) => n.bomb).length;
        }
    };

    this.flagToggle = () => {
        this.flagged = !this.flagged;
        if (this.flagged) {
            if (game.flagsLeft > 0) {
                game.flaggedCells.add(this.index);
                game.flagsLeft--;
            }
        } else {
            game.flaggedCells.delete(this.index);
            game.flagsLeft++;
        }
    };
}
