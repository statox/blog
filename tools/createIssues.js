#!/usr/env/node

const { Octokit } = require('@octokit/rest');
const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const async = require('async');

/*
 * Script to be run by the CI to create the issues used for comments for each published posts
 */

if (process.argv.length < 3 || process.argv.length > 5) {
    console.error('Incorrect number of arguments');
    console.error('Usage:');
    console.error('node createIssues.js ACCESS_TOKEN [DRY_RUN]');
    console.error('    ACCESS_TOKEN - Base64 string representing the Authentication Header to use for Github');
    console.error("    [DRY_RUN] - Prevent creating actual issues. Only the value 'false' allow the creation");
    process.exit(1);
}

const OWNER = 'statox';
const REPO_NAME = 'blog-comments';
const ACCESS_TOKEN = process.argv[2]; // [0] is "node", [1] is scriptname
const DRY_RUN = !(process.argv.length >= 4 && process.argv[3] === 'false');

const octokit = new Octokit({
    auth: ACCESS_TOKEN,
    userAgent: 'statox/blog/createIssues 1.0'
});

/*
 * Get all the issues open in a github repo
 */
function getIssues(cb) {
    return octokit.issues
        .listForRepo({
            owner: OWNER,
            repo: REPO_NAME
        })
        .then(({ data }) => cb(null, data))
        .catch((e) => cb(e));
}

/*
 * Synchronously list all files in a directory recursively
 */
var walkSync = function (dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file) => {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        } else {
            filelist.push(dir + file);
        }
    });
    return filelist;
};

/*
 * Takes the data lines of a post file as an array of strings
 * and return a nicely formatted object
 */
function convertPostHeader(postHeader) {
    return postHeader
        .filter((l) => l.length > 0)
        .map((l) => l.split(': '))
        .reduce((o, l) => {
            if (l && l[0] === 'commentIssueId') {
                o['commentIssueId'] = Number(l[1]);
                return o;
            }
            if (l && l[0] === 'eleventyExcludeFromCollections') {
                o['eleventyExcludeFromCollections'] = l[1] === 'true';
                return o;
            }
            if (l && l[0] === 'title') {
                o['title'] = l[1];
                return o;
            }
            return o;
        }, {});
}

/*
 * Iterate through all the files found in the post folder
 * Read them to get their data section
 * And return a list of parsed data sections
 */
function getPosts(cb) {
    const files = walkSync('src/posts/');

    async.map(
        files,
        (file, cb) => {
            return fs.readFile(file, { encoding: 'utf-8' }, (error, content) => {
                if (error) {
                    return cb(error);
                }

                // Only keep the part between the two '---' lines
                if (content.match('---')) {
                    const postHeader = content.split('---')[1].split('\n');
                    return cb(null, convertPostHeader(postHeader));
                } else {
                    console.log('ignoring', file);
                    return cb(null, {});
                }
            });
        },
        (error, results) => {
            if (error) {
                return cb(error);
            }

            // Only keep the published posts
            return cb(
                null,
                results.filter((p) => p.eleventyExcludeFromCollections !== true && p.title)
            );
        }
    );
}

/*
 * Post a new issue on github
 */
function createIssue(issue, cb) {
    if (DRY_RUN) {
        console.log('DRY RUN: creating issue', { issue });
        return cb();
    }

    return octokit.issues
        .create({
            owner: OWNER,
            repo: REPO_NAME,
            title: JSON.stringify(issue.title)
        })
        .then((response) => cb(null, response))
        .catch((e) => cb(e));
}

/*
 * Create a list of issues in github in the order they are in the array
 */
function createMissingIssues(issuesToCreate, cb) {
    async.eachSeries(
        issuesToCreate,
        (issue, cb) => {
            return createIssue(issue, (error) => {
                if (error) {
                    return cb(error);
                }

                console.log('Issue created ', issue.expectedNumber, issue.title);
                return cb();
            });
        },
        cb
    );
}

if (require.main === module) {
    async.auto(
        {
            issues: (cb) => getIssues(cb),
            posts: (cb) => getPosts(cb)
        },
        (error, result) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            const { issues, posts } = result;
            const sortedIssues = issues.sort((a, b) => a.number - b.number);
            const sortedPosts = posts.sort((a, b) => a.commentIssueId - b.commentIssueId);

            // Get the index of the first post which doesn't have a corresponding issue
            let notCreatedPostsIndex = 0;
            const lastIssueNumber = sortedIssues.length ? sortedIssues[sortedIssues.length - 1].number : 0;
            while (
                notCreatedPostsIndex <= sortedPosts.length - 1 &&
                sortedPosts[notCreatedPostsIndex].commentIssueId <= lastIssueNumber
            ) {
                notCreatedPostsIndex++;
            }

            const issuesToCreate = [];
            for (let i = notCreatedPostsIndex; i < sortedPosts.length; i++) {
                const post = sortedPosts[i];
                issuesToCreate.push({
                    title: post.title,
                    expectedNumber: post.commentIssueId
                });
            }

            if (!issuesToCreate.length) {
                console.log('No missing issues to create');
                process.exit(0);
            }

            createMissingIssues(issuesToCreate, (error) => {
                if (error) {
                    console.log('Error creating issues');
                    console.log(error);
                    process.exit(1);
                }

                console.log('Issues created');
                process.exit(0);
            });
        }
    );
}
