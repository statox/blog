// Toggle dark/light mode
// TODO: Find a way to get the variables automatically rather than using a list
// TODO: Find out a more resilient way to store --is-light-theme (Here a space in the CSS file would break the === "1" comparison)
function toggleDarkTheme() {
    const isLightProperty = getComputedStyle(document.documentElement).getPropertyValue('--is-light-theme');
    const isLight = isLightProperty === '1';

    const vars = [
        '--nc-tx-1',
        '--nc-tx-2',
        '--nc-tx-3',
        '--nc-bg-0',
        '--nc-bg-1',
        '--nc-bg-2',
        '--nc-bg-3',
        '--nc-lk-1',
        '--nc-lk-2',
        '--nc-lk-tx',
        '--nc-ac-1',
        '--nc-ac-tx'
    ];
    const replacement = isLight ? '-d' : '-l';
    const targetVars = vars.map((v) => {
        return { current: v, target: v.slice(0, 4) + replacement + v.slice(4) };
    });
    for (const { current, target } of targetVars) {
        const value = getComputedStyle(document.documentElement).getPropertyValue(target);
        document.documentElement.style.setProperty(current, value);
    }

    document.documentElement.style.setProperty('--is-light-theme', isLight ? '0' : '1');
    writeLightThemeCookie(isLight ? '0' : '1');
}

function domReady(fn) {
    document.addEventListener('DOMContentLoaded', fn);
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        fn();
    }
}

function readLightThemeCookie() {
    return localStorage.getItem('lighttheme');
}

function writeLightThemeCookie(isLight) {
    if (isLight !== '0' && isLight !== '1') {
        throw new Error('Invalid value for cookie lighttheme', isLight);
    }
    localStorage.setItem('lighttheme', isLight);
}

domReady(() => {
    const storedCookie = readLightThemeCookie();
    if (storedCookie) {
        const isLightProperty = getComputedStyle(document.documentElement).getPropertyValue('--is-light-theme');
        if (isLightProperty !== storedCookie) {
            toggleDarkTheme();
        }
    }
});

// Could be useful to get the variables from the stylesheet
// this issue is that with new.css and material.css the variables
// are defined twice so the list is not directly usable
// https://stackoverflow.com/a/54851636
// function getAllCustomCSSProperties() {
//     return Array.from(document.styleSheets)
//         .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
//         .reduce(
//             (acc, sheet) =>
//                 (acc = [
//                     ...acc,
//                     ...Array.from(sheet.cssRules).reduce(
//                         (def, rule) =>
//                             (def =
//                                 rule.selectorText === ':root'
//                                     ? [...def, ...Array.from(rule.style).filter(name => name.startsWith('--'))]
//                                     : def),
//                         []
//                     )
//                 ]),
//             []
//         );
// }
