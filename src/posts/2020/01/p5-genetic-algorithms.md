---
layout: layouts/post.njk
tags: ['post', 'p5', 'algorithms']
date: 2020-01-23
commentIssueId: 5
title: Genetic algorithms or how I made a bunch of smart robots
---

If you want to see a bunch of robots blindly running toward a black dot, here is [the demo](https://statox.github.io/p5-genetics/).

And [the code](https://github.com/statox/p5-genetics) is on Github, it's not beautiful but it's free. Now let's see what I did here.

### Teaching a machine to do stuff

Once of the funniest things to do with a computer or a piece of hardware and is to make it smart. This has been humankind obsession for many decades now and it's not going to stop anytime soon. Of course there are tons of way to make a piece of silicon smart, but for this project I wanted to explore a very simple category of machine learning algorithms: _The genetic algorithms_.

Basically the way genetic algorithms works is the following: You take a bunch of things that you want to make smart, you make them accomplish a task in a random way and you score each of them depending on how well they succeeded at the task. Once they are all done you eliminate the worst ones and you keep the ones which did best. You will then slightly change the remaining ones and make them run the task again. The theory says that your new generation of things should do a bit better than the previous generation. Rinse, repeat and boom after a few generation you have a bunch of things pretty good at doing this one thing you asked them to do.

I love the idea of these algorithms because it is quite simple to understand and not too hard to implement, which are two important criteria for my side projects. So here I am setting a new p5.js project! My goal here is simple: I want to have a robot learning how to get to a point in a 2D space and I want to be able to manipulate the algorithms parameters easily to better understand how it works.

### I want to make a smart robot

So first thing first, I need to create a robot... Here I will make the simplest robot ever: it will be _a square_! All it needs is a position (i.e. a 2 dimensional vector) and a way to change this position. Here is the time to introduce the concept of genes:

I am creating a genetic algorithm, so it makes sense that at some point some genes are involved, right? Here the genes of a robot will be the pattern it will follow: This is actually a succession of order saying "Go up" or "Go left" or basically "Move of one position in one of the two dimensions of your plan". Every robot will be created with an array of genes and its life will be devoted to following these instructions.

My robot will also use some additional properties. I will store its initial position, its size (as a radius, even though it is shown as a square... Mostly because I started with round robots and decided it was simpler to have them squared afterwards) and its lifespan which could be handled differently (e.g. using the size of the genes array) but this way is more convenient for what I want to do next.

So here is my simple robot:

```js
function Robot(x, y, r, lifespan) {
    this.initX = x;
    this.initY = y;
    this.pos = new p5.Vector();

    this.lifespan = lifespan;
    this.r = ROBOT_SIZE;

    this.genes = new Genes(this.lifespan);
}

Robot.prototype.show = function () {
    if (this.crashed) {
        fill(200, 0, 0);
    } else if (this.foundTarget) {
        fill(0, 200, 0);
    } else {
        fill(0, 0, 200);
    }
    rect(this.pos.x, this.pos.y, this.r, this.r);
};
```

Let's notice that it changes its color depending on if it crashed (i.e touched the border of the frame) or if it reached the target. These calculations are made when the robot moves.

### Actually, _a bunch_ of smart robots

So having a robot and making it move is good but to create a genetic algorithm I need to use more bots. So I will need to create a crowd of robots all starting at the same position but all with different genes (and that makes each robot unique and beautiful, just like you 🤗):

```js
function Crowd(size) {
    this.robots = [];
    this.matingPool = [];
    this.size = size;
    for (var i = 0; i < size; i++) {
        this.robots.push(new Robot(W / 2, L / 2, ROBOT_SIZE, LIFESPAN));
    }
}
```

This crowd is the hearth of our algorithm: During a generation each robot will move independently, once they reach their lifespan the crow will inspect all of the bots, check if they reached the target and if they didn't how far they were from the target or if they crashed against a wall.

Based on this information it is then possible to rank the robots: The one which crashed will be removed and the other ones will be more advantages the closer they got to the target. To do this the crowd has a mating pool which is reset for each generation: Each robot is then added to the pool a number of times proportional to its efficiency.

This is great because that will allow me to right a simple function to create the new generation of robots:

```js
Crowd.prototype.evolve = function () {
    for (robot of this.robots) {
        robot.reset();

        var parentA = random(this.matingPool);
        var parentB = random(this.matingPool);
        var child = parentA.merge(parentB);

        robot.genes.moves = child;
        robot.genes.mutate();
    }
};
```

For each robot we will take randomly two parents in the mating pool (which favored the efficient robots of the previous generation) and merge their genes which simply mean here that we merge the first half of one parent's genes with the second half of the other parent's genes. This could have been done in a lot of different ways like take every other genes of the parents or taking them randomly.

And then come the magical random touch: `robot.genes.mutate()` will move a few genes of this new robot, this way some will get better and some worst and the natural selection will do its job on the next generation:

```js
Genes.prototype.mutate = function () {
    var mutationCnt = 0;
    for (var i = 0; i < this.moves.length; i++) {
        if (random() < MUTATION_RATE / 100) {
            mutationCnt++;
            this.moves[i] = this.generateNewMove();
        }
    }
};
```

### And now let's them to their job

Now that I have all the important components of the algorithm I can generate a crowd and a target, wait for the robots to become more and more efficient at reaching their target and finally move the target and watch them learn everything again.

And to please my inner [/r/dataisbeautiful](http://reddit.com/r/dataisbeautiful) fan I also added a few graphs to better visualize the efficiency.
