---
layout: layouts/post.njk
tags: ['post', 'vim']
date: 2017-09-22
commentIssueId: 3
title: Changing my Vim colorscheme depending on the time of the day
---

### Automatic colorscheme changer

A few years ago, [a question on vi.stackexchange](https://vi.stackexchange.com/q/13660/1841) caught my attention. @oarfish wanted a way to change their colorscheme depending on the time of the day.

In a world where Apple has a tool by default on most of its devices to change the colorscheme from dark to light during the day and where a lot of developpers use extensively [f.lux](https://justgetflux.com/) or [redshift](http://jonls.dk/redshift/) it does make sense to be able to change your favorite text editor colorscheme automatically too.

To add this feature I made a very simple plugin which takes for variables as its configuration:

- `g:dayTime` and `g:nightTime` which are two arrays used to describe when in the plugin should switch the colorscheme in the morning and in the evening.
- `g:dayColorscheme` and `g:nightColorscheme` which are the names of the colorschemes to use for each time of the day.

The source code is on [Github](https://github.com/statox/colorscheme-changer.vim).

This plugin leverages the timer function of Vim >8 and neovim (See [`:h timers`](http://vimhelp.appspot.com/eval.txt.html#timers)) to regularly check the current system hour, compare it to the configurations of the plugin and call `:colorscheme` accordingly.

This was interesting to create this plugin because I didn't have an opportunity to play with Vim's timers before. However after a few days of use I realized that I actually like my colorscheme and I don't want to change it during the day. So I soon stopped using this plugin but this gave me another idea.

### Event based colorscheme changer

I noticed that my main pain point related to my colorscheme was when I switch vim to the diff mode using [`:h :diffthis`](http://vimhelp.appspot.com/diff.txt.html#%3Adiffthis). I realized that my current colorscheme didn't do as well as the previous one in diff mode. So I came up with a pretty simple trick in my `.vimrc`:

```vim
" Color configuration
    try
        " Define the default colorscheme and the one used in diff mode
        let g:colorsDefault  = 'forest-night'
        let g:colorsDiff     = 'jellybeans'

        " Set up the default colorscheme when vimrc is sourced
        execute "colorscheme " . g:colorsDefault
    catch
        echo "Colorscheme not found"
    endtry
" Diff configurations
    " Easier diff commands
    command! DT execute "colorscheme " . g:colorsDiff | windo diffthis
    command! DO execute "colorscheme " . g:colorsDefault | windo diffoff
```

The idea is very simple: Declare two variables holding the names of the colorschemes I want to use in normal mode and in diff mode and define some wrapper commands around diffmode:

- `:DT` (For `DiffThis`) will change the colorscheme and then switch every window to diffmode
- `:DO` (For `DiffOff`) will do the opposite: Switch back to default colorscheme and stop diff mode.

These lines having been [in my `.vimrc`](https://github.com/statox/dotfiles/blob/7fd57caab6f7e610529b976ec45728c650a1322b/vimrc#L381-L403) for a few time now and so far they fit my needs. Maybe in the future I'll also explain with more details how I handle the diff mode in Vim.
