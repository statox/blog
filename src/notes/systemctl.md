---
layout: layouts/note.njk
tags: ['note', 'systemd', 'systemctl']
title: Systemctl & systemd cheatsheet
---

I always get confused in the syntax between `systemctl` and `service` commands. To be updated with the missing ones next time I one them.

### List services

```bash
systemctl list-units
systemctl list-units --type=service --state=running
systemctl list-units --type=service --state=failed
```

### Service status

```bash
systemctl status sshd
```

### Service action

```bash
systemctl restart sshd
```
