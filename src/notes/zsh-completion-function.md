---
layout: layouts/note.njk
tags: ['shell', 'zsh']
title: Zsh completion functions
---

A quick trick to have custom completion on the aliases I create.

First create the function and the alias, they can be in `~/.bash_aliases` or whatever.

```bash
myCoolFunction() {
    echo "Here are the args from my function $@"
}
alias mcf='myCoolFunction'
```

Then create the completion function (best practice `underscore+function name`) which can be anywhere too. An interesting list of the helpers provided by zsh for the completion functions is [here](https://github.com/zsh-users/zsh-completions/blob/master/zsh-completions-howto.org).

```bash
# Suggest words as completion options
_myCoolFunction() {
    compadd "$@" foo bar baz
}

# Or have completion options with additional description
_myCoolFunction() {
    local -a options
    options=(
        'arg1:To do something'
        'arg2:To do something else'
        'arg3:A different argument'
    )
    _describe 'mcf' options
}
```

Finally *in `~/.zshrc`* we can register `_myCoolFunction` as the completion function of `myCoolFunction`:

```bash
compdef _myCoolFunction myCoolFunction
```

Once everything is ready in a new shell typing `mcf <TAB>` should yield the 3 completions options.

If things don't work one can check the completion function for a particular function *(It does not work with the alias)* with:

```bash
echo $_comps[myCoolFunction]
```

and the implementation with

```bash
functions $_comps[myCoolFunction]
```

Finally I should check how to make it work with the defined files (`~/.oh-my-zsh/completions`) and understand why the `compdef` command only works when put in `.zshrc`.
