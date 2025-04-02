---
layout: layouts/post.njk
tags: ['post', 'codegolf', 'python', 'codingame']
date: 2025-01-20
title: Python codegolf tips
commentIssueId: 39
---

See also my [Javascript golf page](/posts/2021/05/javascript_golf_tips)

### Resources

Useful code to copy/paste in codingame "fastest" challenges:

```python
def log(*args): import sys; print(*args, file=sys.stderr)
```

### Input parsing

To call create an input from calling the same function several times:

```python
[input() for i in range(8)]

[i() for i in [input]*8]
[input() for _ in "1"*8]
```

Note that the list comprehension might be better in some cases. Example with [The Descent](https://www.codingame.com/ide/puzzle/the-descent-codesize) where we need to read a list of integers and return the index of the highest value:

```python
while m:=[input()for _ in "1"*8]:print(m.index(max(m)))
while 1:print(max([(input(),i)for i in range(8)])[1])
```

The list comprehension allows to create tuples with the value and the index. Iterating on `"1"*8` would not give us the incrementing index.
