---
layout: layouts/note.njk
tags: ['linux', 'keyboard', 'autokey']
title: Remap <alt>+hjkl to arrow keys on Linux
---

One way to have <kbd>alt</kbd><kbd>h</kbd>, <kbd>alt</kbd><kbd>j</kbd>, <kbd>alt</kbd><kbd>k</kbd>, <kbd>alt</kbd><kbd>l</kbd> mapped to <kbd>⬅</kbd>, <kbd>⬆</kbd>, <kbd>⬇</kbd>, <kbd>➡</kbd> is to use [autokey](https://github.com/autokey/autokey).

_⚠ Note that autokey is an X11 app that will not work with Wayland ⚠_

On Ubuntu 21.04 one can install autokey from the repos with `sudo apt install autokey-gtk`.

In autokey one can create four different scripts with the following content:

```python
# script arrow_left
keyboard.send_keys("<left>")

# script arrow_right
keyboard.send_keys("<right>")

# script arrow_up
keyboard.send_keys("<up>")

# script arrow_down
keyboard.send_keys("<down>")
```

Then on each script set a hotkey (The "Press to set" feature is useful to set combinations like <kbd>alt</kbd><kbd>h</kbd>):

![Setting a hotkey](../../images/notes/keyboard_remap_arrow_keys/autokey_set_hotkey.png)
