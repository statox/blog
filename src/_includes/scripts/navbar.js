// Create a media query to check the size of the screen
// The bigScreen variable is used in navbarNavigate()
const bigScreenQuery = window.matchMedia('(max-width: 600px)');
let bigScreen = !bigScreenQuery.matches;
bigScreenQuery.addListener((query) => (bigScreen = !query.matches)); // Attach listener function on state changes

// This is the function called when user clicks on the links in the navbar
// If we have a big screen we always navigate
// On smaller screens we only navigate if the navbar is open
// Otherwise the button is only used to open the navbar
function navbarNavigate(path) {
    var x = document.getElementById('header-navbar');
    if (!bigScreen && !x.className.includes('responsive')) {
        return;
    }
    document.location.pathname = path;
}

function navbarToggle() {
    var x = document.getElementById('header-navbar');
    if (x.className === 'topnav') {
        x.className += ' responsive';
    } else {
        x.className = 'topnav';
    }
}
