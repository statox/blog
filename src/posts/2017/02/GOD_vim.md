---
layout: layouts/post.njk
tags: ['post', 'vim']
date: 2017-02-01
commentIssueId: 2
title: GOD.vim - The easiest way to quote Vim's help
---

### I love to Quote the doc

I often participate on the [vi.stackexchange](https://vi.stackexchange.com) website because this community really helped me to get going with Vim when I first started using it and because it feels great to be able to help new vimmers.

When I write an answer I always try to think about how I can not only help the user to achieve what they want to do, but more importantly how I can help them to answer their own question next time they have one. And the best way to do that is to help them getting comfortable with the help.

Indeed Vim has an amazing built-in help system accessible directly from the editor itself using the command `:h`. So whenever I write my answers I do my best to add the relevant help topics. And I also like to add a link to one of the several online version of the help

- http://vimdoc.sourceforge.net/ That I used at first but the anchoring of the topics were not always deterministic so it was to practical to use.
- https://vimhelp.org/ Which I currently use.
- And even https://neovim.io/doc for neovim users.

### But it's painful

For a long time I just wrote the help command like `:h autocmd-events` in my answers but this was not convenient:

- First I have to do my own research in the help system, like any vimmer would do.
- Then I have to copy the help topic to my clipboard
- In the web interface I have to redundantly type the string `:h` and add the help topic.
- Then because I think new users are more inclined to read the doc if it is available right under their hand I look for the topic on an online version of the help
- Finally I can update my markdown with the right link

After doing that for a few months and feeling the pain I started creating a short hack in my `.vimrc` to improve this workflow, until the day I read [How can I quickly convert a Vim help tag to a vimhelp.appspot.com link?](https://vi.stackexchange.com/q/4346/1841). This question confirmed that this action was a pain point for other people and that pushed me to create a proper plugin.

### So let's create a plugin!

So I created [GOD.vim](https://github.com/statox/GOD.vim) this is a very simple plugin which goal is to easily get a markdown expression describing a help topic and linking to its online version. The plugin does the following:

- Create a new command `:GOD` which takes the exact same parameter as `:h`. The autcomplete behavior is completely duplicated thanks to [`:h :command-nargs`](http://vimhelp.appspot.com/map.txt.html#%3Acommand-nargs) and [`:h :command-complete`](http://vimhelp.appspot.com/map.txt.html#%3Acommand-complete), see [how I create the command](https://github.com/statox/GOD.vim/blob/bed2a6fe9458284760d6fb5f08495e6579ce69dd/plugin/GOD.vim#L16):
    ```vim
    command! -nargs=+ -complete=help GOD call GOD#GetOnlineDoc('vimhelp', <f-args>)
    ```
- Open the corresponding help page, parse the help topics under the cursor and get the first one.
- Use this string to build a URL to the relevant help website.
- Use this URL to generate a markdown template of the form `[:h help-topic](https://url-of-the-help.com/escaped-help-topic)`
- Copy this template to the clipboard.

I also added some additional features:

- Being able to link either to the vim help or the neovim help using respectively `:GOD` and `:NGOD`
- Being able to have a nicely formatted markdown list if several help topics are given as parameters to the command.

I think the trickiest part about writing this plugin was to create a pure vimscript encoding function to handle the URLs. Indeed a lot of help topics have some characters which need to be URL encoded. The first version of my encoding function didn't work very well but fortunately I got the help of great developers from the [vi.stackexchange](https://vi.stackexchange.com) community, namely [Luc Hermitte](https://luchermitte.github.io/) and [Martin Tournoij](https://www.arp242.net/) who helped me with different parts of this plugin and in particular who helped me coming up with this function:

```vim
" Encode url
function! s:URLEncode(str) abort
    " Replace each non hex character of the string by its hex representation
    return join(map(range(0, strlen(a:str)-1), 'a:str[v:val] =~ "[a-zA-Z0-9\-._]" ? a:str[v:val] : printf("%%%02x", char2nr(a:str[v:val]))'), '')
endfun
```

It takes an help topic as a parameter like `/\@<=`, iterates on each characters of the string and if the character doesn't match `/[a-zA-Z0-9\-._]/` (i.e. characters which don't need to be URL encoded) it uses [`:h char2nr()`](http://vimhelp.appspot.com/eval.txt.html#char2nr%28%29) to get the numerical value of the character and passes this value to [`:h printf()`](http://vimhelp.appspot.com/eval.txt.html#printf%28%29).

Here `printf()` is used with the following format: `%%%02x`:

- `%%` is used to insert a litteral `%` character (which is used in URL encoding to specify encoded characters)
- `%02x` is used to get the hex value of the character. `02` is the number of `0` to use for the padding.

With our example topic `/\@<=` the function returns `%2f%5c%40%3c%3d`.

### Field tested

I've been using this plugin regularly for several years now and I don't recall encountering a topic which didn't work well. And of course it is always a great satisfaction to create a tool that you still continue to use several years after you first needed it!

The sources of the plugin and its documentation are [on Github](https://github.com/statox/GOD.vim)
