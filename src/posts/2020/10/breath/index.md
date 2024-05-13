---
layout: layouts/post.njk
tags: ['post', 'p5', 'mindfulness', 'procedural']
date: 2020-10-22
title: Algorithmically guided breathing
commentIssueId: 14
---

I am not really knowledgeable about yoga, mediation and all this kind of well being topics, but I recently realized that following breathing exercises is actually a great way to quickly reduce my stress level. What I am talking about is simply taking a few minutes to focus on the way you breath and force yourself to breath deeply and regularly.

Also [some people who seem very serious](https://breathe.ersjournals.com/content/13/4/298) say that it's acutally good for your health.

The internet being full of wonders, I also had seen several gifs like the following one and really wanted to give a try at creating perfectly looped animations.

![Animation of shapes to guide your breathing](https://media.giphy.com/media/krP2NRkLqnKEg/giphy.gif)

So being a developer and having a bit of free time, I had found my new side project! I decided to create a webpage which would show some beautiful looped animations and would be useful to practice deep breathing.

Before reading what follow you should have a look at the result, I looks kinda good actually: https://breath.statox.fr

_Note that the application is much more fluid on Chrome than on Firefox. This is because of Firefox's default value for its setting `privacy.resistFingerprinting` which messes up with the canvas to limit fingerprinting. Nothing much I can do about that but keep using firefox, the net neutrality needs it_

### Prototyping time!

The first step was to create a [codepen](https://codepen.io/statox/pen/abNVYZZ) loading my favorite graphic library [p5.js](https://p5js.org/) and to start experimenting.

That resulted in some pretty rough animations and a not very well organized code, but at least it allowed me to validate what are the two main components I would need to implement in my project:

-   Some kind of state processing to handle the transitions between the "breath in" and "breath out" phases (as well as two additional "pause" phases, which I find more comfortable to add);
-   A "pluggable architecture" where I can write independent functions for different animations and only have to plug them in the existing canvas.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="statox" data-slug-hash="abNVYZZ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="p5 - breathing">
  <span>See the Pen <a href="https://codepen.io/statox/pen/abNVYZZ">
  p5 - breathing</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Making it real

Once I had a working proof of concept in codepen I created a [more structured project](https://github.com/statox/breath) on Github which would also allow me to host the application via the Github Pages feature.

#### Managing transitions

The first module I needed to implement was my `StateComputer` which is used to keep track of where the program is in the animation.

To do so it has an array of state representing the different steps and how long they should last:

```javascript
this.currentStateIndex; // keep track of the current state
this.states = [
    // durations are in milliseconds
    {
        action: 'inhale',
        text: 'Breath in',
        duration: 4000
    },
    {
        action: 'inhale pause',
        text: 'Breath in',
        duration: 500
    },
    {
        action: 'exhale',
        text: 'Breath out',
        duration: 6000
    },
    {
        action: 'exhale pause',
        text: 'Breath out',
        duration: 200
    }
];
```

A function is also called at the beginning of the session and use a timeout to update the state for each transition:

```javascript
this.updateState = () => {
    this.currentStateIndex = (this.currentStateIndex + 1) % this.states.length || 0;
    this.lastMark = millis();
    const timeout = this.states[this.currentStateIndex].duration;

    if (this.playing) {
        this.currentInterval = setTimeout(this.updateState, timeout);
    }

    // Stop the animations once the time of the session is elapsed
    if (this.remainingMs < 1000 && this.currentStateIndex === this.states.length - 1) {
        this.playing = false;
    }
};
```

And finally a function call for each frame indicate where we are in percentage of the current step:

```javascript
this.getCurrentPercentage = () => {
    if (!this.playing) {
        return 0;
    }
    const currentlyElapsed = millis() - this.lastMark;
    const currentDuration = this.states[this.currentStateIndex]?.duration;

    if (this.currentStateIndex === 0) {
        const r = map(currentlyElapsed, 0, currentDuration, 0, 100);
        return parseInt(r);
    }

    if (this.currentStateIndex === 1) {
        return 100;
    }

    if (this.currentStateIndex === 2) {
        const r = map(currentlyElapsed, 0, currentDuration, 100, 0);
        return parseInt(r);
    }

    if (this.currentStateIndex === 3) {
        return 0;
    }
};
```

Now that we are able to get the percentage of the step we can have some fun and start writing our animation functions which will draw shapes progressively.

#### Making animations

First in our `sketch.js` file we can define the `setup()` and `draw()` function used by p5 respectively to initialize the application and then to refresh the canvas at each frame.

```javascript
function setup() {
    // Create the canvas and put it in its div
    const myCanvas = createCanvas(400, 400);
    myCanvas.parent('canvasDiv');

    stateComputer = new StateComputer();

    animations = [
        new AnimationClass1(),
        new AnimationClass2(),
        ...
    ];
    animationsIndex = 0;
    animation = animations[animationsIndex];
}

function draw() {
    const {percentage} = stateComputer.getUpdate();

    background(0);
    push();
    animation.draw(percentage);
    pop();
}
```

With this structure we can simply add more classes to our `animations` array and as long as the class has a `draw()` method accepting a percentage as a parameter it will be shown.

(Some omitted code handles the incrementation of `animationsIndex` to change the currently displayed animation.)

One such class is shown here:

```javascript
function SimpleCircleAlpha() {
    this.minR = 10;
    this.maxR = 200;
    this.draw = (percentage) => {
        this.maxR = Math.min(width, height) * 0.8;
        this.minR = Math.min(width, height) * 0.3;
        const alpha = map(percentage, 0, 100, 0.2, 0.7);
        const paint = map(percentage, 0, 100, 50, 150);

        background(0);
        fill(`rgba(${paint}, ${paint}, ${paint}, ${alpha})`);

        const r = map(percentage, 0, 100, this.minR, this.maxR);
        circle(width / 2, height / 2, r);
    };
}
```

Here we draw a circle whose radius and color change depending on the progress of the state.

### Meditative coding

Once the skeleton of the app was made (i.e. adding some buttons, a UI based on Vue.js to choose the duration of the session, playing with a "fullscreen" button, some CSS media queries and all the other boring details I didn't include here) all that is left for me to do is to add more animations. And, weirdly, spending time just creating some pleasing visuals on the rythm of a slow breathing really has something close to meditation.

So that was a fun and relaxing project and I really hope I will continue to take some time to regularly create new animations because so far that has been a very calming experience.

Here is a gif of some of the visuals I created and the full application is available [on this page](https://breath.statox.fr)

![spoiler](../../../../images/breath.gif)
