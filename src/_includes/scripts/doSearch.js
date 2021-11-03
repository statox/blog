/*
 * Dead simple search: Filter HTML elements based on an input
 *
 * The data to be searched should be put in the data-values HTML attribute
 * The elements corresponding to the data should have a class 'datarow'
 * when a search is done we change the class of the rows depending on if the query matches the data
 * The /chords/ and /notes/ for example usages
 */

function doSearch() {
    const searchStr = document.getElementById('searchInput').value;
    const tableLines = document.getElementsByClassName('datarow');
    for (const line of tableLines) {
        const values = line.dataset.values;
        if (values.toLowerCase().match(searchStr.toLowerCase())) {
            line.classList.remove('hidden');
        } else {
            line.classList.add('hidden');
        }
    }
}
