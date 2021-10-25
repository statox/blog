---
layout: layouts/note.njk
tags: ['note', 'bash', 'ansible']
title: Ansible tips
---

### Run a command on several hosts

The documentation [Introduction to Ad Hoc commands](https://docs.ansible.com/ansible/latest/user_guide/intro_adhoc.html) is a great reference.

1. In the inventory file create the list of servers to target
```yml
[my_target_group_name]
host01.domain.ext
host02.domain.ext
host03.domain.ext
```

2. Run the command
```bash
ansible [target_group_name] -i path/to/inventory/file -m shell -a [your_command]

# Example
ansible my_target_group_name -i inventories/inventory -m shell -a 'df -h'
```

The module `shell` allows to run any shell command but one can use [any module](https://docs.ansible.com/ansible/latest/collections/index_module.html)

If you need to become root to run the command pass `--become` to the `ansible` command.

| Parameter                   | Description                                                  |
|-----------------------------|--------------------------------------------------------------|
| `--become`                  | Become root                                                  |
| `-u <username>`             | Change the username used                                     |
| `--ask-become-pass` or `-K` | Prompts you for the password to use for privilege escalation |
| `-f 10`                     | Change how many machines are targeted simultaneously         |


### Copying files between hosts

Refer to [this link](https://www.middlewareinventory.com/blog/how-to-copy-files-between-remote-servers-ansible-fetch-sync/)
