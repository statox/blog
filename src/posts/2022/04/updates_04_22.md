---
layout: layouts/post.njk
tags: ['post', 'me', 'meta']
date: 2022-04-22
title: Stuff I've done these past 6 months
commentIssueId: 32
---

I haven't created new posts on this site for the past 6 months but it doesn't mean I haven't been productive! Not that anyone care but I'm sure it will make me feel good to write about my past projects.

So here is an unordered overview of my past 6 months!

### I'm playing music now

I've been playing the guitar as a beginner for the past 15 years now. I learned a few chords, one or two strumming patterns and used that on every songs. That was enough fun for me until December of last year. For the first time I played the guitar with a few colleagues for a small show at Dashlane's Christmas party. This wasn't the musical show of the century but for us to rehearse we booked a recording studio in the north of Paris and that was a super fun experience!

I realized that I was bored playing music by myself and that playing with other people would be more fun! So I did several things.

#### Pedals, pedals, pedals

First, I got myself a [Boss RC-10R](https://www.boss.info/global/products/rc-10r/) looper pedal. This is super fun to use because it has a bank of drum sounds and it allows me to record several layers of music on the same loop. This is not the same thing as playing with other people but this is good exercise to improve my sense of rhythm and to create music a bit more thought-out than my usual chord progressions. While searching for a loop pedal I also came across the [Trio+ Band Creator by Digitech](https://www.digitech.com/band-creator/TRIOPLUS.html) which looks like a very solid pedal. Now that I've been using the RC-10R there are many small details in the interface which really bother me and I'm considering switching to the Trio+. Maybe I'll write about that more in depth later.

A few years ago I asked my parents for an overdrive pedal that I had completely forgot about. But while setting up my looper pedal, my dad reminded me of this Behringer BO100 I had and that's how I seriously fell into a new rabbit hole. The looper and the overdrive give me the ability to record a lead guitar with a clean sound and a much dirtier sounding solo guitar. But I want to go further! So I also bought a secondhand Octaver pedal which allows me to record bass line with my regular guitar (it also has a ton of other uses that I don't handle very well yet) as well as an ["Instant Lofi Junki" pedal by zvex effects](https://www.zvex.com/guitar-pedals/instant-lo-fi-junky-vertical-guitar-effects-pedal-2021). This is actually a pedal combining a compressor and a vibrato. I haven't managed to create good lo-fi tracks for now but still it's a versatile pedal which give me more nuances when I want to add some background chords or some accents in my song.

The logical follow up of buying these new pedals was of course to get a [proper pedalboard](/images/pedals/pedalboard_02_2022.jpg). The subreddit [r/pedals](https://www.reddit.com/r/pedals/) and its other sister subs is an awful rabbit hole to fall into. There are so many pedals, so many configurations, so many beautiful pedalboards it really makes you want to spend unholy amounts of money in tools you'll never know how to use properly! 😄

But I've been reasonable and I went for a simple, small pedalboard that I plan to grow over time. My pedalboard is now in a state that I can play so that's nice but in the near future I plan to buy more pedals (I'm especially looking for a good reverb/delay one which would bring more depth to my sound, probably a tuner because it's convenient, I'm thinking about getting a noise gate but I'm not sure if it's really worth it I should debug other noises in my system before). I also bought the materials to make my own patch cables with smaller connectors to get more room on my board. And I'll see what are the next steps after that.

I also seriously wanted to buy an [electronic kalimba](https://lottiecanto.com/shop/p/colourpalette) which sounds incredibly cool but alas last time a new batch was released they were all sold out in less than one minute so I couldn't buy mine. But I won't give up I'll be there for the next batch!

#### Are we rockstars yet?

To make the most out of my new pedals I also got into music theory. I never bothered to learn anything more than the name of the notes and I knew that it would be holding me off if I wanted to get better. So I started to learn more about scales, chords, chord progressions and all of that. I still have a lot to learn but it's a nice thing to get into regularly.

With that I also got two buddies of mine to regularly play music together: We try to book a studio session regularly, we try to work on pieces of music before we meet so that we can play together and it's a ton of fun! Lately we've been trying to play [Narcotic by Liquido](https://www.youtube.com/watch?v=PJ7E40Ec5ec) this is not my favorite song ever but together we studied each part of the song, analyzed the different patterns and put all of that in an excel sheet. I'm looking forward to play it with the buddies! In parallel I also started recording myself so currently I'm working on my own version of Liquido where I am playing all the parts excepted for the drums. This is an opportunity to learn how to use Garage Band which is super interesting!

I also try to play with more people, so I've been playing with a couple of teammates at Dashlane this is very casual but it was the opportunity to see that I _can_ play with other people which I'm pretty happy about!


### Making this site useful

So I'm playing music but I'm still a nerd and what's better than when two of your hobbies come together?

I decided to use this site I'm creating to be a useful resource when I'm playing. So I added several sections:

- I worked a lot on my [chords](/chords) page. I use it to list all the chords of the songs I can play so I worked on a clean presentation which works on desktop and mobile and is convenient to search. I added a "Random song" button to avoid playing always the same songs as well as a list of the last songs I added. What I'm at the same time the most proud of and the most ashamed of is the "poor's man CRM" system I created: I use a Github workflow on the repo of this website to monitor a specific issue of the repo and transform my comments into JSON data that is then committed to my list of chords. This is not super clean but I think it's a creative and easy way to ease my life. I want to write about that at some point.

- On the [music](/music) page I also added different sections. One with all the online resources I'm using to learn music theory. This is not super convenient to use and I'm still thinking out how I want to rework it. And another sections with the manuals and default settings of the pedals I own. This page too is more a first try of something that I want to improve in the future.

So now when I setup myself to play some guitar I can pull my site and have everything I need right at my fingertips! I'm happy with that because I think making things which make your life easier is what the internet and technology is all about.

But the music page is not the only thing I did on this site!

I also added a dedicated [posts](/posts) page which contains everything I write and which was previously the home page of this site. That allowed me to create a proper home page where I can display only my latests projects and posts next to my most popular posts. My analytics tell me that literally no one will notice the difference but by now it's clear that I'm doing this website just to please me (Even this very long article is really written only for my eyes, I know that). Anyway all of these changes were a good opportunity to do some CSS and confirm that it's really not something I like to work with 😅

I also reworked the organization of the code of this blog I started using eleventy macros which is a good compromise between a simple system and full blow component system like modern framework do. In another project I experimented with [sveltejs](https://svelte.dev/) which is super simple to start using and seems pretty powerful. All of that helped me improve my front-end development skills which is always good.

Finally I've also been working on a CV page where I want to have a good looking and up to date online resume. I started organizing the data to be compliant with eleventy conventions and easy to integrate on this site but I still have to make significant progress on the actual presentation of the data. I have no intention to find a new job in a near future but I think it's better to do this kind of thing when you are not looking, it limits the stress of the job hunt process when it has to happen.

I have also started 3 different articles for this website that I never finished writing, heh I'm not perfect I often get lazy 🤷

### Keep coding

When I'm not playing music and tweaking this website I also keep practicing my useless side projects! Since November I have worked on several projects which are in the [project](/project) page:

- I implemented an ["instrument"](https://codepen.io/statox/full/qBPwaNo) with p5js. The idea was to experiment with the MIDI capabilities of the library with a dumb project. I am not completely convinced by what I've seen and I think in the future I will experiment with other musical JS library to see what I can gete out of them.
- In December I did the advent of code. Stopping at day 14 which is two day earlier than in 2020.
- To help me learn music scales I implemented the [chord wheel](https://statox.github.io/chord-wheel/) which is originally a paper tool coming from a book that I've turned into a web page. It would probably deserve a full rewrite to be better organized, bugfree and allow to implement other similar tools (like the "circle of fiths"), again: maybe later...
- At Dashlane I've been revamping the exercise that we use to interview our candidates and following my usual hobbies I came up with a exercise based on cellular automata. So that was a good excuse to implement some new ones! First I made a simple [Langton's Ant](https://statox.github.io/pixijs-langton-ant/) which is not super impressive but was fun to do. I twisted it a bit by coloring the sections created by the pattern. On this project I used pixijs to try alternatives to p5js, that was a long time ago, I didn't write about it and my memory doesn't serve me well but I'd say it wasn't a great experience because otherwise I would have tried it in another project.
- And while I was thinking of cellular automata I finally implemented a 1D automata platform for the first time! I called the project [circular automata](https://github.com/statox/circular-automata/) because my initial thought was to represent a classical automata with concentric circles. The implementation of the automata was quite simple and the visualization too but this project got super interesting when I decided to use sveltejs in it. With svelte I created a super convenient architecture where I can have one component to run the p5js animation and dedicated components to control the simulation. This component system allows me to easily plug new visualizations, or to test new graphic frameworks (I'm currently experimenting with a threejs component). I think setting up my first project with p5 and svelte is a major break through in my side project as it should allow me to be faster to create well architectured, more complete and more convenient projects, so I'm looking forward to have more time to do new experiments.
- In a completely different area I also finally created my [setup repository](https://github.com/statox/setup). This is something I had been wanting to do for many many years but when my Dashlane computer broke and I had to reinstall of my setup I decided it was the final straw. The great thing is that at Dashlane I have had the opportunity to work a lot with Ansible and to better understand how it is supposed to work and to be used. Also a teammate of mine kindly let me look into his own repository of Ansible playbooks and that got me started. Now I have a collection of playbooks which allow me to setup most of my common tools of a Linux machine from the Desktop environment, to my favorite packages and configurations, to my own dotfiles. This is a project which will keep growing and that I'll need to evolve regularly like [my dotfiles](https://github.com/statox/dotfiles) but it's incredibly satisfying to use. I'm also evolving it to handle my different server setups like my OVH box or my local raspberry!
- And I also created a script which scraps [Nasa's Astronomy picture of the day](https://apod.nasa.gov/) every day and sets it up as my desktop background as well as my Zoom virtual background. I intended to write an article about that because Zoom doesn't allow to you programmatically change your background and I was happy to find a solution but I haven't found the motivation to do it yet

### Staying healthy

Another huge change I have experienced other the last 6 months is that I realized I actually like doing sport. Ever since I was a kid I have never felt particularly attracted by sports (despite doing fencing for close to 10 years 🤷) and I blame the French school system for that (I should write about it one day, maybe that would be more interesting than my random coding adventures). But since December I'm taking yoga classes and I'm loving it!

I think I'm lucky because I found a great setup where I can do yoga with people I love which is super motivating but I also dared taking classes by myself! I have really enjoyed getting into this yoga thing I knew nothing about, learning the different types of yoga, trying to understand the meaning and the origin of this practice, figuring out what I like and what I don't... So know I can have a conversation about Yoga and I've been going (almost) every week for the past 4 months which I'm  really proud about. Maybe at one point I'll actually start to feel physical benefits but at least for now it's a good mental health thing to do!

I'm also looking into getting enrolled in a mentoring program for young people who struggle finding a job, I'm still figuring out the details but it might be a great way to give back what life gave me which would be quite cool.


### I'm doing well

So yeah if I reflect on the past 6 months I've been doing stuff, I think I'm pretty happy, I have great stuff going on at work and in my personal life too that I won't write about here and the weather is getting great again! Life is good.
