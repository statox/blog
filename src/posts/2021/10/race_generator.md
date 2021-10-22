---
layout: layouts/post.njk
tags: ['post', 'procedural', 'race', 'game']
date: 2021-10-16
title: An attempt at procedural race generation
commentIssueId: 29
---

For several weeks now I have been working on and off on an ambitious project in which I want to procedurally generate a racetrack to create autonomous vehicles which will learn to drive on it thanks to a genetic algorithm. I did a lot of different experiments and even got some ~~cool~~ passable results but I am hitting a point where there is too much refactoring to be done to complete the project with the current code base. As I don't have the motivation to put more work to do things properly and as I also have other projects in mind that I want to start working on I'm writing this post to keep a trace of what I have done and what I would like to do differently. This writing will be messy and probably not very interesting for anyone else than myself but I hope that it will be helpful in a few months when I decide to build something on top of this experiment.


### Generating a racetrack

My goal was to generate a racetrack which would be a loop with several turns with angles sufficiently difficult to be interesting. To do that I took a lot of inspiration from these two articles:

 - [How to generate procedural racetracks](http://blog.meltinglogic.com/2013/12/how-to-generate-procedural-racetracks/)
 - [Procedural racetrack generation](https://bitesofcode.wordpress.com/2020/04/09/procedural-racetrack-generation/)

In the first post Gustavo Maciel describes an idea to generate a racetrack in three simple steps:
   - Generate a bunch of random points in the plan
   - Calculate the hull of the polygon formed by these points. That is, simply put, the list which will wrap around all the points
   - Finally interpolate the points of this hull to get a nice racetracky shape on which a car could drive

The second post is a second implementation of Maciel's idea, and my project is yet another implementation of the same idea but with my _very own_ bugs and design flaws which makes it very special to my eyes 🤩.

#### Generating points

The first step was fairly easy, I decided to start prototyping on codepen with p5.js to get a quick feedback loop.
So I created a `Point` class which would hold a position as a `P5.Vector` as well as a numerical ID and the drawing logic. The idea of using a class to supercharge a simple vector is probably not a bad one, but in the following steps I ended up mixing my point for some uses with pure `P5.Vector` for other uses and that inevitably lead to some friction. Next time I work on this project I think it's a good idea to put more efforts in the design of this class so that I can use it exclusively. That will avoid having to write utils functions which have to handle both types as inputs which quickly becomes frustrating.

In later iterations this class also has some methods like `move()` that I use to change the position of the point (for example when two points are too close to form a proper hull) or `constrain()` that I use to make sure the point is moved back to the screen if I pushed it too far away with the `move()` function. This became a major pain: with this model the point is aware of itself and does some corrections which should only be done by the code responsible for generating the hull (separation of concerns much?).

Once this class exists I also created a `Terrain` class responsible for generating a few points and pushing them away when they are closer than an arbitrary distance. This pushing away operation will have to be repeated several times until the configuration stabilizes:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="XWggOay" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/XWggOay">
  Polygon  generator (spacing points)</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

#### Generating a hull

This is where things get tricky: Generating a bunch of points is fairly easy, generating a polygon from this set is a much larger problem. A great resource to understand the problem at hand is the [Convex hull algorithms](https://en.wikipedia.org/wiki/Convex_hull_algorithms) wikipedia page. This page is a big rabbit hole and it's easy to get lost in all its links for hours, however I wanted to get things done so I decided to implement the [Gift wrapping algorithm](https://en.wikipedia.org/wiki/Gift_wrapping_algorithm) which is one of the simplest ways to find the hull of a polygon.

The Wikipedia page explains it better than I do but the basic idea is to pick up a point in your list of point and look for the point for which all the other points are on the right of the line formed by your two selected points and to continue doing that until you have reached your initial point again.

Fortunately the page has a pseudo code implementation so I was able to port that to javascript.

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="mdwqyXK" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/mdwqyXK">
  Polygon Convex Hull with Jarvis March algorithm</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>


After this successful attempt I decided that the hulls generated were too boring: I want some deadly turns!

The gift wrapping algorithm generates a convex hull which is a simple, boring envelope of the points. A concave hull however is a polygon with at least one angle between 180 and 360 degrees exclusive, which means that this polygon has a much more interesting shape with much more complex turns. It is however more complex to generate.  So I explored the web a bit more and ended up on [Concave hull: A k-nearest neighbours approach for the computation of the region occupied by a set of points](https://repositorium.sdum.uminho.pt/bitstream/1822/6429/1/ConcaveHull_ACM_MYS.pdf). This paper describes an algorithm to generate a concave hull using the same idea as the gift wrapping but at each step, instead of choosing the next point among the complete list of generated point, we restrict the search the nearest neighbors of the current point.

This looks much more interesting:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="ExXbKxv" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/ExXbKxv">
  Polygon Concave Hull with Custom algorithm</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

However with concave hull come two big issues:

- It is not uncommon that two segments of the polygon intersect: that creates an issue because if you create a crossroad in a racetrack things get messy (Well, there _are_ some [figure 8 racing](https://youtu.be/6ZZyP7VlZcM) competitions but for our purpose that creates too many issues to count laps and detect if cars followed the right path)
- Even when they don't intersect sometimes the vertices are at an angle which is just too narrow to make a good race track.

There are several ways to get rid of these issues:

- Detecting the intersection of two segments is super easy when you have a [`collideLineLine()`](https://github.com/bmoren/p5.collide2D/blob/0988172c15aeef/p5.collide2d.js#L196-L235) function like the one I shamelessly stole from the [p5.collide2D](https://github.com/bmoren/p5.collide2D) library. Determining the angle formed by three points and comparing it to an arbitrary threshold is enough too (cf. `threePointsAngle` in the previous codepen). Using this information one could simply ignore the bad tracks and keep generating new tracks until one fits all the criterion.
- For intersections a correction can be made by taking the point where two lines intersect, making this point a new point of the hull replacing the ones which are in the inner loop.
- For angles it is also possible to use the same principle as what I used to push my initial points apart: Take all your points, when three of them form an angle too narrow move one of them, and keep going until things are stable.

**I think that the important thing here anyway is to have your hull as clean as possible before you move on to the next step otherwise it will inevitably bite you.**

I'm putting the previous sentence in bold because of course I was too impatient to get to the next step so, of course, after thinking about the possible solutions for half an hour I decided to ignore the problem until it's too late.


#### Interpolating the points

Earlier this year I did [an experiment with Bezier curves](https://statox.github.io/bezier-experiment/) when this project was just a vague idea in the back of my mind. The basic idea is to generate a bunch of points (hence the two previous parts) to get a polygon and use the formula created by Bezier to add more points to this polygon to make the curves smoother.

So I kept my two hull algorithms (the gift wrapping and the k-nearest neighbors), plugged my code generating Bezier curves and got this result:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="wvePqmR" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/wvePqmR">
  Bezier curves for polygon hull</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

The results are quite nice we can see something which could look like a racetrack, that's the right path! However our issues with interesctions and narrow angles are still here and once again I decided that fixing them was a problem for future me 🤷.


#### Adding some width

So now I have a racetrack with a few hundreds points but they still form a simple line. There are a lot of options to make this line an actual road, my goal is to have cars detecting their position on the road with a ray tracing algorithm that I'll describe more later. To run this ray tracing I need to have a bunch of segments which represent the borders of my road.

So I created a `Track` object which get the points of the hull. For each point two more points are generated perpendicularly to the direction of the hull at the point. These two points are stored in two arrays which materialize the left and right borders of the track.

Here you can see in <span style="color:blue;">blue</span> the initial hull, in <span style="color:green;">green</span> the right border and in <span style="color:red;">red</span> the left border:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="zYzPPbg" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/zYzPPbg">
  Race track generator</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

It's also at this point that I finally decided to start fixing the intersection issue. And of course I did it in a not very bright way: When the angle between three point is less than an arbitrary threshold I simply remove the middle point. That give this weird correction algorithm that you see in action in the previous codepen. And that introduces a worst problem which is that by doing that I change the width of the track on some portions.


While I was trying to fix this issue I also wondered how I would paint the road because p5.js doesn't have a way to create concave shapes. I came up with a simple solution which is to change the way I draw the line of the hull: By making the stroke weight much bigger I get something which looks even more like a racetrack:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="zYzPJvY" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/zYzPJvY">
  Race track generator (better smoothing)</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

With this implementation I thought I could display the track and have not-very-precise-but-still-good-enough border representation for the cars to run but realized that this is not good enough. So I came up with a solution which I find quite interesting.


#### Detecting that a car is not on the road

At this point I started merging everything I had done before into [a real Github project](https://www.github.com/statox/procedural-race/) with typescript, a real linter and all the right tools to develop this project properly. I tagged my commits properly at each steps so that I could showcase the progress of my project, but now I'm just too lazy to do that so I won't show demos.

One of the interesting ideas I had in the project was to find a way to easily check if an object is on the track or not. What I do is that I generate the track I described before and draw it on a HTML canvas with p5.js. I then use p5.js capabilities to read all pixels on the screen and keep a trace of its color. After that I can reduce the position of my car to a single pixel and check its color, if it's the track color we are good to continue otherwise the car is crashed.

I think this is a pertinent approach as once the track is stored in memory the check is in constant time however my implementation was not the smartest:

- As I draw the track on the canvas, I need to wait the first iteration of `draw()` to run to check the color of the canvas, this is super inconvenient. I should have drawn the track on a different `P5.Graphic` than the canvas this way I can do all the computations in `setup()` making the `draw()` function much simpler.
- I should have normalized my track to a simple white on black display, instead I used the colors I has already started to use to show my track which makes the color comparison unnecessarily tricky.

### Making smart cars

#### Ray tracing
As I am impatient and stubborn I started creating my vehicles before my racetrack was fully ready, which unsurprisingly made things harder. At first things were going well: I had a codepen, I reused some ray tracing code made by the amazing Daniel Shiffman for [one of his coding challenges](https://editor.p5js.org/codingtrain/sketches/Nqsq3DFv-), I plugged that on a car that is controlled with the arrow keys, <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> and here we are:

<p class="codepen" data-height="700" data-default-tab="result" data-slug-hash="QWggBpz" data-user="statox" style="height: 700px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/statox/pen/QWggBpz">
  Ray casting again</a> by Adrien Fabre (<a href="https://codepen.io/statox">@statox</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

#### Evaluation function

Once I know how where my track is I also need to understand how far a car is on the track. My initial idea was to follow a "surface filling" algorithm. I can't find the source which gave me this idea but the principle is simple: You take your starting point (here it's a pixel on the track), you score it 0, then you take its adjacent neighbors and score them 1 and you can recursively score all the pixels of your track. This way, the father your point is on the track the higher is its score. This approach is not completely straight forward on a circular racetrack:

First, you need to decide of a starting point and a direction for your track. All your cars needs to go in the same direction, otherwise it is not a race anymore. Deciding how to store this direction was surprisingly painful, I tried different approach and they all ended up inconvenient because of how messy my data model was and how strongly coupled all the components were.

Once this starting position and direction are decided you need to create a border that you surface filling algorithm should not cross, otherwise the pixels will be scored proportionally to their distance to the starting point which will just maximize the scores in the middle of the track.

The evaluation function also has an issue to keep track of laps: It is super important to be able to say "this car ended up on a very high score pixel but I shouldn't score it very high because it went there by turning around at the start and just being stuck there for its whole race".

#### All the rest

At this point I started to frantically code more and more ~~technical debt~~ features in my code:

- I created some basic cars which trace several rays in front of them, gather average distance on the right and on the left and decide to steer proportionally to these distances. This simple model works surprisingly well. I also wanted to factor the acceleration based on these distances but I didn't get to that and simply made them accelerate more and more for each laps they do.
- I then made the factors used to steer some random numbers acting as the genes of a genetic algorithm, I created a pool of cars and made them reproduce and mix these genes. At these points the results were not super convincing because my algorithm isn't super well tuned. But I think I validated the basic idea: With a better track generation, a mode decoupled data model I should be able to make a working algorithm.
- I also tried to use [dannjs](https://dannjs.org/) which is a nice little neural network library. My idea was to train a neural network via neuro-evolution algorithms. I did several tests but I ended up realizing that neural networks aren't that simple and that you still need to study the math underneath to use them properly.
- I added some broken statistics capabilities to my pool to have an idea of how my cars perform. I'm not convinced my stats are really relevant and I had a big plan of creating real time graphs visualization a bit like the [Primer videos](https://www.youtube.com/c/PrimerLearning) but that didn't happen.

### Thinking of the future

At this point I've been working on this project for several weeks and I know I've reached my time limit for a side project: I know how I want to do the next iteration but that will require a lot of rework and I'm starting to get too tempted by other new shinny projects to put the efforts necessary to make something good. So I will stop here with a demo that is [hosted on github page](https://statox.github.io/procedural-race/).

Despite not being a real success this project is not a total failure neither: I had a lot of fun working on it and that's the most important part of my side projects. But I also learned a lot and I think that the mistakes that I made will really guide me in a next iteration probably next year!
