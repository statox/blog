---
layout: layouts/note.njk
tags: ['note', 'ffmpeg', 'gif']
title: FFmpeg - Convert video to gif
---

After recording a screen cast with [SimpleScreenRecorder](https://www.maartenbaert.be/simplescreenrecorder/) on Ubuntu I use the following ffmpeg command to convert them to gif to be used on this blog.

```bash
ffmpeg -i input_file.mkv -vf "fps=10" -loop 0 output_file.gif
```

The quality is not the best, at one point I should take the time to find out how to do it well. I reused the command from [this SO answer](https://superuser.com/a/556031).
