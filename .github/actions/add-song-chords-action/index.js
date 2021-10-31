const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log('Running add-song-chords-action index.js');
    console.log({issueId: core.getInput('issueId')});
    console.log({login: core.getInput('login')});
    console.log({commenterId: core.getInput('commenterId')});
    console.log({comment: core.getInput('comment')});

    const event = JSON.stringify(github.event, undefined, 2);
    console.log(`The event event: ${event}`);

    // Get the JSON webhook payload for the event that triggered the workflow
    //const payload = JSON.stringify(github.context.payload, undefined, 2);
    //console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
