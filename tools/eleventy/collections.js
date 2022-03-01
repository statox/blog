// Notes sorted alphabetically by their title
function notesAlphabetical(collection) {
    return collection.getFilteredByGlob('src/notes/*.md').sort((a, b) => {
        if (a.data.title > b.data.title) return 1;
        else if (a.data.title < b.data.title) return -1;
        else return 0;
    });
}

// Transform the popular posts list in src/_data/popularposts.json to a collection
// using the actual posts collection.
// I could have simply put the title, url and creation date in popularPosts.json
// but I use the posts() macro to display them in the home page and the macro
// expects full data as when automatically populated by eleventy
// So I rather created a new collection to the cost of a bit of CPU time
function popularPosts(collection) {
    // Get the popular posts data from the json file
    const popular = collection.items.find(i => i.url === '/').data.popularposts;
    const popularRanks = popular.reduce((res, item) => {
        res[item.url] = item.rank;
        return res;
    }, {});
    const popularURLS = Object.keys(popularRanks);
    // Pick the relevant items in the whole list of posts
    return collection.items
        .filter(i => popularURLS.includes(i.url))
        .sort((a, b) => {
            const rankA = popularRanks[a.url];
            const rankB = popularRanks[b.url];
            return rankB - rankA;
        });
}

module.exports = {
    notesAlphabetical,
    popularPosts
};
