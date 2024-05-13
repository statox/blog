const D = 800;
let FILLING_RATIO = 0.2;
let COL = 30;
let CELL_SIZE = D / COL;
const NUMBER_COLORS = [
    [10, 10, 230],
    [10, 230, 10],
    [230, 10, 10],
    [230, 230, 10],

    [10, 10, 115],
    [10, 115, 10],
    [115, 10, 10],
    [115, 115, 10]
];

let game;

function setup() {
    // Create the canvas and put it in its div
    var myCanvas = createCanvas(D, D);
    myCanvas.parent('canvasDiv');

    newGame();
    initParams();
}

function draw() {
    background(220);

    game.show();

    if (game.lost) {
        fill(250, 0, 0);
        textSize(40);
        text('GAME OVER', 150, D / 2);
    }
    if (game.won) {
        fill(0, 250, 0);
        textSize(40);
        text('YOU WIN', 150, D / 2);
    }
}

function mousePressed() {
    // Don't handle clicks out of canvas
    if (mouseX < 0 || mouseX > D || mouseY < 0 || mouseY > D) {
        return;
    }

    clickCell(mouseX, mouseY);
}

// Cheat keys
function keyPressed() {
    if (keyCode === UP_ARROW) {
        game.cells.forEach((c) => c.open());
    }

    if (keyCode === DOWN_ARROW) {
        newGame();
    }
}
