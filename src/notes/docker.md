---
layout: layouts/note.njk
tags: ['note', 'docker']
title: Docker cheatsheet
---

[`docker exec` reference](https://docs.docker.com/engine/reference/commandline/exec/)

Run interactive shell on container
 ```bash
 docker exec -it <container_id> bash
 ```

Run command on container
 ```bash
docker exec -d <container_id> touch /tmp/test
 ```

Set an environment variable in the current bash session.

```bash
docker exec -it -e VAR=1 <container_id> bash
```

Select working directory for the command to execute into

```bash
 docker exec -it -w /root <container_id> pwd
```
