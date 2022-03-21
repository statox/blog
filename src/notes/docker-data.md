---
layout: layouts/note.njk
tags: ['note', 'docker']
title: Docker move data directory
---

Instructions copied from [this site](https://www.guguweb.com/2019/02/07/how-to-move-docker-data-directory-to-another-location-on-ubuntu/)


By default Docker stores its data in `/var/lib/docker`

To move this data:

1. `sudo service docker stop`
1. Add this to `/etc/docker/daemon.json` (file might not exist)

       {
           "data-root": "/path/to/your/docker"
       }

1. `sudo rsync -aP /var/lib/docker/ /path/to/your/docker`
1. `sudo mv /var/lib/docker /var/lib/docker.old`
1. `sudo service docker start`
1. Test
1. `sudo rm -rf /var/lib/docker.old`
