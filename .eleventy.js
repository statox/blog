/*
 * Eleventy configuration file
 */

const eleventyNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItExternalLinks = require('markdown-it-external-links');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSEO = require('eleventy-plugin-seo');
const seoConfig = require('./src/_data/seo.json');
const sitemap = require('@quasibit/eleventy-plugin-sitemap');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const wordCount = require('eleventy-plugin-wordcount').wordCount;

const fs = require('fs');
const filters = require('./tools/eleventy/filters.js');
const collections = require('./tools/eleventy/collections.js');
const transforms = require('./tools/eleventy/transforms.js');

const env = process.env.ELEVENTY_ENV;

module.exports = function (eleventyConfig) {
    // Filters
    Object.keys(filters).forEach(filterName => {
        eleventyConfig.addFilter(filterName, filters[filterName]);
    });

    // Collections
    Object.keys(collections).forEach(collectionName => {
        eleventyConfig.addCollection(collectionName, collections[collectionName]);
    });

    // Transforms
    Object.keys(transforms).forEach(transformName => {
        eleventyConfig.addTransform(transformName, transforms[transformName]);
    });

    // Local 404 page
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('docs/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    /*
     * Plugins
     */
    // syntax highlighting in code blocks
    eleventyConfig.addPlugin(syntaxHighlight);
    // RSS feed plugin
    eleventyConfig.addPlugin(pluginRss);
    // Word count plugin
    eleventyConfig.addPlugin(wordCount);
    // SEO plugin
    eleventyConfig.addPlugin(pluginSEO, seoConfig);
    // Sitemap plugin
    eleventyConfig.addPlugin(sitemap, {
        sitemap: {
            hostname: 'https://www.statox.fr'
        }
    });
    // Navigation
    eleventyConfig.addPlugin(eleventyNavigation);

    /*
     * Markdown parsing configuration
     */
    const markdownItOptions = {
        html: true, // Enable HTML tags in source
        breaks: true, // Convert '\n' in paragraphs into <br>
        linkify: true // Convert text looking like a link to a link
    };

    // Open external links in new tabs
    const markdownItExternalLinksOptions = {
        externalClassName: null,
        externalRel: 'noopener noreferrer',
        externalTarget: '_blank'
    };

    const markdownItAnchorOptions = {
        permalink: true,
        permalinkSymbol: '🔗'
    };

    let markdownLib = markdownIt(markdownItOptions)
        .use(markdownItAnchor, markdownItAnchorOptions)
        .use(markdownItExternalLinks, markdownItExternalLinksOptions)
        .use(markdownItEmoji);

    eleventyConfig.setLibrary('md', markdownLib);

    /*
     * Specify which types of templates should be transformed.
     */
    eleventyConfig.setTemplateFormats(['html', 'liquid', 'njk', 'md', 'gif', 'js', 'png', 'txt']);

    /*
     * Passthroughs: Copy ./dir/ to docs/dir/
     */
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('mirror');
    eleventyConfig.addPassthroughCopy({'./assets/images': '/images'});

    if (env === 'prod') {
        eleventyConfig.addPassthroughCopy({'./assets/favicons_prod': '/favicon'});
    } else {
        eleventyConfig.addPassthroughCopy({'./assets/favicons_dev': '/favicon'});
    }
};
