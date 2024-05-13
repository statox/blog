---
layout: layouts/post.njk
tags: ['post', 'p5', 'board game']
date: 2021-01-21
title: 'Winter holidays unfinished projects (2/2) - Reversi'
commentIssueId: 18
---

### Board games are fun!

After not finishing my [triomino project](../triomino/) I started working on an implementation of the [Reversi game](https://en.wikipedia.org/wiki/Reversi). According to Wikipedia my implementation is technically an Othello game but this name was patented in Japan in 1971 and I decided to play it safe and calling it Reversi (no doubt that the owner of the name would have felt greatly threatened by my _amazing_ implementation of his game).

![Screenshot of my Reversi implementation](./reversi.png)

<center>
    <i>My patent infrigement material</i>
</center>

Despite not being finished I really loved doing this project because it was the first time I used typescript instead of javascript for a personal project. I am well used to typescript on the backend since it's the language I use daily in my job at Dashlane but I had never took the time to add the tooling to use it in my frontend side projects. This is now done and with no surprise it greatly helped me to get quick results.

#### A new dumb AI

The rules being pretty simple and the grid a traditional square, implementing the game wasn't the most interesting part of this project. Implementing the AI however was pretty fun. At first I went with the most basic method possible: The Great Random!

Once all the tooling is in place to spot the playable cells on the grid, implementing an AI which chose one spot randomly is pretty straight forward. It then quickly evolved to a slightly less dumb AI which choose the spot where it will turn the most possible disks.

With these AI implemented I spent a bit of time to add a "hint" button which uses the AI to play for the player and an "autoplay" button which makes the AI play the whole game for the player. Watching my programmed piece of silicon playing against itself amuse me to no end and I can stay hours watching it tirelessly placing disks on the board (Ok, not hours but at least five good minutes).

#### A refresher on MinMax algorithm

After creating my basic AIs I went one step further and implemented a new one with the [minmax algorithm](https://en.wikipedia.org/wiki/Minimax). I had already implemented one on a student project for a tic-tac-toe game and I wanted to do that on something more complex ever since, that was a great opportunity.

Although the algorithm itself isn't really groundbreaking I got to learn something pretty interesting during its implementation: I got pretty quickly a first working version but I quickly realized that my implementation had a memory leak, after a few turns the memory usage of the page would grow up and never go down. I spent two days debugging my code in a lot of different ways, trying to use the Chrome debugging tools to inspect memory snapshots.

I quickly understood that my issue was that my `Board` objects were not garbage collected: To create the different nodes of the algorithm I copy the `Board` object holding the current state of the game, add a new disk, turn the other disks accordingly and iterate on these new boards. These `Board` object hold an array of `Cells` representing the different spots and the disks played on them. As my boards were not garbage collected I suspected that when I was done using them I didn't released the references to these cells and so I spent hours trying different things to make sure that all the child references were deleted.

After a couple of days of debugging, a copious amount of absolutely useless changes, the reading of numerous articles about javascript memory leaks and some tears of blood I decided to just let it go and switch to another project. That the moment where, in my shower, I had an epiphany: Two days before I had read a list of tips about javascript memory leaks and one of them was "Be cautious with your `setTimeout` they create global references and that's no good" which I had immediately dismissed since I always try to be cautious about my `setTimeout`... Except I hadn't :🤦

My `Board` objects have a `lastPlayed` property which is used by the GUI to show the user which disk they have placed last. And being an amazing UX designer I thought it would be nice to highlight this cell and stop highlighting it after a few seconds... Sure enough I had used a `setTimeout` to do that and each time the AI placed a disk on a Board it created this timeout, preventing the garbage collector to get rid of the board. After getting rid of that my algorithm worked like a charm... Almost.

It turns out that for a game of Othello there are a lot of different possibilities so I couldn't run my MinMax with a depth greater than 3 to keep the execution time under a few seconds. That was something I had anticipated and that lead me to implementing an Alpha Beta pruning algorithm to improve the performances. Unfortunately, this kind of algorithm requires a heuristic function in addition of the evaluation function used by MinMax. That's when I stopped working on this project, I have quite a good idea of the different heuristic I want to create (mainly thanks to a great research paper I can't find back at the time of this writing) but I'll have to spend more time on this project and I'm not sure when that will happen.

#### Comparing the IA

While I was implementing my different AIs I needed to compare them together to make sure I was heading in the right direction, so in addition of the GUI I also developed a testing program which runs thousands of games and collects some simple statistics. Here are some results:

| Random vs. Random | win percentages | nb of games won |
| :---------------- | --------------: | --------------: |
| Random            |          49.11% |            4911 |
| Random            |          50.89% |            5089 |

| Random vs. Most disks | win percentages | nb of games won |
| :-------------------- | --------------: | --------------: |
| Random                |          42.82% |            4282 |
| Most disks            |          57.18% |            5718 |

| Random vs. MinMax (depth 3) | win percentages | nb of games won | avg. nodes evaluated by turn |
| :-------------------------- | --------------: | --------------: | ---------------------------: |
| Random                      |          26.55% |             478 |                            - |
| MinMax                      |          73.44% |            1322 |                   12 179 319 |

| Random vs. AlphaBeta (depth 3) | win percentages | nb of games won | avg. nodes evaluated by turn |
| :----------------------------- | --------------: | --------------: | ---------------------------: |
| Random                         |          35.33% |            1590 |                            - |
| AlphaBeta                      |          64.66% |            2910 |                    2 785 672 |

Nothing really surprising here but at least the results seem to be pretty coherent with what I was expecting:

-   When two player play randomly they roughly have a 50% rate of victory, at least `Math.random()` seems to be working good enough for this use case
-   Trying to always flip as many disks as possible is a bit more efficient than playing randomly, at least if your opponent plays randomly.
-   My MinMax implementation is pretty effective against a random user, increasing the maximal depth would make it pretty good. However given the time it takes to run I couldn't run as many games as for the other AIs.
-   My AlphaBeta pruning without a good heuristic is just a semi-broken MinMax: it's better than a random player but it prunes some valid nodes which makes it not as efficient as it could be.

#### Demo

I am really pleased with this project because it was a nice opportunity to get back to a bit of game theory and some decision algorithm which I really enjoy playing with. Also it was pretty cool to finally add Typescript to my toolbox for side projects and I'm looking forward to continue using it in my next coding adventure.

As usual the demo is hosted [on Github pages](https://statox.github.io/reversi/) and the code is [right next to it](https://github.com/statox/reversi).
