---
layout: layouts/post.njk
tags: ['post', 'zoom']
date: 2022-07-15
title: Programmatically update Zoom's virtual background
commentIssueId: 34
---

Recently I created a script which automatically downloads [NASA's Astronomy Picture of the Day](https://apod.nasa.gov/apod/) and sets it as the wallpaper of my computer. This was fun but I also wanted to set the picture as my virtual background in Zoom so that ~~I have another pretext to bore my coworkers with space stuff~~ my teammates could also enjoy the cool astronomy pictures of the Nasa.

The issue was that when I dug into Zoom's documentation I couldn't find a reliable way to change my own virtual background without using the GUI. So I went with a hacky solution which seems to work well for my use case.

The solution is not perfect and I only tested it for my particular use case, but the result makes me happy so here it is:

---

When I couldn't find in the different SDKs and APIs offered by zoom a way to change the user's virtual background I first thought that I was missing something and decided to check the [Zoom apps marketplace](https://marketplace.zoom.us/search?q=background) looking for apps which would already do what I want.

It turned out the only relevant apps I could find were ones which add new Virtual Background to the ones available in the app but never set a background for the user.

That meant that I had to find a different way, a hacky way 😈

On Linux, Zoom stores its data in `$HOME/.zoom/data/` and in this directory there is a subdirectory named `VirtualBkgnd_Custom` which is quite interesting.

When the user sets a virtual background the image is actually copied to this directory and renamed with a random uuid.

The interesting thing is that Zoom doesn't do any validation or caching of any kind: You can just replace this image, restart the app and _voila_ the virtual background has been changed.

```bash
cp myNewBackground.jpg $HOME/.zoom/data/VirtualBkgnd_Custom/{d04bd4b9-57d8-44a1-9cd7-31cea7945157}
```

So with a chunk of javascript and a tiny bit of shell I made [this repo](https://github.com/statox/NWotD): A nodeJS program which downloads the picture and changes the wallpaper and the zoom background added to a cron table and the job is done. I took some shortcuts which probably make the tool only work on my machine, but maybe I'll make it more robust one day when I get a new computer or reinstall my system.
