---
layout: layouts/post.njk
tags: ['post', 'p5', 'maze']
date: 2020-03-03
commentIssueId: 6
title: Generating a maze... and then solving it
---

Quick, no time to explain! Have a look at how a computer goes out of a maze [in the demo](https://statox.github.io/p5-maze/)!

And check out [Github](https://github.com/statox/p5-maze/) if you want to see the code.

### Getting out of the maze

Solving mazes is not a new topic, every computer science student heard about this topic at least once during their studies and most of them tried to implement a maze solver one way or another. However seeing a computer getting out of a maze is always a source of wonder and excitement to me. I know there is nothing magical in these maze solving algorithms but seeing them getting executed has always been some kind of a kink to me.

So last time I had a bit of free time I decided to make my own maze solver! It's nothing fancy: I'm not inventing a new algorithm nor am I looking for something extremely fast but I wanted it to be fun to watch.

So [here is](https://statox.github.io/p5-maze/) what I came up with.

### Run and fight

I had two main goals in this project:

- Being able to visualize different algorithms solving the same maze at the same time. This would be what I call an AI fight.
- Being able to generate a maze. Firstly because without a maze it's useless to have a solver, but also because I wanted to compare different ways to generate a maze.

So I used p5.js again to create a grid of cells and destroy the walls between them to create ways. The web application allows to choose the classical backtracking solution as well as a recursive divisor generator. This is not fancy but this works.

However, doing some researched I also discovered that some cellular automata generate patterns looking like a maze, namely CA `B3/S12345` and `B3/S1234` (meaning a cell is born if it has exactly 3 alive neighbors and it survives it is has respectively 1,2,3,4 or 5 and 1,2,3 or 4 alive neighbors). The web app also allows to select this generators and even though I had to cheat a bit (sometimes some walls need to be broken to have a valid maze) it was quite exciting to see CAs applied on mazes!

About the solvers so far I implemented four of them:

- The depth first search and breadth first search algorithms: Classical and not really surprising.
- The wall follower: This one is the less efficient of all but, given there is not island in a maze it will always find the exit. This one is cool because it can easily be applied in the real world.
- The Euristic approach: This one is based on a very smart euristic I chose myself and which can be summed up like this: Between the four next possible cells, choose the one the closest to the exit. To my surprise it works reasonably well but I suspect this is because my mazes are not complex enough.
