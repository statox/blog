---
layout: layouts/note.njk
tags: ['note', 'bash', 'xargs']
title: Xargs
---

Super useful [opinionated guide to xargs](https://www.oilshell.org/blog/2021/08/xargs.html)
### Examples

```bash
# Don't slip input
# echo "alice bob" | xargs echo hi
hi alice bob

# Split input by whitespace and specify a number for each command
# echo "alice bob" | xargs -n 1 echo hi
hi alice
hi bob

# echo "alice bob oscar leon" | xargs -n 2 echo hi
hi alice bob
hi oscar leon

# Split input by new line
# ls | egrep 'pack' | xargs -d $'\n' -- ls -l
-rw-rw-r-- 1 afabre afabre   1286 août  21 21:05 package.json
-rw-rw-r-- 1 afabre afabre 162685 août  21 21:05 package-lock.json

# Run in parallel with -P
xargs -P
