const async = require('async');
const {exec} = require('child_process');
const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');
const FILE_URL = 'src/_data/chords.json';

// const artist = 'Dropkick Murphys';
// const title = 'Rose tattoo';
// const url = 'https://www.tabs4acoustic.com/en/guitar-tabs/dropkick-murphys-tabs/rose-tattoo-acoustic-tab-389.html';

const body = core.getInput('comment');
const [artist, title, url] = body.split('\r\n');

console.log({artist, title, url});

async.auto(
    {
        truncatedFileContent: cb => {
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
                console.log('Adding new item to file');
                const item = JSON.stringify({artist, title, url}, {space: 4}, 4);
                const newContent =
                    '[\n' +
                    '    {\n' +
                    `        "artist": "${artist}",\n` +
                    `        "title": "${title}",\n` +
                    `        "url": "${url}"\n` +
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
                const commitMessage = `Add ${artist} - ${title} to chords`;
                const command = `git commit -m "${commitMessage}"`;
                // const command = `echo git commit -m "${commitMessage}"`;
                console.log(command);
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
        }
        console.log('Done adding item');
    }
);
