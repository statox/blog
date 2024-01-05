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

function CVCollection(collection, name) {
    const folderRegex = new RegExp(`\/cv_entries\/${name}\/`);
    const inEntryFolder = item => item.inputPath.match(folderRegex) !== null;

    const byStartDate = (a, b) => {
        if (a.data.start && b.data.start) {
            return a.data.start - b.data.start;
        }
        return 0;
    };

    return collection.getAllSorted().filter(inEntryFolder).sort(byStartDate);
}

function work(collection) {
    return CVCollection(collection, 'work');
}

function education(collection) {
    return CVCollection(collection, 'education');
}

module.exports = {
    popularPosts,
    work,
    education
};
