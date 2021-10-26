const indexElement = document.getElementById('indexList');
const artistElements = document.getElementsByClassName('artist');
let previous;
const addNavigationId = function (element) {
    // Get the first letter of the current artist
    const current = element.innerHTML[0].toUpperCase();

    // If this is a new letter add an id to the td element
    // and add a new button in the index div which will be used for navigation
    if (current != previous) {
        element.setAttribute('id', 'first_letter_' + current);
        previous = current;

        const link = document.createElement('a');
        link.setAttribute('href', `#first_letter_${current}`);
        link.innerHTML = current;

        const button = document.createElement('li');
        button.setAttribute('class', 'navigationBtn');
        button.appendChild(link);
        indexElement.appendChild(button);
    }
};
Array.prototype.filter.call(artistElements, addNavigationId);
