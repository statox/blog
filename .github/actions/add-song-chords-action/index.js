const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log('Running add-song-chords-action index.js');
    console.log(core.getInput('issueId'));
    console.log(core.getInput('login'));
    console.log(core.getInput('commenterId'));
    console.log(core.getInput('comment'));

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
