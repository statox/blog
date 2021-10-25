function currentCommitHash() {
    if (process.env.ELEVENTY_ENV !== 'prod') {
        return 'Dev env - no commit';
    }
    if (!process.env.GITHUB_SHA) {
        return 'Unknown - something probably went wrong';
    }
    const sha = process.env.GITHUB_SHA;
    const shortSha = process.env.GITHUB_SHA.slice(0, 7);
    const url = `https://github.com/statox/blog/commit/${sha}`;
    return `[${shortSha}](${url})`;
}

function currentBuildInfo() {
    const pad = v => v.toString().padStart(2, '0');
    const now = new Date();
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const nowStr = `${day}/${month}/${year} ${hours}:${minutes}`;

    const buildId = process.env.GITHUB_RUN_ID || '';
    const url = `https://github.com/statox/blog/actions/runs/${buildId}`;
    return `[${nowStr}](${url})`;
}

function buildInfo() {
    return currentCommitHash() + ' - ' + currentBuildInfo();
}

// Posts dates in home page
function datePost(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[month]} ${year}`;
}

// Format note tags for notes/ page and for individual note pages
function noteTags(tags) {
    return tags
        .filter(t => t !== 'note')
        .map(t => '[' + t + ']')
        .join('');
}

// Filter to get posts related to the current one
// TODO: To be refactored to better use eleventy collections to avoid hack for drafts
function relatedPosts(_collection, currentPost) {
    // Exclude drafts from collection
    const collection = _collection.filter(p => !p.url.includes('drafts'));
    const currentPostIndex = collection.findIndex(p => p.url === currentPost.url);
    const relatedPosts = [];
    const transformPost = post => {
        return {
            date: post.date,
            url: post.url,
            title: post.data.title
        };
    };

    // For every post excepted the first one add the previous post
    if (currentPostIndex > 0) {
        const prevPost = collection[currentPostIndex - 1];
        relatedPosts.push(transformPost(prevPost));
    }
    // For the last post add the penultimate post too if it exists
    if (currentPostIndex === collection.length - 1 && currentPostIndex - 2 >= 0) {
        const penultimatePost = collection[currentPostIndex - 2];
        relatedPosts.push(transformPost(penultimatePost));
    }
    // For every post excepted the last one add the next post
    if (currentPostIndex < collection.length - 1) {
        const nextPost = collection[currentPostIndex + 1];
        relatedPosts.push(transformPost(nextPost));
    }
    // For the first post add one more post if it exists
    if (currentPostIndex === 0 && currentPostIndex + 2 <= collection.length - 1) {
        const nextNextPost = collection[currentPostIndex + 2];
        relatedPosts.push(transformPost(nextNextPost));
    }
    return relatedPosts;
}

// Change the tab title to the tittle of the post or the tittle of the site
function pageTitle(title) {
    return title || 'The stuff I do';
}

function sortChords(collection) {
    return collection.sort((a, b) => {
        if (a.artist !== b.artist) {
            return a.artist < b.artist ? -1 : 1;
        }
        return a.title < b.title ? -1 : 1;
    });
}

module.exports = {
    buildInfo,
    datePost,
    noteTags,
    relatedPosts,
    pageTitle,
    sortChords
};
