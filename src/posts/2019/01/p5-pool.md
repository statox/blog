---
layout: layouts/post.njk
tags: ['post', 'p5', 'physic']
date: 2019-01-10
commentIssueId: 4
title: A pool game with my own physic engine
---

Go grab a beer and play the pool [in the demo](https://statox.github.io/p5-pool/)!

And if that's your thing you can see the code [on Github](https://github.com/statox/p5-pool).

### Pool, snooker, billiard?

I love to watch Daniel Shiffman's videos on Youtube, I can spend _hours_ binging his channel [The Coding Train](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) and it always gives me some inspiration for new projects.

This project was specifically inspired by his playlist [The Nature of Code](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6aFlwukCmDf0-1-uSR7mklK) where he shows how it is possible to simulate physical models with pretty simple javascript and a bit of math.

After watching some of the videos I decided that I was ready to try to do something on my own, and it was going to be a pool game! (Or a snooker, or a billiard, or whatever it is called... Basically a cue game).

### A simple simulation

What do I need to do that?

First of all I need a table and some balls rolling on it. This is pretty straightforward: a p5.js canvas will be my table, my balls are simple javascript objects with some coordinates, the ability to apply a force on it (i.e. incrementing the coordinates), a friction force to keep the ball from rolling forever and some tests to prevent the balls from falling out of the table.

```js
function Ball(x, y, id, color) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.r = 10;

    this.move = function () {
        // Add friction
        var coefficientOfFriction = 0.99;
        this.vel.mult(coefficientOfFriction);

        // Move the ball
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Check the limits
        if (this.pos.x - this.r < 0 || this.pos.x + this.r > W - this.r) {
            this.vel.x *= -coefficientOfFriction;
        }
        if (this.pos.y - this.r < 0 || this.pos.y + this.r > L - this.r) {
            this.vel.y *= -coefficientOfFriction;
        }
    };
}
```

Easy, right? With that I can apply a force to a ball (as it's velocity) and way for the force to shrink over time. As a bonus I used the boundaries check to simply reverse the velocity of the ball, this is a lazy simulation of a perfectly on elastic collision. In real life some energy would be dissipated with the rebound but here, it's good enough.

Let's add to that a simple function to know if a ball is colliding with another one. To do that we can simply check the distance between two balls is larger than the sum of the balls radius. I came up with something quick and dirty, but mostly dirty. Here I knew I wanted to tag all the balls part of a collision:

```js
this.isColliding = function (otherBall) {
    // Get the distance between the center of the two balls
    var dx = otherBall.pos.x - this.pos.x;
    var dy = otherBall.pos.y - this.pos.y;
    var distance = sqrt(dx * dx + dy * dy);

    // The balls touch if their distance is less than the sum of their radiuses
    var minDist = otherBall.r + this.r;
    if (distance < minDist) {
        this.collided = true;
        otherBall.collided = true;
        return true;
    }
    return false;
};
```

Having this code I was able to create my pool, put balls on it, apply a force on them and change their color when they hit each other. That is cool... But now what?

### A not so simple simulation

Well now is the time for the balls to bounce on each other when they touch!

And this is where the project became pretty fun because I didn't want to use a full blown physics engine, so I did mine... Well I did a function which bounced two circles against each other. The code of this function is [here on Github](https://github.com/statox/p5-pool/blob/54c4a280b4d90eb130f1c907b04f75f132f7ec93/Ball.js#L44-L115) (as well as the whole project). It uses some workarounds and still has some bugs (sometimes the balls teleport away from each others when they touch, sometimes they get crazy and go off the table) also it is not really elegant to read... But it works! (Kinda)
