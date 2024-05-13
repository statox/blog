const async = require('async');
const { exec } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const TODO_PATH = 'src/todo/';

const body = core.getInput('comment');
const tags_str = body.split('\r\n').find((l) => l.trim().match(/^tags/i));
let tagsArray = ['todo'];
try {
    const tags = tags_str.split(':')[1];
    tagsArray = tagsArray.concat(tags.split(',').map((t) => t.trim()));
} catch (e) {}

const now = new Date();
const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate()}`;

const title = body.split('\r\n').find((l) => l.match(/^#\s+.+/));
const cleanTitle = title.trim().replace(/^#\s+/, '').replace(/\s\+/g, ' ');

const fileName =
    cleanTitle
        .replace(/\s+/g, '_')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '') + '.md';

const FILE_PATH = TODO_PATH + fileName;

console.log('Item to add', { title, timestamp, fileName, tagsArray });

async.auto(
    {
        addNewContent: (cb) => {
            // Add the new item to the truncated content
            // and write it to disk
            console.log('Adding new item to file');
            const newContent =
                '---\n' +
                'layout: layouts/note.njk\n' +
                `tags: ${JSON.stringify(tagsArray)}\n` +
                `date: ${timestamp}\n` +
                `title: ${cleanTitle}\n` +
                '---\n\n' +
                body
                    .split('\r\n')
                    .filter((l) => l !== title)
                    .join('\n');

            return fs.writeFile(FILE_PATH, newContent, cb);
        },
        diff: [
            'addNewContent',
            (result, cb) => {
                console.log('Getting git diff');
                exec(`git diff ${FILE_PATH}`, (error, out) => {
                    if (error) {
                        return cb(error);
                    }
                    console.log(out);
                    return cb(null, out);
                });
            }
        ],
        configureGit: [
            'diff',
            (result, cb) => {
                console.log('configuring git username');
                exec(`git config user.name "statox"`, (error, out) => {
                    if (error) {
                        return cb(error);
                    }
                    console.log('configuring git email');
                    exec(`git config user.email "me@statox.fr"`, (error, out) => {
                        console.log('done doing configuration');
                        return cb();
                    });
                });
            }
        ],
        addChanges: [
            'configureGit',
            (result, cb) => {
                console.log('Adding changes to git');
                const command = `git add ${FILE_PATH}`;
                exec(command, (error, filecontent, stderr) => {
                    if (error) {
                        console.log(stderr);
                        return cb(error);
                    }
                    return cb();
                });
            }
        ],
        commitChanges: [
            'addChanges',
            (result, cb) => {
                console.log('Creating commit');
                const commitMessage = `Add '${title}' to todo list`;
                const command = `git commit -m "${commitMessage}"`;
                exec(command, (error, filecontent, stderr) => {
                    if (error) {
                        console.log(stderr);
                        return cb(error);
                    }
                    return cb();
                });
            }
        ],
        pushChanges: [
            'commitChanges',
            (result, cb) => {
                console.log('Pushing changes');
                const command = 'git push';
                exec(command, (error, filecontent, stderr) => {
                    if (error) {
                        console.log(stderr);
                        return cb(error);
                    }
                    return cb();
                });
            }
        ]
    },
    (error, result) => {
        if (error) {
            console.log({ error });
            core.setFailed(error);
        }
        console.log('Done adding item');
    }
);
