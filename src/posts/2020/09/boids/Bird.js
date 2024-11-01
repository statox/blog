function Bird(id, pos, vel) {
    this.id = id;
    this.pos = pos;
    this.vel = vel;
    this.acc = new p5.Vector(0, 0);
    this.nextAcc = new p5.Vector(0, 0);
    this.r = 10;
    this.color = random(255);
    this.marked = false;

    this.alignmentFriends = [];
    this.separationFriends = [];
    this.cohesionFriends = [];
    this.nearObstacles = [];
    this.nearPredators = [];

    // Populate the arrays of friends for each force to do the computations efficiently
    this.updateFriends = () => {
        const alignment = [];
        const separation = [];
        const cohesion = [];
        const myobstacles = []; // The name obstacles is already a global variable
        const predators = [];

        const alignmentCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.ALIGNMENT_FRIENDS_RADIUS);
        birdsQTree.query(alignmentCircle, alignment);
        const separationCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.SEPARATION_FRIENDS_RADIUS);
        birdsQTree.query(separationCircle, separation);
        const cohesionCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.COHESION_FRIENDS_RADIUS);
        birdsQTree.query(cohesionCircle, cohesion);
        const obstaclesCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.OBSTACLE_RADIUS);
        obstaclesQTree.query(obstaclesCircle, myobstacles);
        const predatorsCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.PREDATOR_RADIUS);
        predatorsQTree.query(predatorsCircle, predators);

        const isInFieldOfView = (otherPos) => {
            const directionToOther = this.pos.copy().sub(otherPos);
            const angleToOther = this.vel.angleBetween(directionToOther);
            return Math.abs(angleToOther) >= PI - radians(boidsSettings.MAX_WIGGLE_ANGLE / 2);
        };

        this.alignmentFriends = alignment.map((i) => i.userData).filter((id) => isInFieldOfView(birds[id].pos));
        this.separationFriends = separation.map((i) => i.userData).filter((id) => isInFieldOfView(birds[id].pos));
        this.cohesionFriends = cohesion.map((i) => i.userData).filter((id) => isInFieldOfView(birds[id].pos));
        this.nearObstacles = myobstacles.map((i) => i.userData).filter((id) => isInFieldOfView(obstacles[id].pos));
        try {
            this.nearPredators = predators.map((i) => i.userData).filter((id) => isInFieldOfView(predators[id].pos));
        } catch (e) {
            debugger; // AFA
        }
    };

    // Either wrap around edges or return an acceleration repealling from edges
    this.getBorderAvoidingAcceleration = () => {
        const steering = new p5.Vector(0, 0);
        if (boidsSettings.enableWrapEdges) {
            if (this.pos.x < 0) {
                this.pos.x = width;
            }
            if (this.pos.x > width) {
                this.pos.x = 0;
            }
            if (this.pos.y < 0) {
                this.pos.y = height;
            }
            if (this.pos.y > height) {
                this.pos.y = 0;
            }
            return steering;
        }

        const maxPullbackAcc = 100;
        if (this.pos.x < boidsSettings.BORDER_LIMIT) {
            this.vel.x = abs(this.vel.x);
        }
        if (this.pos.x > width - boidsSettings.BORDER_LIMIT) {
            this.vel.x = -abs(this.vel.x);
        }
        if (this.pos.y < boidsSettings.BORDER_LIMIT) {
            this.vel.y = abs(this.vel.y);
        }
        if (this.pos.y > height - boidsSettings.BORDER_LIMIT) {
            this.vel.y = -abs(this.vel.y);
        }
        return steering;
    };

    // Compute steering force towards the mouse
    this.getMouseAcceleration = () => {
        if (!boidsSettings.enableFollowMouse) {
            return;
        }

        if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
            return;
        }

        const mouse = new p5.Vector(mouseX, mouseY);
        const mouseSteer = mouse.sub(this.pos);
        mouseSteer.setMag(boidsSettings.TARGET_ACC_INTENSITY);
        return mouseSteer;
    };

    // Compute steering force towards the same direction as the local flock
    this.getAlignmentAcceleration = () => {
        if (!boidsSettings.enableAlignment) {
            return;
        }

        const alignmentSteer = new p5.Vector(0, 0);
        this.alignmentFriends.forEach((id) => {
            if (id === this.id) {
                return;
            }
            const acc = birds[id].acc;
            alignmentSteer.add(acc);
        });

        if (this.alignmentFriends.length > 1) {
            alignmentSteer.div(this.alignmentFriends.length);
            alignmentSteer.setMag(boidsSettings.ALIGNMENT_ACC_INTENSITY);
            alignmentSteer.sub(this.vel);
            alignmentSteer.limit(boidsSettings.MAX_ACC);
        }
        return alignmentSteer;
    };

    // Compute steering force away from neighbors
    this.getSeparationAcceleration = () => {
        if (!boidsSettings.enableSeparation) {
            return;
        }

        const separationSteer = new p5.Vector(0, 0);
        this.separationFriends.forEach((id) => {
            if (id === this.id) {
                return;
            }
            const pos = birds[id].pos;
            const acc = this.pos.copy().sub(pos);
            const d = dist(this.pos.x, this.pos.y, pos.x, pos.y);
            // acc.normalize();
            acc.div(d);

            // const acc = pos.copy().sub(this.pos);
            // acc.rotate((Math.random() > 0.5 ? 1 : -1) * radians(20));
            separationSteer.add(acc);
        });
        separationSteer.setMag(boidsSettings.SEPARATION_ACC_INTENSITY);
        return separationSteer;
    };

    // Compute steering force towards local center of mass
    this.getCohesionAcceleration = () => {
        if (!boidsSettings.enableCohesion) {
            return;
        }

        const cohesionSteer = new p5.Vector(0, 0);
        this.cohesionFriends.forEach((id) => {
            if (id === this.id) {
                return;
            }
            const pos = birds[id].pos;
            const steer = pos.copy().sub(this.pos);
            cohesionSteer.add(steer);
        });

        if (this.cohesionFriends.length > 1) {
            cohesionSteer.div(this.cohesionFriends.length);
            cohesionSteer.setMag(boidsSettings.COHESION_ACC_INTENSITY);
            cohesionSteer.limit(boidsSettings.MAX_ACC);
        }
        return cohesionSteer;
    };

    // Compute steering in a random position
    this.getWiggleAcceleration = () => {
        if (!boidsSettings.enableWiggle) {
            return;
        }

        // const maxAngleRad = radians(boidsSettings.MAX_WIGGLE_ANGLE);
        // const wiggleAngle = map(random(), 0, 1, -maxAngleRad, maxAngleRad);
        // const wiggleSteer = this.vel.copy().rotate(wiggleAngle);
        const wiggleSteer = this.vel.copy();
        wiggleSteer.setMag(boidsSettings.WIGGLE_ACC_INTENSITY);
        return wiggleSteer;
    };

    // Compute steering towards the target object
    this.getTargetAcceleration = () => {
        if (!boidsSettings.enableFollowTarget) {
            return;
        }
        const distance = p5.Vector.dist(this.pos, target.pos);
        if (distance > boidsSettings.TARGET_RADIUS) {
            return;
        }
        const targetSteer = target.pos.copy().sub(this.pos);
        targetSteer.setMag(boidsSettings.TARGET_ACC_INTENSITY);
        return targetSteer;
    };

    // Compute steering rejecting from obstacles
    this.getObstaclesAvoidingAcceleration = () => {
        const obstacleSteer = new p5.Vector(0, 0);

        this.nearObstacles.forEach((id) => {
            const o = obstacles[id];
            const steer = p5.Vector.sub(this.pos, o.pos);
            obstacleSteer.add(steer);
        });

        obstacleSteer.setMag(boidsSettings.OBSTACLE_ACC_INTENSITY);
        return obstacleSteer;
    };

    // Compute steering rejecting from obstacles
    this.getPredatorsAvoidingAcceleration = () => {
        const predatorSteer = new p5.Vector(0, 0);

        this.nearPredators.forEach((id) => {
            const o = predators[id];
            const steer = p5.Vector.sub(this.pos, o.pos);
            predatorSteer.add(steer);
        });

        predatorSteer.setMag(boidsSettings.PREDATOR_ACC_INTENSITY);
        return predatorSteer;
    };

    this.computeMove = () => {
        this.updateFriends();

        const forcesToApply = [
            this.getBorderAvoidingAcceleration(),
            this.getWiggleAcceleration(),
            this.getMouseAcceleration(),
            this.getTargetAcceleration(),
            this.getAlignmentAcceleration(),
            this.getSeparationAcceleration(),
            this.getCohesionAcceleration(),
            this.getObstaclesAvoidingAcceleration(),
            this.getPredatorsAvoidingAcceleration()
        ];

        const netAcceleration = new p5.Vector(0, 0);
        forcesToApply.forEach((f) => {
            if (f) {
                netAcceleration.add(f.limit(2));
            }
        });
        this.nextAcc = netAcceleration;
    };

    this.move = () => {
        // Reset the acceleration after moving to avoid stacking forces of each iteration
        this.acc.mult(0);
        this.acc = this.nextAcc;
        this.vel.add(this.acc);
        this.vel.limit(boidsSettings.MAX_SPEED);
        this.pos.add(this.vel);
    };

    this.show = () => {
        const angle = ORD.angleBetween(this.vel);
        noStroke();
        push();
        translate(this.pos.x, this.pos.y);
        noFill();

        if (this.id === birds[0].id) {
            birds.forEach((b) => {
                b.marked = false;
                b.color = null;
            });
            if (boidsSettings.enableShowPerception) {
                if (boidsSettings.enableAlignment) {
                    this.alignmentFriends.forEach((id) => {
                        birds[id].marked = true;
                        birds[id].color = 'rgba(100,255,100,0.5)';
                    });
                    strokeWeight(3);
                    stroke('rgba(100,255,100,0.5)');
                    circle(0, 0, boidsSettings.ALIGNMENT_FRIENDS_RADIUS * 2);
                }
                if (boidsSettings.enableSeparation) {
                    this.separationFriends.forEach((id) => {
                        birds[id].marked = true;
                        birds[id].color = 'rgba(255,100,100,0.5)';
                    });
                    strokeWeight(2);
                    stroke('rgba(255,100,100,0.5)');
                    circle(0, 0, boidsSettings.SEPARATION_FRIENDS_RADIUS * 2);
                }
                if (boidsSettings.enableCohesion) {
                    this.cohesionFriends.forEach((id) => {
                        birds[id].marked = true;
                        birds[id].color = 'rgba(100,100,255,0.5)';
                    });
                    strokeWeight(1);
                    stroke('rgba(100,100,255,0.5)');
                    circle(0, 0, boidsSettings.COHESION_FRIENDS_RADIUS * 2);
                }
            }
        }

        noStroke();
        fill(255);
        if (this.marked) {
            fill('red');
            if (this.color) {
                fill(this.color);
            }
        }
        if (this.id === birds[0].id && boidsSettings.enableShowPerception) {
            strokeWeight(2);

            const velocityScreenMag = map(this.vel.mag(), 0, boidsSettings.MAX_SPEED, this.r, this.r * 5);
            const velocityLine = this.vel.copy().setMag(velocityScreenMag);
            stroke('yellow');
            line(0, 0, velocityLine.x, velocityLine.y);

            const accelerationScreenMag = map(this.acc.mag(), 0, boidsSettings.MAX_ACC, this.r, this.r * 2);
            const accelerationLine = this.acc.copy().setMag(accelerationScreenMag);
            stroke('red');
            line(
                velocityLine.x,
                velocityLine.y,
                velocityLine.x + accelerationLine.x,
                velocityLine.y + accelerationLine.y
            );

            const fovScreenMag = Math.max(
                boidsSettings.enableAlignment ? boidsSettings.ALIGNMENT_FRIENDS_RADIUS : 0,
                boidsSettings.enableSeparation ? boidsSettings.SEPARATION_FRIENDS_RADIUS : 0,
                boidsSettings.enableCohesion ? boidsSettings.COHESION_FRIENDS_RADIUS : 0
            );
            const fovLeftLine = this.vel
                .copy()
                .rotate(radians(boidsSettings.MAX_WIGGLE_ANGLE / 2))
                .setMag(fovScreenMag);
            const fovRightLine = this.vel
                .copy()
                .rotate(-radians(boidsSettings.MAX_WIGGLE_ANGLE / 2))
                .setMag(fovScreenMag);
            stroke('orange');
            line(0, 0, fovLeftLine.x, fovLeftLine.y);
            line(0, 0, fovRightLine.x, fovRightLine.y);

            noStroke();
            fill('orange');
        }
        rotate(angle);
        if (boidsSettings.enableRoundShape) {
            ellipse(0, 0, this.r / 2);
        } else {
            triangle(0, this.r, -this.r / 3, 0, this.r / 3, 0);
        }
        pop();
    };
}
