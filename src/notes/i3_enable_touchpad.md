---
layout: layouts/note.njk
tags: ['note', 'i3', 'touchpad']
title: Enable tap to click in i3 WM
---

[Cody Craven](https://cravencode.com/authors/cody-craven/) made [an excellent blogpost](https://cravencode.com/post/essentials/enable-tap-to-click-in-i3wm/) explaining very clearly how to enable tap to click on i3.

That worked perfectly on my Lenovo T490s with Ubuntu 21.10 and i3 4.20. The TL;DR is directly copied from Cody's post and I keep it here only because it will be easy for me to find it back.

The different available options are listed with [`man libinput`](# http://manpages.ubuntu.com/manpages/xenial/man4/libinput.4.html)

```bash
sudo mkdir -p /etc/X11/xorg.conf.d
sudo tee <<'EOF' /etc/X11/xorg.conf.d/90-touchpad.conf 1> /dev/null

Section "InputClass"
    Identifier "touchpad"
    MatchIsTouchpad "on"
    Driver "libinput"
    Option "Tapping" "on"
    Option "NaturalScrolling" "on"
    Option "ScrollMethod" "twofinger"
    Option "TappingDrag" "on"
    Option "TappingDragLock" "on"
    Option "DisableWhileTyping" "on"
EndSection
EOF
```
