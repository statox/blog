const prettier = require('prettier');
const htmlminifier = require('html-minifier');
const env = process.env.ELEVENTY_ENV;

// HTML minifier transform
// Also minifies JS and CSS
// TODO Check continueOnParseError option and how to handle failure in CI
function htmlmin(content, outputPath) {
    if (!outputPath.endsWith('.html')) {
        return content;
    }

    if (env === 'dev') {
        console.log('not minified');
        return content;
    }

    const prettified = prettier.format(content, {parser: 'html'});

    const minified = htmlminifier.minify(prettified, {
        keepClosingSlash: true,
        caseSensitive: true,
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
    });
    return minified;
}

module.exports = {
    htmlmin
};
