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

exec(`tail -n +2 ${FILE_URL}`, (error, filecontent, stderr) => {
    if (error) {
        core.setFailed(error.message);
        exit(1);
    }

    const item = JSON.stringify({artist, title, url}, {space: 4}, 4).replace(/^/g, '[I]');
    const newContent =
        '[\n' +
        '    {\n' +
        `        "artist": "${artist}",\n` +
        `        "title": "${title}",\n` +
        `        "url": "${url}"\n` +
        '    },\n' +
        filecontent;

    fs.writeFileSync(FILE_URL, newContent);

    exec(`git diff ${FILE_URL}`, (error, out) => {
        console.log('output of git diff');
        console.log(out);
    });
});
