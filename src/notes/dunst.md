---
layout: layouts/note.njk
tags: ['note', 'dunst', 'dunstctl', 'notification']
title: Dunst
---

The [Arch wiki article](https://wiki.archlinux.org/title/Dunst) says it all.

### Test notification

With `notify-send` (works with all notification daemons):

    notify-send 'Test notification'
    notify-send -u low|normal|critical 'Notification with urgency'

With `dunstify` (dunst tool working only with dunst):

    dunstify -h string:x-dunst-stack-tag:test Test -A 'tested,default'
    dunstify -h string:x-dunst-stack-tag:test Testing
