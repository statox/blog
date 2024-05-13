function updateTimeSpan(time) {
    const timeSpan = document.getElementById('timeSpan');
    while (timeSpan.firstChild) {
        timeSpan.removeChild(timeSpan.firstChild);
    }
    timeSpan.appendChild(document.createTextNode(game.time));
}

function updateFlagsSpan(flagsLeft) {
    const flagSpan = document.getElementById('flagsSpan');
    while (flagSpan.firstChild) {
        flagSpan.removeChild(flagSpan.firstChild);
    }
    flagSpan.appendChild(document.createTextNode(game.flagsLeft));
}

function initParams() {
    document.getElementById('COLInput').value = COL;
    document.getElementById('RATIOInput').value = FILLING_RATIO;
}

function updateParams() {
    COL = document.getElementById('COLInput').value;
    FILLING_RATIO = document.getElementById('RATIOInput').value;
    CELL_SIZE = D / COL;
    newGame();
}
