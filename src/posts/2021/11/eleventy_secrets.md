---
layout: layouts/post.njk
tags: ['post', 'eleventy', 'meta']
date: 2021-11-08
title: Managing a secrets directory in your eleventy site
commentIssueId: 30
---

This blog is a platform for me to experiment with front end technologies and to write about random stuff I do on my free time. I keep everything versioned [on Github](https://www.github.com/statox/blog) in a public repository because it's easy and because so far I didn't have anything to keep secret in this repo. This changed recently so I decided to use [`EncFS`](https://vgough.github.io/encfs/) to keep secret files encrypted in my Github repo and have them easily accessible on my local copy of the repo. Here is how I did it.


### Context and requirements

Recently I started to collect pieces of wisdom I hear at my workplace, I'm still not sure what I'll do with these but I want to keep a track of them somewhere and this blog's repo is an easy place. So I started writing a couple of them in a draft and I also wrote the name of the coworkers who gave me these pieces of advice. Before I committed the document I realized that I was about to publish some personal thoughts by some people I really appreciate without asking for their consent, which is not great.

So here is what I wanted to have:

- The ability to create new "secret" pages on this blog like I do with any other article.
- They should be easily accessible on my local clone and they should be handled by eleventy on my local build.
- They should not be built by eleventy on the CI I use to deploy the blog.
- They should be versioned in the repo so that I don't have to keep track of data on different places.
- The solution should work on Linux and I don't really care about the other OSes as I don't use them (though my solution also works on MacOS)

To do that I opted the following solution:

- I will have a `src/.secrets` directory in my repo. This directory will hold my secret files encrypted.
- I will have another directory `src/secrets/` in which the secrets will be decrypted when I build the site locally, eleventy will have to build this directory too.
- To make things easy I will have the decryption script running in the CI I use locally when building my site.

### The tool

I'll be using [`EncFS`](https://vgough.github.io/encfs/) a tool providing an encrypted file system in the user space: It translates the file system operations one would be doing into the equivalent encrypted operations on the file system.

The usage is quite simple:

```bash
encfs /path/to/secrets/ /path/to/cleartext
```

This command will take the `/path/to/secrets/` directory and mount it in `/path/to/cleartext/` one can then add any file or directory to the second directory and they will be stored encrypted in the first one.

### Creating the directories

The first step is to create my two directories in my repo:

```bash
mkdir -p src/.secrets src/secrets
```

Then setting up the encrypted file system, one important detail: `encfs` only takes absolute paths so one can use `${PWD}` to avoid writing the whole path:

```bash
encfs ${PWD}/.secret ${PWD}/secret
```

On the first invocation `encfs` will show a prompt with several options to configure the encrypted volume, I didn't input anything as the standard mode seemed enough to me.

Then it asks for a password which will be used to encrypt/decrypt the volume. I used a strong password as my encrypted files will be available to anyone on Github I don't want the password to be easily brute forced. (You can go with 50+ characters and use a password manager instead of your brain or a post-it note)

Once this is done a new file is created in the secret repository holding the configuration for next `encfs` invocations. From now on and until I unmount the clear directory everything new file I create in it will be stored encrypted in the secret directory.

### Adding some wrappers

Now I want this encrypted directory to be as seamless as possible in my local workflow, so I created the two following bash scripts:

```bash
# decrypt_secrets.sh

#!/usr/bin/env bash
CLEAR_DIR='src/secrets'
SECRET_DIR='src/.secrets'

# Check if their are some files in the clear directory
if [ -n "$(ls -A $CLEAR_DIR 2>/dev/null)" ]
then
  echo "Secrets repository seems already decrypted."
  exit 0
fi

mkdir -p "$CLEAR_DIR"
encfs "${PWD}/$SECRET_DIR" "${PWD}/$CLEAR_DIR"
```

This script will be run when I build my site locally so it does the following:

- Check that the clear directory is empty. If it's not it means that I had already mounted the secret directory so I can skip what's next.
- Create the clear directory if needed.
- Use `encfs` to mount the decrypted directory.

```bash
# unmount_secrets.sh

#!/usr/bin/env bash
CLEAR_DIR='src/secrets'
fusermount -u "${PWD}/$CLEAR_DIR"
```

This one is not in my local CI. I use it when I'm done working to unmount the clear directory.


### Configuring my build

With the `decrypt_secrets.sh` wrapper created I can update my `package.json`:

```json
    "scripts": {
        "dev": "npm run build:clean && npm run secrets:decrypt && ELEVENTY_ENV=dev npx @11ty/eleventy --input=src --output=docs --serve",
        "build": "ELEVENTY_ENV=prod npx @11ty/eleventy --input=src --output=docs",
        "build:clean": "rm -rf docs",
        "secrets:decrypt": "./tools/secrets/decrypt_secrets",
        "secrets:unmount": "./tools/secrets/unmount_secrets"
    },
```

So now when I use `npm run dev` in my local environment my decryption script is run. However when my CI on Github runs `npm run build` my secrets are kept safe.


### Setting up the ignores

There is one last piece of configuration to add: the ignored files. Until now I only add a `.gitignore` file in my repo which had two purposes:

- It prevented me to track changes in `node_modules/` and `docs/` (my local build file)
- And it also prevented eleventy to try to build these directories.

Now I have a new directory `src/secrets` which I want eleventy to build (locally) but I don't want to track on git (since that would completely destroy the purpose of all this encryption thing I've been doing).

So I had to do the following:

- First tell eleventy to not use the `.gitignore` file. This is done by adding this to my `.eleventy.js` config file. Now git will still respect `.gitignore` but eleventy will use the `.eleventyignore` file to exclude files from the build.

      eleventyConfig.setUseGitIgnore(false);

- Then my `.gitignore` remains untouched
- And finally I added `.eleventyignore` with the following content:

      node_modules/
      docs/
      src/secrets/

### Voila!

With this setup I was able to add my secret list of pieces of wisdom to my `src/secrets/` directory, see it build when I run `npm run dev`, commit the content of `src/.secrets/` once I was done and push the encrypted version of my file on Github 🎉
