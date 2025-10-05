# Looking for a new terminal emulator on Linux

**WIP**

## Goal

Replace my current workflow of Gnome Terminal + tmux:

- Get rid of tmux (Some graphic inconsistencies, one dependency in my dotfiles)
- Keep my current keyboard centric workflow
- Ideally choose a tool which works well with Wayland based WM.
- Why not CPU or even GPU acceleration, NO electron based application
- Easy to install and update
- The terminal window can span the whole interface. No annoying "options" bar, scrollbar or fluff.

### workflow to preserve

Settings

- ctrl+space as a leader
- "2 times bindings" where I press the leader, then press the mapping without having to maintain both pressed at the same time.

Splits

- Create splits with `leader+/` and `leader+!`
- Move between splits with `leader+hjkl`
- Move splits with `leader+{}`
- Adjust splits size with `leader+arrow keys`
- Close split with `leader+x`

Tabs

- Create a tab with `leader+c`
- Navigate tabs with `leader+ctrl+hl`
- Move tabs around wiht `leader+ctrl+left-right`

- A tab bar taking as few space as possible, ideally 1 terminal line

Copy mode

- tmux select + copy mode easy to trigger and navigable with vim bindings
- Enable copy mode with leader+escape

FZF integration

- FZF used in my custom `gd` command should work well
- FZF used in zsh ctrl-r ctrl-t should work well

Espanso should keep working

## Kitty

Good

- Easy installation with `apt` but version v0.32.2 outdated by 18 months. (Directly appears in my app launcher)
- To recreate the ctrl+space + map mechanism we can't use `kitty_mod` in the config but the end result remains close
- The tabs and windows navigations can be configured the same as my tmux bindings.

Neutral

- I had to enable the visual bell, by default we get a sound.
- Config file is not a standard format

Issues to solve:

- The key repeat rate is too high, so I struggle to open some togglable menus, my backspace and enter keys are too sensitive.
- The author wants to delegate the copy-paste mechanism to a pager so there is no great way to copy past the text of the terminal out of the box
- The last run command is printed below the prompt before its results are displayed, don't know why
- Almost all icons of `:NvimWebDeviconsHiTest` were displayed the first time I used the terminal, now there are not anymore I'm not sure why.

Issues impossible to solve:

- The author seems pretty negative. I found a few Github issue where he seems to have strong opinion and be not very welcoming to suggestions
- The copy past mode delegated to an external pager is very annoying. There is a Neovim plugin to use it as a pager, I'm not a fan of adding things to my editor config because my terminal can't handle selecting text.

## Wezterm

- Install via flatpak, dedicated apt repo or appimage (if installed via appimage need to create an entry in my app launcher)
- Most of the icons of `:NvimWebDeviconsHiTest` are supported and gets a notification when some glyph can't be found in any font
- Config file autoreload + config in lua
- Managed to get the space screen space as tmux (Disabling "fancy tab bar" makes it even better than tmux)
- The docs are really not clear
    - ~I didn't find a simple way to test lua commands interactively with the cli or to use what I did in cli in the lua conf~ `ctrl+shift+l` opens the debug layout which gives a lua repl
    - Using colorschemes isn't clear at first and seem to require running lua code
- Colorschemes:
    - Good my nvim themes \*fox are available
    - Dimming inactive tabs works out of the box

Issues to solve:

- [x] Because of the autoreload of the config file and invalid config causes an error and I need a different terminal emulator to fix the config file. It keeps open the window with the previous config.
- [x] It looks like I can't center the tab bar show it's not as good visually as tmux
    - My workaround is to have the tab bar at the top the window. When it is at the bottom sometimes my hands on my laptop keyboard prevent me to see the bottom of my screen so I can't see the tabs (I should pay more attention to my posture too)
- [x] At one point the whole UI became very slow, I'm not sure if its also affected other apps. I'm trying to disable nvim plugin render-markdown but I'm not sure it's really related.
    - The issue comes from the interference with `picom`. I disabled the composer and it seems to solve the performance issue, but I don't have window transparency anymore. I might dig more but also I might also ditch picom completely.
    - After a few more weeks I'm used not having picom so I'll consider that a problem solved. Last bit to solve is: I keep having to stop picom manually when I start my session eventhough I commented the line which starts picom in my i3 config file. I'll need to look deeper into it.

- Apparently there are no layouts, so my tmux `leader+n` doesn't work out of the box. It seems to be possible to reimplement with custom lua functions
- I have to setup LSP lua to work in config file to get a better discoverability of the available configs.
- Espanso doesn't work out of the box for unicode characters: It works well with `:espanso ->  Hi there!` but it fails for `:+1: -> 👍`
- In nvim when two vertical splits are open, scrolling in one split messes up the rendering of the other split: The current buffer becomes unreadble because chunks of the screen are blank
- I have trouble reproducing but regularly when a pane is open with nvim for too long (I guess?) it seems like the pane brokes, it looks like we just quit we nvim but we can't interact with the tab anymore
