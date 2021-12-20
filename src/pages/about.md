---
layout: layouts/base.njk
title: About
permalink: "/about/"
CSSFile: "css/pages/about.css"
eleventyNavigation:
  key: About
  order: 5
---

### Hello

I am Adrien (aka statox), a server software engineer at [Dashlane](https://www.dashlane.com/) in Paris, France.

<img class="profile-picture" src="{{ '/images/me.jpg' | url }}" alt="My face"/>

This website is just a place for me to talk a bit about my side projects and keep a few notes for myself. You will find stuff about the topics that I like (in no particular order): Vim, Linux and system administration, doing fun simulations and games in the browser, DIY projects, improving people's privacy on the internet and software development in general.

### Social

You can email me at <code>me AT statox DOT fr</code> or reach out to me on any of these social platforms:

- [Github](https://github.com/statox/) - Where I host my side projects and experiments.
- [vi.stackexchange](https://vi.stackexchange.com/users/1841/statox) - Where I've been a moderator for a few years and try to be helpful to other Vim users.
- [Linked in](https://www.linkedin.com/in/adrien-fabre-7a30994b/) - Where you can contact me if you want to.

### Technology on this site

#### Analytics

Because I want to be able to know how many people read my rambling I use an analytics platform on this website.

However I think the fight for a more privacy friendly internet is one of the most important to lead currently. That's why I use [goatcounter](https://www.goatcounter.com/): It is an amazing privacy friendly tool which does nothing else than counting how many time my pages are loaded. So no cookie :cookie: for you on this site, nor any other invasive tracking method.

**Edit December 2021** I am experimenting with the different tools offered by cloudflare to proxy this website and they inject trackers in my pages. I'm still figuring out if that brings me enough value or if that contributes to the surveillance economy more than I'm confortable with. I'll update this when I make a decision.

#### Web

My professional experience is mainly focused on backend development: Maintaining and developing infrastructures at scale is a fascinating topic for me, however I'm less used to frontend development. So when I started creating a website I wanted it to be dead simple so that I get things done quickly and without friction. That's why I chose to use [eleventy](https://11ty.dev/) a simpler static site generator.

And as I'm not exactly a css expert and wanted something simpler than bootstrap I went with [newcss](https://newcss.net/) a very simple css framework.

The source code of the site is [on Github](https://github.com/statox/blog/) and [uses Github Actions](../posts/others/travis-to-githubactions/) to automatically build and publish each update to Github Pages.

#### CI status

[CI On Github Actions](https://github.com/statox/blog/actions/)
![Build Status](https://github.com/statox/blog/actions/workflows/deploy.yml/badge.svg)
Last build: {{ "" | buildInfo }}
