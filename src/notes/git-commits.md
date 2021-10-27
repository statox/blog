---
layout: layouts/note.njk
tags: ['note', 'git', 'commit']
title: Fixing commits in git
---

This link is dope https://sethrobertson.github.io/GitFixUm/fixup.html
(And someone made a better UI [here](https://sukima.github.io/GitFixUm/))

TODO: Extract the ones I need but can never remember

### Remove commit from history

_Reminder on zsh escape `^` in `HEAD^` with `HEAD\^`_

Remove the last commit from history but keep the working tree

    git reset HEAD^

Remove the last commit of the history completely **and discard changes**

    git reset --hard HEAD^ # THIS DISCARDS CHANGES

### Sign an older commit in your branch

This will do an interactive rebase, playing `git commit --amend --no-edit -n -S`
after each commit

_(Check if `-n` is useful I can't find it in the man)_

    git rebase --exec 'git commit --amend --no-edit -n -S' -i my-branch

### Change the date of a commit

Additional details in [this SO answer](https://stackoverflow.com/a/3898842)

```bash
GIT_COMMITTER_DATE="Wed, 28 Jul 2021 08:12:19 +0200" GIT_AUTHOR_DATE="Wed, 28 Jul 2021 08:12:19 +0200" git commit
```

Date formats

```
Git internal format = <unix timestamp> <time zone offset>, e.g.  1112926393 +0200
                    <unix timestamp> is the number of seconds since the UNIX epoch.
                    <time zone offset> is a positive or negative offset from UTC. (E.g CEST is +0200)
RFC 2822            = e.g. Thu, 07 Apr 2005 22:13:13 +0200
ISO 8601            = e.g. 2005-04-07T22:13:13
```
