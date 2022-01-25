---
layout: layouts/note.njk
tags: ['linux', 'keyboard', 'xset']
title: Keyboard input speed on Linux
---

Make the delay between Key presses shorted on Linux

- First parameter is the delay before the auto repeat starts
- The second is the time between two auto repeats
```bash
xset r rate 150 50
```
