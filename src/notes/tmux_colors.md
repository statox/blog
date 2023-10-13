---
layout: layouts/note.njk
tags: ['note', 'tmux', 'colors']
title: Tmux list all 256 colors
---

```bash
for i in {0..255}; do
    printf "\x1b[38;5;${i}mcolour${i}\x1b[0m\n"
done
```
