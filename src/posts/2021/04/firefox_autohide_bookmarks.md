---
layout: layouts/post.njk
tags: ['post', 'firefox', 'customization']
date: 2021-04-10
title: Auto hide firefox bookmark bar
commentIssueId: 25
---

A very quick tip that I don't want to forget about: One can automatically hide the firefox bookmark bar, the bar will show when the mouse hovers the bottom of the navigation bar and hide after a defined delay.

### Locate userChrome.css

The `userChrome.css` file holds style rules for modifying Firefox's user interface. [This website](https://www.userchrome.org) is a good learning resource.

On linux the file is either in 

 - `$HOME/.mozilla/firefox/[PROFILE_ID].default/chrome/userChrome.css`
 - or `$HOME/snap/firefox/common/.mozilla/firefox/[PROFILE_ID].default/chrome/userChrome.css` if you use the snap version

To locate the profile currently used by Firefox one can visit `about:support` and check the line `Profile Directory`.

You also have to set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true` in `about:config` otherwise Firefox ignores `userChrome.css`

### Add the relevant code

The code is available on [MrOtherGuy's Github](https://github.com/MrOtherGuy/firefox-csshacks/tree/master/chrome/autohide_bookmarks_toolbar.css), I'm copying it as a reference. It works well with Firefox 87.0.

```css
/* Source file https://github.com/MrOtherGuy/firefox-csshacks/tree/master/chrome/autohide_bookmarks_toolbar.css made available under Mozilla Public License v. 2.0
See the above repository for updates as well as full license text. */

#PersonalToolbar{
  --uc-bm-height: 20px; /* Might need to adjust if the toolbar has other buttons */
  --uc-bm-padding: 4px; /* Vertical padding to be applied to bookmarks */
  --uc-autohide-toolbar-delay: 600ms; /* The toolbar is hidden after 0.6s */

  /* 0deg = "show" ; 90deg = "hide" ;  Set the following to control when bookmarks are shown */
  --uc-autohide-toolbar-focus-rotation: 0deg; /* urlbar is focused */
  --uc-autohide-toolbar-hover-rotation: 0deg; /* cursor is over the toolbar area */
}

:root[uidensity="compact"] #PersonalToolbar{ --uc-bm-padding: 1px }
:root[uidensity="touch"] #PersonalToolbar{ --uc-bm-padding: 7px }

#PersonalToolbar:not([customizing]){
  position: relative;
  margin-bottom: calc(0px - var(--uc-bm-height) - 2 * var(--uc-bm-padding));
  transform: rotateX(90deg);
  transform-origin: top;
  transition: transform 135ms linear var(--uc-autohide-toolbar-delay) !important;
  z-index: 1;
}

#PlacesToolbarItems > .bookmark-item{ padding-block: var(--uc-bm-padding) !important; }

#nav-bar:focus-within + #PersonalToolbar{
  transition-delay: 100ms !important;
  transform: rotateX(var(--uc-autohide-toolbar-focus-rotation,0));
}

#navigator-toolbox:hover > #PersonalToolbar{
  transition-delay: 100ms !important;
  transform: rotateX(var(--uc-autohide-toolbar-hover-rotation,0));
}

#navigator-toolbox:hover > #nav-bar:focus-within + #PersonalToolbar {  
  transform: rotateX(0);
}
```
<!-- vim: set spell: -->
