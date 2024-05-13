---
layout: layouts/post.njk
tags: ['post', 'p5']
date: 2020-06-21
commentIssueId: 8
title: Circle packing algorithm (with kittens 🐱)
---

Inspired by a video by [Daniel Shiffman on YouTube](https://www.youtube.com/channel/UCvjgXvBlbQiydffZU7m1_aw) I decided to create a short little project involving circle packing and kittens.

Before reading my rambling go and watch the kitties [in the demo](https://statox.github.io/p5-circles/).

_Note that for a reason that I don't understand for now, the demo seems to be working only with chromium/chrome... Maybe I'll investigate that later on_

And if that was cute enough to make you want to see the code, [here you are](https://github.com/statox/p5-circles).

### What does it mean?

To quote [wiki](https://en.wikipedia.org/wiki/Circle_packing)

> In geometry, circle packing is the study of the arrangement of circles (of equal or varying sizes) on a given surface such that no overlapping occurs and so that no circle can be enlarged without creating an overlap.

And to quote [the same source](https://en.wikipedia.org/wiki/Kitten)

> A kitten is a juvenile cat. After being born, kittens display primary [altriciality](https://en.wikipedia.org/wiki/Altriciality) and are totally dependent on their mother for survival.

So for this project I wanted to use some really cute pictures and duplicate them with a bunch of non overlapping circles.

### Loading the pictures

Before packing circles on these cuties we first need to load the images in our p5.js sketch. To do so I created a `reset()` function which will be used each time I need a new image. It's goal is to get the color of each pixels on the image so that we can use the color later on:

```js
const IMAGES = ['data/kitten1.png', 'data/kitten2.jpg', 'data/kitten3.jpg'];

function reset() {
    // Stop calling draw() while we load the picture otherwise we break everything
    noLoop();

    // iterate through my image list
    imgIndex++;
    if (imgIndex >= IMAGES.length) {
        imgIndex = 0;
    }
    const path = IMAGES[imgIndex];

    // load the image and get the color for each of its pixels
    img = loadImage(path, (img) => {
        pixelDensity(1);
        circles = [];
        imgColors = [];

        img.loadPixels();
        let d = img.pixels.length;
        for (let i = 0; i < d; i += 4) {
            r = img.pixels[i];
            g = img.pixels[i + 1];
            b = img.pixels[i + 2];
            a = img.pixels[i + 3];

            imgColors.push(color(r, g, b, a));
        }

        // Start the packing again!
        loop();
    });
}
```

Because p5.js is constantly calling the `draw()` function I need to use a little trick calling `noLoop()` to avoid calling `draw()` while there is no data, otherwise things will not work.

The interesting part of this function is how p5 gives access to the pixels of an image: After calling `img.loadPixels()`, the `img` object will have a `pixels` property containing a list of integers. For each pixels in the image, four integers are added to `pixels` one for each of the RGB values of the pixel and a last one for its alpha value.

Once we looped through all these values we have an array `imgColors` containing for `P5.Color` object :tada:

### Generating circles

Before we pack the image with circles we need to generate one of them. Here our goal is the following: Return a new circle which does not overlap the others or return nothing (we will handle the failed generations later). So far the algorithm is not very complex: We have a list of existing circles `circles` (Empty at the beginning), we generate a random position `(x, y)` and a radius `r`, we then iterate on the list of existing circles and test if its distance to the newly generated one is larger than the sum of their radius (i.e. they don't overlap).

```js
function newCircle() {
    let x = random(img.width);
    let y = random(img.height);
    let r = random(MAX_INITIAL_SIZE);

    const intersection = circles.findIndex((other) => {
        if (dist(x, y, other.x, other.y) < other.r + r) {
            return true;
        }
        return false;
    });

    if (intersection !== -1) {
        return;
    }

    let color = imgColors[int(x) + int(y) * img.width];
    return new Circle(x, y, r, color);
}
```

Now that we can generate one circle let's make a function which tries to generate a given amount of circles so that one iteration will see several ones created:

```js
function newCircles() {
    let totalNewCircles = NEW_CIRCLES_BY_ITERATION;
    let remainingAttemps = NEW_CIRCLES_ATTEMPTS;
    let countNewCircles = 0;

    while (countNewCircles < totalNewCircles && remainingAttemps > 0) {
        remainingAttemps--;

        const newC = newCircle();
        if (newC !== undefined) {
            circles.push(newC);
            countNewCircles++;
        }
    }
}
```

Of course the more circles we generate the harder it become to find the right spot for a new one, that why we need to use a maximum number of attempts to avoid blocking the main loop.

### And making them grow

Now that we can generate a bunch of new circle on each iteration, let's make them grow too and that's how we pack circles on kittens :muscle:
