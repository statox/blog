function customResizeCanvas() {
    const dim = Math.min(windowHeight, windowWidth) * 0.9;
    resizeCanvas(dim, dim);
}

function initializeButtons() {
    document.getElementById('toggleWiggleButton').addEventListener('click', (e) => {
        boidsSettings.enableWiggle = !boidsSettings.enableWiggle;
    });

    document.getElementById('changeShapeButton').addEventListener('click', (e) => {
        boidsSettings.enableRoundShape = !boidsSettings.enableRoundShape;
    });

    document.getElementById('toggleAlignmentButton').addEventListener('click', (e) => {
        boidsSettings.enableAlignment = !boidsSettings.enableAlignment;
    });

    document.getElementById('toggleSeparationButton').addEventListener('click', (e) => {
        boidsSettings.enableSeparation = !boidsSettings.enableSeparation;
    });

    document.getElementById('toggleCohesionButton').addEventListener('click', (e) => {
        boidsSettings.enableCohesion = !boidsSettings.enableCohesion;
    });

    document.getElementById('followMouseButton').addEventListener('click', (e) => {
        boidsSettings.enableFollowMouse = !boidsSettings.enableFollowMouse;
    });

    document.getElementById('followTargetButton').addEventListener('click', (e) => {
        boidsSettings.enableFollowTarget = !boidsSettings.enableFollowTarget;
    });

    document.getElementById('wrapEdgesButton').addEventListener('click', (e) => {
        boidsSettings.enableWrapEdges = !boidsSettings.enableWrapEdges;
    });

    document.getElementById('showPerceptionCirclesButton').addEventListener('click', (e) => {
        boidsSettings.enableShowPerception = !boidsSettings.enableShowPerception;
    });

    document.getElementById('obstaclesDrawingButton').addEventListener('click', (e) => {
        boidsSettings.enableObstaclesDrawing = !boidsSettings.enableObstaclesDrawing;
    });

    document.getElementById('predatorDrawingButton').addEventListener('click', (e) => {
        boidsSettings.enablePredatorDrawing = !boidsSettings.enablePredatorDrawing;
    });
}

function keyPressed() {
    if (keyCode === CONTROL) {
        boidsSettings.enableObstaclesDrawing = true;
    }
    if (keyCode === SHIFT) {
        boidsSettings.enablePredatorDrawing = true;
    }
}

function keyReleased() {
    if (keyCode === CONTROL) {
        boidsSettings.enableObstaclesDrawing = false;
    }
    if (keyCode === SHIFT) {
        boidsSettings.enablePredatorDrawing = false;
    }
}

function windowResized() {
    customResizeCanvas();
}

function mousePressed(e) {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return;
    }
    const mousePosition = new p5.Vector(mouseX, mouseY);

    if (mouseButton === 'left') {
        const dx = random(-1, 1);
        const dy = random(-1, 1);
        const vel = new p5.Vector(dx, dy).normalize();

        birds.push(new Bird(birds.length, mousePosition, vel));
    }

    if (mouseButton === 'right') {
        const obstacle = new Obstacle(obstacles.length, mousePosition, 30);
        obstacles.push(obstacle);
    }
}

function scenarioOneBoidNoWiggle() {
    boidsSettings.goBackInInterface = 'basicBehaviorAnchor';
    boidsSettings.enableAlignment = false;
    boidsSettings.enableSeparation = false;
    boidsSettings.enableCohesion = false;
    boidsSettings.enableWrapEdges = false;
    boidsSettings.CROWD_SIZE = 1;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 0;
    boidsSettings.enableFollowTarget = false;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = false;
    resetBirds();
    resetObstacles();
}

function scenarioOneBoidWiggle() {
    scenarioOneBoidNoWiggle();
    boidsSettings.goBackInInterface = 'basicBehavior2Anchor';
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
}

function scenarioMultipleBoidsWiggle() {
    boidsSettings.goBackInInterface = 'basicBehavior3Anchor';
    boidsSettings.enableAlignment = false;
    boidsSettings.enableSeparation = false;
    boidsSettings.enableCohesion = false;
    boidsSettings.enableWrapEdges = false;
    boidsSettings.CROWD_SIZE = 20;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = false;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = false;
    resetBirds();
    resetObstacles();
}

function scenarioBoidsAlignment() {
    boidsSettings.goBackInInterface = 'alignmentAnchor';
    boidsSettings.enableAlignment = true;
    boidsSettings.enableSeparation = false;
    boidsSettings.enableCohesion = false;
    boidsSettings.enableWrapEdges = false;
    boidsSettings.CROWD_SIZE = 20;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = false;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = true;
    resetBirds();
    resetObstacles();
}

function scenarioBoidsSeparation() {
    boidsSettings.goBackInInterface = 'separationAnchor';
    boidsSettings.enableAlignment = true;
    boidsSettings.enableSeparation = true;
    boidsSettings.enableCohesion = false;
    boidsSettings.enableWrapEdges = false;
    boidsSettings.CROWD_SIZE = 20;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = false;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = true;
    resetBirds();
    resetObstacles();
}

function scenarioBoidsCohesion() {
    boidsSettings.goBackInInterface = 'cohesionAnchor';
    boidsSettings.enableAlignment = true;
    boidsSettings.enableSeparation = true;
    boidsSettings.enableCohesion = true;
    boidsSettings.enableWrapEdges = false;
    boidsSettings.CROWD_SIZE = 20;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = false;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = true;
    resetBirds();
    resetObstacles();
}

function scenarioTarget() {
    boidsSettings.goBackInInterface = 'targetAnchor';
    boidsSettings.enableAlignment = true;
    boidsSettings.enableSeparation = true;
    boidsSettings.enableCohesion = true;
    boidsSettings.enableWrapEdges = true;
    boidsSettings.CROWD_SIZE = 20;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = true;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = true;
    resetBirds();
    resetObstacles();
}

function scenarioPredators() {
    boidsSettings.goBackInInterface = 'predatorsAnchor';
    boidsSettings.enableAlignment = true;
    boidsSettings.enableSeparation = true;
    boidsSettings.enableCohesion = true;
    boidsSettings.enableWrapEdges = true;
    boidsSettings.CROWD_SIZE = 100;
    boidsSettings.enableWiggle = true;
    boidsSettings.MAX_WIGGLE_ANGLE = 50;
    boidsSettings.enableFollowTarget = true;
    boidsSettings.enableFollowMouse = false;
    boidsSettings.enableShowPerception = false;
    resetBirds();
    resetObstacles();

    for (let i = 0; i < 2; i++) {
        const pos = new p5.Vector(random(0, width), random(0, height));
        predators.push(new Predator(i, pos, 30));
    }

    for (let i = 0; i < width; i += 30) {
        const p1 = new p5.Vector(i, 0);
        const obstacle1 = new Obstacle(obstacles.length, p1, 30);
        obstacles.push(obstacle1);

        const p2 = new p5.Vector(i, height);
        const obstacle2 = new Obstacle(obstacles.length, p2, 30);
        obstacles.push(obstacle2);
    }
}
