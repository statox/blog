---
layout: layouts/note.njk
tags: ['todo', 'software', 'game']
date: 2022-07-12
title: Circular p5 jump
---

Goal: A new version of [p5-jump](https://www.statox.fr/posts/2020/09/p5-jump/) but in a circular track.

Ideas:

The track should be circular.
The player starts at an angle of 0 and the goal is to make as many full cycles as possible.
The progress detection could be:

- Start at angle 0
- On each frame check the current angle
    - If it's larger than the previous max value update it
    - If it's larger than 2 pi, add 1 turn to the counter and reset with the difference to zero
    - Make sure to handle <0 angle to avoid counting "reverse" turns

The obstacles could be generated either from the angle 0 or directly behind the player and starting in the opposite direction.

The player should be able to control forward/backward and jump

In a v2 it would be interesting to work on graphics: Using a sprite of a stick-person running and jumping, maybe animating the obstacles too.
