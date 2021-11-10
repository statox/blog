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
        link.setAttribute('class', 'navigationLink');
        link.innerHTML = current;

        const button = document.createElement('li');
        button.setAttribute('class', 'btn navigationBtn');
        button.appendChild(link);
        indexElement.appendChild(button);
    }
};
Array.prototype.filter.call(artistElements, addNavigationId);

const pageScrolled = () => {
    // Get the current scroll value
    let y = window.scrollY;

    // If the scroll value is greater than the header move the navigation bar up
    if (y > 250) {
        indexElement.classList.add('scrolled');
    } else {
        indexElement.classList.remove('scrolled');
    }
};
window.addEventListener('scroll', pageScrolled);
