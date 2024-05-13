function Game(fillingRatio) {
    this.nbCells = COL * COL;
    this.lost = false;
    this.won = false;
    this.cells = [];
    this.bombs = 0;
    this.openedCells = new Set();
    this.flaggedCells = new Set();
    this.fillingRatio = fillingRatio;
    this.flagsLeft = 0;
    this.time = 0;
    this.startTime = Math.round(millis() / 1000);

    for (let i = 0; i < this.nbCells; i++) {
        const bomb = Math.random() < this.fillingRatio;
        if (bomb) {
            this.bombs++;
        }
        this.cells.push(new CellSquare(i, bomb));
    }
    this.flagsLeft = this.bombs;

    this.updateTime = () => {
        if (!this.lost && !this.won) {
            this.time = Math.round(millis() / 1000 - this.startTime);
            updateTimeSpan();
        }
    };
    setInterval(this.updateTime, 1000);

    this.show = () => {
        this.cells.forEach((c) => c.show());
    };
}
