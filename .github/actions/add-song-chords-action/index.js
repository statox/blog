const async = require('async');
const {exec} = require('child_process');
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const FILE_URL = 'src/_data/chords.json';

const body = core.getInput('comment');
const [artist, title, url] = body.split('\r\n').map(s => s.trim());

console.log('Item to add', {artist, title, url});

if (!artist || !title || !url) {
    console.log('Error one of the element is not defined');
    core.setFailed('Error one of the element is not defined');
    process.exit(1);
}

const now = new Date();
const timestamp = now.getTime();

// TODO refactor to avoid storing the whole file in memory
async.auto(
    {
        truncatedFileContent: cb => {
            // This is necessary to remove the first [ in chords.json
            // we get the tailed content and we'll append new content at the top
            console.log('Get truncatedFileContent');
            exec(`tail -n +2 ${FILE_URL}`, (error, filecontent, stderr) => {
                if (error) {
                    console.log(stderr);
                    return cb(error);
                }
                return cb(null, filecontent);
            });
        },
        addNewContent: [
            'truncatedFileContent',
            (result, cb) => {
                // Add the new item to the truncated content
                // and write it to disk
                console.log('Adding new item to file');
                const item = JSON.stringify({artist, title, url}, {space: 4}, 4);
                const newContent =
                    '[\n' +
                    '    {\n' +
                    `        "artist": "${artist}",\n` +
                    `        "title": "${title}",\n` +
                    `        "url": "${url}",\n` +
                    `        "creationDate": ${timestamp}\n` +
                    '    },\n' +
                    result.truncatedFileContent;

                return fs.writeFile(FILE_URL, newContent, cb);
            }
        ],
        diff: [
            'addNewContent',
            (result, cb) => {
                console.log('Getting git diff');
                exec(`git diff ${FILE_URL}`, (error, out) => {
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
                const command = `git add ${FILE_URL}`;
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
                const commitMessage = `Add '${artist} - ${title}' to chords`;
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
            console.log({error});
            core.setFailed(error);
        }
        console.log('Done adding item');
    }
);
