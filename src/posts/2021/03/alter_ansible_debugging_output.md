---
layout: layouts/post.njk
tags: ['post', 'ansible']
date: 2021-03-17
title: Alter Ansible's output on debugging
commentIssueId: 24
---

Who knew that ansible output could be actually readable? 💡

Yesterday I saw [this post](https://jpmens.net/2021/03/12/alter-ansible-s-output-on-debugging/) on lobste.rs showing how changing the environment variable `ANSIBLE_STDOUT_CALLBACK` to `yaml` helps improving the output of the `ansible-playbook` command. While I was happy to find a way to improve readability there were two things which didn't fit my needs:

-   First, the author uses a wrapper script to call `ansible-playbook` and I regularly call the command directly from the command line so I needed something directly available and transparent.
-   Secondly, the author `export`s the `ANSIBLE_STDOUT_CALLBACK` variable so if I want to get rid of the yaml formatting I need to change the variable manually again.

So I came up with a short solution to be added to one's `.bash_aliases` (or any prefered rc file holding your aliases):

```bash
alias ansible-playbook='ansiblePlaybookDebug'
function ansiblePlaybookDebug {
    export ANSIBLE_STDOUT_CALLBACK=default
    echo -n "$@" | grep -q -- "-v" && export ANSIBLE_STDOUT_CALLBACK=yaml

    'ansible-playbook' "$@"
}
```

The idea is to create a bash function `ansiblePlaybookDebug` which greps on its parameters and sets `ANSIBLE_STDOUT_CALLBACK` to `yaml` if `-v` was passed and otherwise keeps the variable to `default`. Then the parameters are passed to the original `ansible-playbook` command.

Then the alias `ansible-playbook` is created to replace the original command by the new function.

This way when you use `ansible-playbook myplaybook.yml ....` you get the same output as usual, but when things go down and you need you add one (or more) `-v` flags the ouput is nicely formatted and you get this:

```yaml
fatal: [localhost]: FAILED! => changed=true
cmd: naught deploy --override-env true --cwd /home/ubuntu/project /home/ubuntu/project/shared/naught.ipc
delta: '0:00:00.045878'
end: '2021-03-17 09:12:31.012211'
msg: non-zero return code
rc: 1
start: '2021-03-17 09:12:30.966333'
stderr: |-
  unable to connect to ipc-file `/home/ubuntu/project/shared/naught.ipc`

  1. the ipc file specified is invalid, or
  2. the daemon process died unexpectedly
stderr_lines:
- unable to connect to ipc-file `/home/ubuntu/project/shared/naught.ipc`
- ''
- 1. the ipc file specified is invalid, or
- 2. the daemon process died unexpectedly
stdout: ''
stdout_lines: <omitted>
```

Instead of this:

```json
fatal: [localhost]: FAILED! => {"changed": true, "cmd": "naught deploy --override-env true --cwd /home/ubuntu/project /home/ubuntu/project/shared/naught.ipc", "delta": "0:00:00.052263", "end": "2021-03-17 09:11:32.504379", "msg": "non-zero return code", "rc": 1, "start": "2021-03-17 09:11:32.452116", "stderr": "unable to connect to ipc-file `/home/ubuntu/project/shared/naught.ipc`\n\n1. the ipc file specified is invalid, or\n2. the daemon process died unexpectedly", "stderr_lines": ["unable to connect to ipc-file `/home/ubuntu/project/shared/naught.ipc`", "", "1. the ipc file specified is invalid, or", "2. the daemon process died unexpectedly"], "stdout": "", "stdout_lines": []}
```

This also has the advantage of letting you alternating between `-v` and no debug calls with the appropriate formatting and it also works from a wrapper script.

<!-- vim: set spell: -->
