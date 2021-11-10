/*
 * TODO: There is some refactoring to be done.
 * The scrollFunc function should be common and should take a callback so that
 * I can use it in different scripts with different actions
 */
// Set a variable for our button element.
const scrollToTopButton = document.getElementById('js-top');

// Set when the scroll starts to detect when the scroll ends
let scrollTimer;

// Let's set up a function that shows our scroll-to-top button if we scroll beyond the height of the initial window.
const scrollFunc = () => {
    // Get the current scroll value
    let y = window.scrollY;

    // If the scroll value is greater than the window height, let's add a class to the scroll-to-top button to show it!
    if (y > 0) {
        scrollToTopButton.className = 'top-link show';
    } else {
        scrollToTopButton.className = 'top-link hide';
    }

    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(() => {
        scrollToTopButton.className = 'top-link hide';
    }, 3000);
};

window.addEventListener('scroll', scrollFunc);

const scrollToTop = () => {
    // Let's set a variable for the number of pixels we are from the top of the document.
    const c = document.documentElement.scrollTop || document.body.scrollTop;

    // If that number is greater than 0, we'll scroll back to 0, or the top of the document.
    // We'll also animate that scroll with requestAnimationFrame:
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        // ScrollTo takes an x and a y coordinate.
        // Increase the '10' value to get a smoother/slower scroll!
        window.scrollTo(0, c - c / 2);
    }
};

// When the button is clicked, run our ScrolltoTop function above!
scrollToTopButton.onclick = function (e) {
    e.preventDefault();
    scrollToTop();
};
