/*
 * Script to inject comments based on github issues
 * Largely inspired from https://25.wf/posts/2020-06-21-comments.html
 */

const reactionEmojis = {
    laugh: '&#x1F600',
    '+1': '&#x1F44D',
    '-1': '&#x1F44E',
    hooray: '&#x1F389',
    confused: '&#x1F615',
    heart: '&#x2665',
    rocket: '&#x1F680',
    eyes: '&#x1F440'
};

function domReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    }
}

function countReactions(reactions) {
    const counts = {};
    reactions.forEach((r) => {
        if (!counts[r.content]) {
            counts[r.content] = 1;
        } else {
            counts[r.content]++;
        }
    });
    return counts;
}

function formatReactions(reactions) {
    if (!reactions.length) {
        return '';
    }

    const items = countReactions(reactions);
    return Object.keys(items).reduce((r, k) => {
        const s = reactionEmojis[k] || `:${k}:`;
        return r + '<span class="comment-reaction-item">' + s + '&nbsp' + items[k] + '</span>';
    }, '');
}

function appendComments(comments) {
    const commentSection = document.querySelector('comments');

    const commentCountSpan = document.getElementById('commentCounter');
    if (commentCountSpan) {
        commentCountSpan.innerText = comments.length || 0;
    }

    if (!comments || !comments.forEach || comments.length === 0) {
        commentSection.insertAdjacentHTML('beforeend', '<p>No comments yet.</p>');
        return;
    }

    comments.forEach(function (comment) {
        const formattedDate = formatCommentDate(new Date(comment.created_at));
        const commentHeader =
            `<a href="${comment.user.html_url} rel="noopener noreferrer" target="_blank">${comment.user.login}</a>` +
            ' on ' +
            `<a href="${comment.html_url}" rel="noopener noreferrer" target="_blank">${formattedDate}</a>`;

        let result = '';
        result += '<div class="comment">';
        result += '    <div class="comment-header">' + commentHeader + '</div>';
        result += '    <div class="comment-content">';
        result += '        <div class="comment-text">' + comment.body_html + '</div>';
        if (comment.reactions.length > 0) {
            result += '        <div class="comment-reactions">' + formatReactions(comment.reactions) + '</div>';
        }
        result += '    </div>';
        result += '</div>';

        commentSection.insertAdjacentHTML('beforeend', result);
    });
}

async function getComments(issueId) {
    const url = `https://api.github.com/repos/statox/blog-comments/issues/${issueId}/comments`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: { Accept: 'application/vnd.github.v3.html+json' }
    });
    return response.json();
}

async function getReactions(commentId) {
    const url = `https://api.github.com/repos/statox/blog-comments/issues/comments/${commentId}/reactions`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: { Accept: 'application/vnd.github.squirrel-girl-preview+json' }
    });
    return response.json();
}

function formatCommentDate(i) {
    const d = i.getDate();
    const M = i.getUTCMonth() + 1;
    const Y = i.getFullYear();

    return `${d}/${M}/${Y}`;
}

function setupCommentsInPage(commentIssueId) {
    domReady(async () => {
        const comments = await getComments(commentIssueId);
        await Promise.all(
            comments.map(async (c) => {
                c.reactions = await getReactions(c.id);
            })
        );

        appendComments(comments);
    });
}

// prettier-ignore `{ commentIssueId }` is actually nunjucks data once this script is injected in pages
setupCommentsInPage({{ commentIssueId }});
