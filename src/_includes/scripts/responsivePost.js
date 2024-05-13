/*
 * Use a media query to change the content of the interface for smaller screens
 */
function adaptToScreenSize(x) {
    const postDate = new Date('{{page.date}}');

    let datePostContent = postDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    let commentWordSpanContent = 'comments';

    if (x.matches) {
        // Small screens
        datePostContent = postDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        commentWordSpanContent = '💬';
    }

    document.getElementById('post_date').textContent = datePostContent;
    document.getElementById('comment_word').textContent = commentWordSpanContent;
}

var x = window.matchMedia('(max-width: 500px)');
adaptToScreenSize(x); // Call listener function at run time
x.addListener(adaptToScreenSize); // Attach listener function on state changes
