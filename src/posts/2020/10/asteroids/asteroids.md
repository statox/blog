---
layout: layouts/post.njk
tags: ['post', 'p5']
date: 2020-10-25
commentIssueId: 15
title: Asteroids... with real pew pews
---

Asteroids! The game is as old as the world (well almost, it was [released in 1979](<https://en.wikipedia.org/wiki/Asteroids_(video_game)>)) and is an iconic figure of the golden era of the video game.

![Original asteroids screenshot](https://upload.wikimedia.org/wikipedia/en/1/13/Asteroi1.png)

Over a lazy Sunday I decided to implement my own version because why not? And, to make it more fun, my girlfriend gave me the idea to make the sound effects myself, idea that I really liked!

So after a few hours of code and some really crappy recording on my phone [here is what I came up with](https://asteroides.statox.fr/?utm_campaign=blog).

![My own asteroids version screenshot](./asteroids.png)

No technological innovation or mind blowing creativity here but the result still amuses me more than I would be willing to admit. I feel like I am re-discovering the early 2000's flash games and that's fun!

To make it a complete game I still implemented some bonuses, like the autopews and the triple pew which allow respectively to continuously shoot at the asteroids and to shoot in 3 directions, as well as some maluses like slowing down the spaceship rotation speed or locking its engine on to force the player to get good at slaloming between the rocks at full speed. I also used my own noise function (actually a wrapper around p5js's `noise()` function) to generate random rocks which _kinda_ look like asteroids.

But let's be real despite all these amazing features the main interest of the game is hearing my dumb "pew pew" and "boum" for five minutes before it gets annoying.

The game is playable online [on this page](https://asteroides.statox.fr/?utm_campaign=blog) but it doesn't support mobile browsers (since it's played with the keyboard) and runs terribly slowly in some version of Firefox (because of a privacy setting which doesn't play well with p5js).
