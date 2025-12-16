---
layout: layouts/post.njk
tags: ['post', 'terminal', 'wezterm', 'neovim', 'linux']
date: 2025-12-16
title: Synchronized colorscheme toggling for WezTerm and Neovim
commentIssueId: 41
---

**TL;DR**: I wanted a keybinding to toggle between light and dark colorschemes and have the change apply immediately to all my WezTerm windows and Neovim instances across multiple running processes, using pure Lua configurations. If you want to skip the context and jump straight to the implementation, [go to the solution](#the-solution%3A-high-level-overview).

---

Recently I've been reworking my terminal setup. After years of using gnome-terminal with tmux, I made the jump to [WezTerm](https://wezfurlong.org/wezterm/) and replaced most of my tmux workflow with WezTerm's built-in features. The switch has been great overall, and it was the opportunity to tackle an issue which had been bothering me for a long time: I couldn't easily toggle between light and dark colorschemes and have the change apply to both my terminal and all my Neovim instances simultaneously.

In this article I'll show how I solved this problem using a shared state file and some file watching magic. If you're using WezTerm and Neovim and want synchronized colorscheme switching, this might give you some ideas for your own setup.

### The context

For colorschemes I've been using [nightfox.nvim](https://github.com/EdenEast/nightfox.nvim), specifically the `nightfox` variant for dark mode and `dayfox` for light mode. During the day I prefer a light theme, but when evening comes I want to switch to something easier on the eyes. One advantage of WezTerm is that by default it bundles a lot of colorschemes including the nightfox ones I was already using in Neovim.

I'm not using system-wide light/dark theme settings because I haven't integrated that well with my i3 window manager setup yet. That might change in the future, but for now I wanted something simpler that I could control directly from my terminal.

Here's what makes this tricky: I often have multiple WezTerm instances running at the same time. One for my frontend repo, another for backend, maybe a third for some side project. Each instance has several windows (the WezTerm name for tmux "tabs"), and potentially multiple Neovim instances spread across different windows. When I toggle between light and dark mode, I want all of them to update immediately.

### The problem

What I needed was:

- A keybinding in WezTerm to toggle between light and dark themes
- All WezTerm windows (across multiple instances) to update their colorscheme
- All Neovim instances to update their colorscheme automatically
- Everything to happen immediately, without manual intervention
- A pure Lua implementation without relying on shell commands for file operations

This seemed like it should be a common use case, but I couldn't find an existing solution that did exactly what I wanted.

### What others have tried

I did some research and found that other people have faced similar issues, but the solutions weren't quite right for my needs:

[This Reddit thread](https://www.reddit.com/r/neovim/comments/19bb3e1/consistent_neovimwezterm_colorscheme/) describes using a file to store the colorscheme name, but Neovim is responsible for changing the file. I wanted WezTerm to be in control. Also, their solution requires manually restarting WezTerm or reloading its config to apply changes.

[This GitHub discussion](https://github.com/wezterm/wezterm/discussions/3426#discussioncomment-9724438) has WezTerm updating the file, which is closer to what I wanted, but Neovim needs to be manually restarted to pick up the new colorscheme. Also, it relies on spawning a subprocess to run `echo` to write to the file. I wanted a pure Lua solution.

[This blog post](https://blog.tymek.dev/automatically-changing-theme-in-the-terminal/) has an interesting approach where Neovim changes are based on the [`FocusGained`](https://neovim.io/doc/user/autocmd.html#FocusGained) autocommand event. The problem is that you need to remove and add focus to potentially all running Neovim instances for this to work, which is not ideal when you have many of them.

None of these solutions gave me the immediate, automatic synchronization I was looking for, so I decided to build my own.

### My initial attempts

Before settling on the file-based approach, I tried a couple of other ideas that didn't quite work out:

First, I experimented with using an environment variable to share the colorscheme state between WezTerm and Neovim. The problem was timing and environment variables scope: I needed to set the environment variable before WezTerm reads its configuration, and then update it when toggling. I couldn't find a convenient way to make this work, especially since environment variables set in a running WezTerm instance wouldn't propagate to other already-running instances.

I also tried using WezTerm's [`window:set_config_overrides()`](https://wezterm.org/config/lua/window/set_config_overrides.html) API, which allows changing configuration for a specific window at runtime. This seemed promising at first, but the overrides only applied to the single window where the keybinding was pressed, not to all WezTerm instances. This meant I'd still need some way to communicate the colorscheme change to other instances, bringing me back to square one.

These experiments led me to realize that what I needed was a simple shared state mechanism that all instances could monitor independently. That's when I landed on the file-based approach.

### The solution: High level overview

My approach uses a simple shared state file that both applications can read and watch for changes. Here's how it works:

The setup relies on a file at `/tmp/colorscheme` which contains a single line with either `light` or `dark`.

**On the WezTerm side:**

1. On startup, check for the file `/tmp/colorscheme`. If it doesn't exist, create it with a default value.
2. Read the file content and set the colorscheme accordingly (light → dayfox, dark → nightfox).
3. Provide a keybinding that reads the file, writes the opposite value, and reloads the configuration.

**On the Neovim side:**

1. On startup, read `/tmp/colorscheme` and set the appropriate colorscheme.
2. Set up a file watcher that monitors the file for changes.
3. When the file changes, automatically update the colorscheme.

The advantage of this approach is that WezTerm controls the toggle and all instances of both applications react immediately because they're all watching the same file.

### Implementing the WezTerm side

The WezTerm implementation is split across a few modules to keep things organized. Let's walk through the key parts.

#### Managing colorscheme state

First, I created a `colorscheme.lua` module to handle reading, writing, and toggling the colorscheme state:

```lua
local module = {}

local light_colorscheme = 'dayfox'
local dark_colorscheme = 'nightfox'

-- Shared state file: written by WezTerm, watched by Neovim
local colorscheme_file_path = '/tmp/colorscheme'

module.default_colorscheme_mode = "light"

function create_colorscheme_file()
    local file = io.open(colorscheme_file_path, "w")
    file:write(module.default_colorscheme_mode)
    file:close()
end

function read_colorscheme_file()
    local file = io.open(colorscheme_file_path, "r")
    content = file:read()
    file:close()
    return content
end

function init_colorscheme()
    local success, content = pcall(read_colorscheme_file)

    if not success then
        wezterm.log_info('Could not read file content, using default')
        create_colorscheme_file()
        content = module.default_colorscheme_mode
    end

    if not (content == "light" or content == "dark") then
        wezterm.log_info('Invalid mode in file, using default', content)
        content = module.default_colorscheme_mode
    end

    if content == "light" then
        return light_colorscheme
    end

    return dark_colorscheme
end
module.init_colorscheme = init_colorscheme
```

The `init_colorscheme()` function does the heavy lifting: it reads the state file, handles cases where the file doesn't exist or contains invalid data, and returns the appropriate colorscheme name to use in the WezTerm configuration. The use of [`pcall()`](https://www.lua.org/manual/5.4/manual.html#pdf-pcall) (protected call) is important here: it executes the `read_colorscheme_file()` function in protected mode, catching any errors (like the file not existing) and returning a success status instead of crashing. If the call fails, we create the file with a default value.

The file operations use Lua's standard I/O library: [`io.open()`](https://www.lua.org/manual/5.4/manual.html#pdf-io.open) opens a file and returns a file handle, and [`file:read()`](https://www.lua.org/manual/5.4/manual.html#pdf-file:read) reads its content. These are pure Lua functions, no shell commands needed.

See [the complete `colorscheme.lua` file on GitHub](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/wezterm/colorscheme.lua)

#### Toggling the colorscheme

The toggle function is straightforward. It reads the current mode, writes the opposite value to the file, and triggers a configuration reload:

```lua
function module.toggle_colorscheme(window, pane, config)
    local success, content = pcall(read_colorscheme_file)

    -- Lua's ternary-like expression: if content is "light", return "dark", else "light"
    local new_value = content == "light" and "dark" or "light"
    local file = io.open(colorscheme_file_path, "w")
    if file then
        file:write(new_value)
        file:close()
    end

    -- We reload the config which triggers setup_ui() which uses
    -- init_colorscheme() to setup the colorscheme based on the file content
    wezterm.reload_configuration()
end
```

When `wezterm.reload_configuration()` is called, it re-runs the entire configuration, which calls `init_colorscheme()` again and picks up the new value from the file.
**Note** Another approach is possible here: Rather than manually calling `wezterm.reload_configuration()` it is possible to use `wezterm.add_to_config_reload_watch_list('/tmp/colorscheme')`. With this config WezTerm will automatically reload its configuration when the file is changed. This could open the way to have a third party script controlling the colorscheme (for example a cronjob change the theme based on the time of the day).

#### Integrating into the main config

In my `ui.lua` module, I call `init_colorscheme()` during setup:

```lua
local colorscheme = require 'colorscheme'

function module.setup_ui(config)
    config.font_size = 11
    config.color_scheme = colorscheme.init_colorscheme()

    -- ... rest of UI configuration
end
```

And in the main `wezterm.lua` file, everything comes together:

```lua
local wezterm = require 'wezterm'
local ui = require 'ui'
local mappings = require 'mappings'

local config = wezterm.config_builder()

ui.setup_ui(config)
mappings.setup_bindings(config)

return config
```

See [the complete `ui.lua`](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/wezterm/ui.lua) and [`wezterm.lua` files on GitHub](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/wezterm/wezterm.lua)

#### Setting up the keybinding

Finally, in `mappings.lua`, I bind the toggle function to `<leader>f`:

```lua
local colorscheme = require 'colorscheme'

function module.setup_bindings(config)
    config.leader = { key = ' ', mods = 'CTRL', timeout_milliseconds = 1000 }

    config.keys = {
        -- ... other keybindings

        -- Toggle light and dark colorscheme
        {
            key = 'f',
            mods = 'LEADER',
            action = wezterm.action_callback(function(window, pane)
                colorscheme.toggle_colorscheme(window, pane)
            end)
        },
    }
end
```

With this setup, pressing `Ctrl+Space` (my leader key) followed by `f` will toggle between light and dark modes.

See [the complete `mappings.lua` file on GitHub](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/wezterm/mappings.lua#L74)

![Demonstration of pressing the keybinding in WezTerm and seeing all terminal windows update their colorscheme simultaneously from light to dark mode](../../../../images/wezterm_neovim_synced_colorscheme/wezterm_1.gif)

<center>
<i>This demonstration starts with an empty i3 workspace, I use <kbd>super</kbd>+<kbd>Enter</kbd> to start a new Wezterm instance which uses light mode. Then <kbd>ctrl+space</kbd>+<kbd>f</kbd> to switch to dark mode. Then I start a second Wezterm instance in a vertical split and toggle the theme for both instances a couple times more with <kbd>ctrl+space</kbd>+<kbd>f</kbd></i>
</center>

### Implementing the Neovim side

The Neovim side is simpler but requires setting up a file watcher. I put everything in a `colorscheme_watcher.lua` file.

#### Setting up the file watcher

I adapted some code from [fwatch.nvim](https://github.com/rktjmp/fwatch.nvim) to create a lightweight file watcher. The core functionality uses Neovim's built-in [`vim.loop`](https://neovim.io/doc/user/lua.html#vim.uv) (the Lua bindings for the libUV library that Nvim uses for networking, filesystem, and process management):

```lua
local uv = vim.loop

local function watch_with_function(path, on_event, on_error)
    local handle = uv.new_fs_event()

    local flags = {
        watch_entry = false,
        stat = false,
        recursive = false
    }

    local event_cb = function(err, filename, events)
        if err then
            on_error(error, unwatch_cb)
        else
            on_event(filename, events, unwatch_cb)
        end
    end

    uv.fs_event_start(handle, path, flags, event_cb)

    return handle
end
```

The [`vim.loop.new_fs_event()`](<https://neovim.io/doc/user/luvref.html#uv.new_fs_event()>) API provides access to the operating system's file watching capabilities (inotify on Linux, FSEvents on macOS, etc.). When the file changes, our callback function gets executed.

#### Reading and applying the colorscheme

I created functions to read the state file and update the colorscheme accordingly:

```lua
function read_colorscheme_file()
    local filepath = "/tmp/colorscheme"

    -- Read the first line of the file
    local content = vim.fn.readfile(filepath, '', 1)[1] or ""

    if string.match(content, "light") then
        return "light"
    end
    if string.match(content, "dark") then
        return "dark"
    end

    -- Default case
    return "dark"
end

function update_colorscheme()
    if read_colorscheme_file() == "light" then
        vim.g.colorsDefault = "dayfox"
        vim.g.colorsDiff = "dayfox"
    else
        vim.g.colorsDefault = "nightfox"
        vim.g.colorsDiff = "nordfox"
    end

    vim.cmd("colorscheme " .. vim.g.colorsDefault)
end
```

The [`vim.cmd()`](https://neovim.io/doc/user/lua.html#vim.cmd%28%29) function executes a Vim command, so `vim.cmd("colorscheme " .. vim.g.colorsDefault)` is equivalent to running `:colorscheme nightfox` in normal mode, with the colorscheme name taken from our variable.

I use different colorschemes for diff mode, which is why I set both `colorsDefault` and `colorsDiff` variables.

#### Putting it all together

Finally, I set up the colorscheme on Neovim startup and register the file watcher:

```lua
-- Setup the colorscheme on startup
update_colorscheme()

-- Update the colorscheme when WezTerm updates the colorscheme file
do_watch('/tmp/colorscheme', {
    on_event = function()
        print('Colorscheme file has changed.')
        -- We wrap update_colorscheme in vim.schedule because the Vimscript function
        -- "readfile" must not be called in a fast event context
        vim.schedule(update_colorscheme)
    end
})
```

The [`vim.schedule()`](https://neovim.io/doc/user/lua.html#vim.schedule%28%29) wrapper is important here. The file watcher callback runs in a "fast event" context where certain functions like [`readfile()`](https://neovim.io/doc/user/vimfn.html#readfile%28%29) are not allowed. By wrapping our update function in `vim.schedule()`, we defer its execution to a safe context.

See [the complete `colorscheme_watcher.lua` file on GitHub](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/nvim/lua/colorscheme_watcher.lua) which is then `require`d [in my `init.lua` file](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/config/nvim/init.lua#L25).

![Screen recording showing multiple Neovim windows with different files open, and when the colorscheme file changes, all windows immediately switch from dayfox (light) to nightfox (dark) colorscheme](../../../../images/wezterm_neovim_synced_colorscheme/wezterm_2.gif)

<center>
<i>This demonstration starts with two WezTerm instances next to each other containing each two splits. In each instance there is a neovim instance and some command outputs (<code>git status</code> and <code>man git</code>). I use <kbd>ctrl+space</kbd>+<kbd>f</kbd> to toggle between light mode and dark mode. We can observe a slight delay before all applications colorscheme are updated.</i>
</center>

### How it all works together

Here's what happens when I press my toggle keybinding:

1. WezTerm's toggle function reads `/tmp/colorscheme` (let's say it contains "light")
2. It writes "dark" to the file
3. WezTerm reloads its configuration, which reads the file and sets `color_scheme = 'nightfox'`
4. All WezTerm windows across all instances update to the dark theme
5. Simultaneously, all running Neovim instances detect the file change via their watchers
6. Each Neovim instance executes its callback, which reads the new value and runs `:colorscheme nightfox`
7. All Neovim windows update to the dark theme

The whole process happens in a fraction of a second, giving the impression that everything updates simultaneously.

### Reflections

I'm fairly happy with how this feature turned out. The implementation is simple and after a few days of use, it's working well. When I press the keybinding in any WezTerm instance, every terminal window and every Neovim instance updates immediately. No manual intervention needed, no focus juggling, no restarts. I should mention that I've only tested this on Ubuntu with i3, so your mileage may vary on other systems.

Using a simple text file for state management might seem primitive, but it's actually good enough for this use case. Both applications can easily read and write to it, the file system provides the notification mechanism through the watchers, and there's no complex IPC to set up or maintain.

Note that for my shell I use zsh+oh-my-zsh with fairly minimal colors configuration which makes that the shell remains readable with both colorschemes. I also have a couple color configurations happening in my [`gitconfig`](https://github.com/statox/dotfiles/blob/98060bd83c124dd396885749ad79b831157c27d7/gitconfig#L29) but again they work well with both colorschemes.

### What about system-wide settings?

For now, I'm manually controlling my colorscheme with a keybinding, but WezTerm actually has built-in support for detecting the system appearance (light or dark mode). The documentation shows how to use [`wezterm.gui.get_appearance()`](https://wezterm.org/config/lua/wezterm.gui/get_appearance.html) to automatically switch based on your system settings.

I think my current setup would be fairly easy to adapt for this. Instead of using a keybinding to toggle the state file, I could run a background process that watches for system appearance changes and updates `/tmp/colorscheme` accordingly. That way, when I toggle dark mode in my system settings, both WezTerm and Neovim would follow along automatically. And that would also allow my browsers and other GUI applications to be synced with the terminal.

But for now, the manual toggle is working well for me, and I haven't dedicated time to integrate with system-wide settings yet.

### Make it yours

If you want to try this approach in your own setup, all the code is available in [my dotfiles repository](https://github.com/statox/dotfiles/tree/98060bd83c124dd396885749ad79b831157c27d7). The main files you'll need are:

- `config/wezterm/colorscheme.lua`: Manages the state file and toggle logic for WezTerm
- `config/wezterm/ui.lua`: Integrates the colorscheme into WezTerm's configuration
- `config/wezterm/mappings.lua`: Sets up the keybinding
- `config/nvim/lua/colorscheme_watcher.lua`: Implements the file watcher and colorscheme updates for Neovim

You can easily adapt this to use different colorschemes, a different state file location, or even extend it to have an external scrip change the colorscheme file based on your location and the time of the day. The file-based approach is flexible enough to support a lot of different use cases. (Though it might not be wise to re-create a complete external configuration system outside the default config)

If you implement something similar or have ideas for improvements, I'd love to hear about it in the comments!
