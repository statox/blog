---
layout: layouts/post.njk
tags: ['post', 'meta']
date: 2020-07-14
title: Comments via Github issues
commentIssueId: 10
---

Recently, a former coworker of mine [published his solution](https://25.wf/posts/2020-06-21-comments.html) to implement comments on his personal website via Github issues. I was looking for a solution to add comments on this site and decided to ~~shamelessly copy~~ get inspiration from his post.

So I reformatted a bit his script, added it to my posts and realized that this solution implied to create a new issue on Github each time I created a new post. As I already use [travis-ci](https://travis-ci.com/github/statox/blog) to build this website I thought it would be a nice addition to create a script to automatically create these issues for me.

The full source of the script is included in the site repository [here](https://github.com/statox/blog/blob/master/tools/createIssues.js), in this article I will show how I configured everything.

### Overview

Here are the important steps to make all of this working:

 - Create a dedicated repo [blog-comments](https://github.com/statox/blog-comments/issues) which will contain the issues used to host comments;
 - Have the CI run the script each time a new article is published;
 - Give the script the ability to create new issues in the blog-comments repo;
 - Give each post a unique number representing the issue ID on Github. [Eleventy](https://www.11ty.dev/docs/data-cascade/) provides a simple way to do that;
 - Make the script parsing all the published posts, listing the posts without an associated issue and creating the issues;
 - Change the posts source code to inject the comments.

### A quick update

_November 2020 -_ When I originally wrote the script I didn't want to think too much about the authentication to Github API and chose to go the simple way using a login/password basic auth header. This worked well until Github decided to deprecate this authentication mode.

So I replaced the calls made to Github API via axios by the [octokit](https://github.com/octokit/rest.js) library. It wraps the calls to the API and it handles the authentication really simply and replacing the axios calls were only a matter of minutes _(I take that as a sign that my script was decently architectured 😎)_.

The complete version of the script is still [on Github](https://github.com/statox/blog/blob/061b79001fda91c7c8b4bb72147247a4e24eff11/tools/createIssues.js).

_February 2022 -_ I just found out about [utteranc.es](https://utteranc.es/) which is an open source tool allowing to do exactly the same thing as this project but the configuration seems a bit easier.

### Configuring travis-ci

Running a script at build time with travis-ci is fairly straight forward. I added a new step in the `script` job looking like this:

``` yaml
script:
  - npm run create-issues -- $BASIC_AUTH_HEADER
```

`$BASIC_AUTH_HEADER` is a variable which contains the string `github_username:github_password` encoded in base64. It will be used by the script to authenticate its calls to the Github API [using Basic Authentication](https://developer.github.com/v3/#authentication). Travis has [a simple interface](https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings) to define this kind of variable. The double dash `--` is used to give a parameter to a npm script defined in `package.json`.

In `package.json` I added a new script like this:

``` json
"scripts": {
    "create-issues": "node tools/createIssues.js"
}
```

Committing a simple nodejs script at `tools/createIssues.js` with only a `console.log()` confirmed this setup is working as the output of the command was shown in the travis build.

### Implementing the CI script

Using the [axios](https://github.com/axios/axios) library I can list the existing issues in the blog-comment repo:

``` javascript
const Axios = require('axios');
const BASIC_AUTH_HEADER = process.argv[2]; // [0] is "node", [1] is scriptname

/*
 * Configure axios to always use my user agent and my Github login
 * to authenticate to the Github API
 */
const axios = Axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        'User-Agent': 'statox',
        'Authorization': `basic ${BASIC_AUTH_HEADER}`
    }
});

/*
 * Get all of the open issues in a github repo
 */
function getIssues(cb) {
    return axios.get(
        `repos/${REPO_NAME}/issues`
    ).then((response) => {
        return cb(null, response.data)
    }).catch((error) => {
        return cb(error);
    });
}
```

The other items to list are the posts. Here I needed to create a function to recursively list the files in my `src/posts` directory. These files have a header section delimited by `---` strings which are used by eleventy (the static site generator I used for this site). I created a function to parse these header and return a javascript object, that was a quick way to get things done without digging the doc but I'm sure there is a more efficient way to get this data out of eleventy. _(For example I could write this data directly in JS in the posts files)_

With this short function I list all my posts, get their title and the ID of the issue I associated to it and exclude the posts I have not published yet.
``` javascript
/*
 * Iterate through all the files found in the post folder
 * Read them to get their data section
 * And return a list of parsed data sections
 */
function getPosts(cb) {
    const files = walkSync('src/posts/');

    async.map(files, (file, cb) => {
        return fs.readFile(file, {encoding: 'utf-8'}, (error, content) => {
            if (error) {
                return cb(error);
            }

            // Only keep the part between the two '---' lines
            const postHeader = content.split('---')[1].split('\n')
            return cb(null, convertPostHeader(postHeader));
        });
    },
    (error, results) => {
        if (error) {
            return cb(error);
        }

        // Only keep the published posts
        return cb(null, results.filter(p => p.eleventyExcludeFromCollections !== true && p.title));
    });
}
```

A bit more logic to detect the issues which need to be created and an additional call to the Github API and here is our working script:

``` javascript
/*
 * Post a new issue on github
 */
function createIssue(issue, cb) {
    if (DRY_RUN) {
        console.log('DRY RUN: creating issue', {issue});
        return cb();
    }

    return axios.post(
        `repos/${REPO_NAME}/issues`, 
        JSON.stringify({
            title: issue.title,
        })
    ).then((response) => {
        return cb(null, response.data)
    }).catch((error) => {
        return cb(error);
    });
}
```

I added a `DRY_RUN` variable which comes from how I call the script for testing purposes.

### Showing the comments in the posts

Using the `commentIssueId` of each post and the following script allows to inject the comments in the comment section:

``` javascript
// Script to inject comments based on github issues
// Shamelessly taken from https://25.wf/posts/2020-06-21-comments.html
function domReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    }
}

async function getComments(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: { Accept: 'application/vnd.github.v3.html+json' },
    });
    return response.json();
}

domReady(() => {
    const apiUrl = 'https://api.github.com/repos/statox/blog-comments/issues/{{commentIssueId}}/comments';
    const appendComments = function (comments) {
        const commentSection = document.querySelector('comments');
        if (!comments || !comments.forEach || comments.length === 0) {
            commentSection.insertAdjacentHTML('beforeend', '<p>No comments yet.</p>');
            return;
        }
        comments.forEach(function (comment) {
            commentSection.insertAdjacentHTML(
                'beforeend',
                '<div class="comment">' +
                '• <a href="' + comment.user.html_url + '" target="_blank">' + comment.user.login + '</a>' +
                ' on' +
                ' <a href="' + comment.html_url + '" target="_blank">' + new Date(comment.created_at).toUTCString() + '</a>' +
                comment.body_html +
                '</div>',
            );
        });
    };
    getComments(apiUrl).then(appendComments);
});
```

### So much time saved!

And that's how I came up with a system which makes me save about one minute every time I publish a new post (which doesn't happen more than a few time a month at best)! It took me about 4 hours to get the whole thing working so according to this famous XKCD... that might have been a bit of a waste of time, but it was fun to do! :sweat_smile: 

![XKCD is it worth the time](https://imgs.xkcd.com/comics/is_it_worth_the_time.png)

I still have a few more things I want to implement:

 - Improving how I handle the data coming from the posts to avoid parsing it myself
 - Adding a check to make sure my posts all have unique and sequential issues ID
 - Adding a mechanism to update the title of the issues if the title of the post change
 - Adding a content to the OP of the issue to have a link to the article

But given the previous XKCD graph I'll see when I have time for that and if I really have a need for it too.
