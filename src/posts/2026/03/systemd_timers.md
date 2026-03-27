---
layout: layouts/post.njk
tags: ['post', 'linux', 'systemd', 'cron']
date: 2026-03-27
title: Using a systemd timer to monitor my laptop's battery
commentIssueId: 40
---

I've been using [i3](https://i3wm.org/) as my window manager for the past 7 years. It's great and you should check it out! However, one issue I have is that by default I don't get an obvious notification when my battery is low. My personal laptop is getting old and the battery significantly drains when it is put to sleep. So recently it happened several times that I woke it up, didn't check my battery, and had it die a few minutes later because it was on super low battery.

So I created a simple bash script which checks the battery level and uses [`notify-send`](https://man.archlinux.org/man/notify-send.1.en) to display a desktop notification to remind me to charge the computer. The question was how to run it:

- I wanted to run it at startup and then every 5 minutes
- I wanted that to be easily configurable from [my dotfiles](https://github.com/statox/dotfiles)
- I didn't want to use cron because setting cron automatically is always a bit wacky:
    - I don't like the scheduling syntax
    - I don't like the fact that I can't just put a `crontab` file somewhere in my `~/.config` and have cron pick it up
    - Debugging is not always straightforward, I have to handle redirection to a log file, add `echo` to my scripts to log start and stop time
    - ...

So I finally looked into `systemd` timers, which I've been meaning to do for a long time but I was worried it would add too much complexity to my dotfiles system.

I was wrong.

---

## The solution

To set up a systemd service at the user level you need 2 files:

1. `monitor_battery.service` which defines _how_ the service runs, that's not much more than pointing to the path of the script (Here `~/.bin/monitor-battery`):

```systemd
[Unit]
Description=Low battery popup notification

[Service]
Type=oneshot
ExecStart=%h/.bin/monitor-battery

# notify-send requires a running D-Bus session

Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/%U/bus
```

2. `monitor_battery.timer` which defines _when_ the service runs, here 1 minute after boot and then every 5 minutes after that:

```systemd
[Unit]
Description=Check battery level every 5 minutes

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

After putting these files in `~/.config/systemd/` I just have to run 2 commands once to enable and start the service:

```bash
systemctl --user enable --now monitor_battery.timer
systemctl --user start monitor_battery.timer
```

As they are idempotent I can just add them to [the script](https://github.com/statox/dotfiles/blob/07cc94ccc3cd6242bde5f9b1fbeffb9be760a7c1/scripts/set-dotfiles.sh#L70-L74) which sets up my dotfiles (which I run once in a while when I change my configs) and that's it!

## Result

The good part is that now this script is managed like a regular `systemd` unit. So

1. I can use `systemctl` to start, stop, check the status of the service
2. Handling the logs is super easy:
    - I don't have to handle inconvenient shell redirections in my crontab (stuff like `>> /var/log/monitor.log 2>&1`)
    - Every `echo` in my script is sent to the logs automatically
    - By default `systemd` logs the startup and end times of the script so I don't need to pollute my script with additional logging
    - I can use `journalctl --user -u monitor_battery.service` to access the logs without having to find back the log file

    ```
    Mar 27 11:42:05 hostname systemd[3972]: Starting monitor_battery.service - Low battery popup notification...
    Mar 27 11:42:05 hostname monitor-battery[93724]: Fri Mar 27 11:42:05 AM CET 2026 level='95' status='Discharging' alerted='0'
    Mar 27 11:42:05 hostname systemd[3972]: Finished monitor_battery.service - Low battery popup notification.
    Mar 27 11:47:16 hostname systemd[3972]: Starting monitor_battery.service - Low battery popup notification...
    Mar 27 11:47:16 hostname monitor-battery[97345]: Fri Mar 27 11:47:16 AM CET 2026 level='94' status='Discharging' alerted='0'
    Mar 27 11:47:16 hostname systemd[3972]: Finished monitor_battery.service - Low battery popup notification.
    ```

    _Note how I should remove the `echo "$(date) ...` from the `monitor-battery` script to avoid duplicating the date_

Moralité: Tailoring your tools to your needs is a good way to learn new stuff!

## Resources

- The [`monitor-battery`](https://github.com/statox/dotfiles/blob/07cc94ccc3cd6242bde5f9b1fbeffb9be760a7c1/bin/monitor-battery) script on Github
- A [StackExchange question](https://unix.stackexchange.com/questions/278564/cron-vs-systemd-timers) "Cron vs. Systemd timers"
- The Arch wiki page about [Systemd timers](https://wiki.archlinux.org/title/Systemd/Timers) and in particular its section [As a cron replacement](https://wiki.archlinux.org/title/Systemd/Timers#As_a_cron_replacement)
