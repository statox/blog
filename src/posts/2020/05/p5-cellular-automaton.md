---
layout: layouts/post.njk
tags: ['post', 'p5', 'cellular automaton']
date: 2020-05-13
commentIssueId: 7
title: 'Cellular automata - Digital life and death'
---

This has been one of my most satisfying project recently so if you want to see cool visualisations of digital life the demo is live [here](https://statox.github.io/p5-cellular-automaton/).

The code of this project is [on Github](https://github.com/statox/p5-cellular-automaton), now let me tell you what this is about.

### Cellular automata are cool!

Despite the fact that I never remember which spelling is singular or plural (`automaton`? `automata`? `automat[a|on]s`??) these mathematical concepts have been fascinating me for a long time.

The principle of a cellular automaton (CA) is quite simple:

- Create a grid representing some cells;
- The cells can either be dead or alive;
- With each iteration the cells either stay in the same state or change state depending on a set of rules.

This is incredibly cool because given a few simple rules and some random inputs these objects can create surprising and sometimes counter intuitive patterns.
The first CA I heard about was John Conway's game of life and it was something like 8 years ago. Since then I have found myself reimplementing a version of this CA every once in a while.

When I heard that John Conway passed away in 2020 I decided to create a tribute to his work, once again.

### So I built this

For this implementation I had a few things in mind which really mattered to me:

- First I wanted it to be executable in a browser. Mainly because I need to practice a bit my web development but also because it is easier to share my lovely shiny new project with people.
- I wanted to use [p5.js](https://p5js.org/), an implementation of Processing in the browser which makes it super easy to create cool visuals in a web page.
- I wanted to be able to customize the behavior of the CA very easily.
- I wanted to have a result quickly and be able to iterate on that _(otherwise I get bored and never finish my side projects, which is probably the main issue for developers and side projects)_

So I made [this little web application](https://statox.github.io/p5-cellular-automaton/) hosted on github pages and using p5.js, bootstrap and some vanilla javascript.

By default the app will start on a simple Game of Life CA, but in the settings the user can play with different parameters like the size of the grid, the initial density of the alive cells and more interestingly the rules used to decide of the next state of cells.

### And it's fun to play with

I found a few interesting presets which can be used to create new CA and see cool patterns emerging.

When I have time I'll add some pictures here... And maybe a technical write up about how it was done!
