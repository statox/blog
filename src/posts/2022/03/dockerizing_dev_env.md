---
layout: layouts/post.njk
tags: ['post', 'docker', 'workflow']
date: 2022-03-30
title: Dockerizing a dev environment
commentIssueId: 33
---

⚠ This article is posted here so that I can find it back when I want to but it is just some rough note taking for myself. If you are not me, you probably have no interest in reading what's next.

### Step 1

Expose `python --version` to the shell

```dockerfile
FROM python:2

WORKDIR /usr/src/app

COPY pip_requirements.txt ./

RUN pip install --no-cache-dir -r pip_requirements.txt

CMD [ "python", "--version" ]
```

```shell
# Create the image
sdocker build -t dpython .

# Run the image and get the result of python --version
sdocker run -it --rm --name dpython dpython
# -> Python 2.7.18

# Create an alias to run the container
alias dpython='sdocker run -it --rm --name dpython dpython'
```

### Step 2

The container stops running immediately so we can't use `docker exec` on it.
Solution: Never ending entry point.
Not sure this is the best solution, check https://devopscube.com/keep-docker-container-running/ for other options.

```shell
FROM python:2

WORKDIR /usr/src/app

COPY pip_requirements.txt ./

RUN pip install -r pip_requirements.txt

ENTRYPOINT ["tail", "-f", "/dev/null"]
```

```bash
# Create the image with the right name
docker build . -t provisioning/tools

# Create a container
docker run -d -t --name provitools provisioning/tools

# Run a test command in the container
docker exec -ti provitools sh -c "echo a"
# -> a

docker exec -ti provitools sh -c "python --version"
# -> Python 2.7.18
```

### Step 3

Adding docker compose (maybe too early but at least it will be there)

`docker-compose.yml`
```dockerfile
version: '3.7'

services:
    provitools:
        container_name: provitools
        image: provisioning/tools
```

`build.sh`
```shell
#!/usr/bin/env bash
sudo docker build . -t provisioning/tools
sudo docker-compose build
```

`start.sh`
```shell
#!/usr/bin/env bash
sudo docker-compose up -d
```

```shell
# Create alias
alias provitools='docker exec -ti provitools sh -c '

# Run command in container
provitools "python --version"
# -> Python 2.7.18
```

### Step 4

Add access to provisioning directory

```dockerfile
version: '3.7'

services:
    provitools:
        container_name: provitools
        image: provisioning/tools
        volumes:
          - /home/adrien/projects/provisioning:/provisioning
```

```shell
alias ,provitools='sdocker exec -ti provitools sh -c '

touch test.file

,provitools ls
# -> Shows the test.file
```

### Step 5

Install jq dependency. Because the base image was python:2 the util `apt-utils` is not installed and that makes `apt` command fail. So we need to install it first

```dockerfile
FROM python:2

WORKDIR /provisioning

# This is necessary because without apt-utils the apt command doesn't install packages
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils

RUN apt update
RUN apt install -y jq

COPY pip_requirements.txt ./

RUN pip install -r pip_requirements.txt
# Yes this is the same command twice. Yes this is necessary. No do not delete it.
RUN pip install -r pip_requirements.txt

# CMD [ "bash", "--version" ]
ENTRYPOINT ["tail", "-f", "/dev/null"]
```


### Step 6

We can run ansible playbook. And (somehow?) `aws` is installed on the container 🤷

But it fails because aws doen't work.

First try: Share the `~/.aws` directory by adding this to `docker-compose.yml`

```dockerfile
        volumes:
          - /home/adrien/projects/provisioning:/provisioning
          - /home/adrien/.aws:/root/.aws
```

But `aws` say it was not configured. So we need to share some environment variables like `AWS_PROFILE` and `AWS_DEFAULT_PROFILE`.

So we update the alias:

```shell
alias ,ansible-playbook='sdocker exec -e AWS_PROFILE=$AWS_PROFILE -ti provitools ansible-playbook '
```

### Step 7

I am blocked because I need to forward my ssh agent.

I added `-e SSH_AUTH_SOCK=$SSH_AUTH_SOCK` to my alias but the directory is random one with each new invocation of the agent.

So I need to fix that.

[This](https://www.jamesridgway.co.uk/sharing-an-ssh-agent-between-a-host-machine-and-a-docker-container/) provides a solution but my `SSH_AUTH_SOCK` variable is empty


