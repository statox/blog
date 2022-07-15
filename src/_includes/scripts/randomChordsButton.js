/*
 * Super hacky "Get random song" button
 * The list of chords is exposed as JSON by eleventy on chords.json from .eleventy.js
 */

const CHORDS_URL = 'https://www.statox.fr/chords.json';
// const CHORDS_URL = 'http://localhost:8080/chords.json';
let chords_data;

// Initially pastSelections didn't exist and we only used the set to avoid suggesting the same song twice
// pastSelections was added to make the getPreviousRandomSong button work but I'm too lazy to remove alreadySeen properly
// TODO when I feel like doing it
const alreadySeen = new Set();
const pastSelections = [];

fetch(CHORDS_URL)
    .then(response => response.json())
    .then(data => {
        chords_data = data;
        getRandomSong();
    });

function getRandomSong() {
    if (!chords_data) {
        console.log('waiting for data');
        return;
    }

    if (alreadySeen.size === chords_data.length) {
        alreadySeen.clear();
    }

    let randomSong;
    while (!randomSong) {
        const randomIndex = Math.floor(Math.random() * chords_data.length);
        const song = chords_data[randomIndex];
        if (!alreadySeen.has(song.url)) {
            randomSong = song;
            alreadySeen.add(song.url);
            pastSelections.push(song);
        }
    }

    updateSelection();
}

function getPreviousRandomSong() {
    if (pastSelections.length <= 1) {
        return;
    }
    const deleted = pastSelections.pop();
    alreadySeen.delete(deleted.url);
    updateSelection();
}

function updateSelection() {
    if (pastSelections.length === 0) {
        return;
    }

    const randomSong = pastSelections[pastSelections.length - 1];
    const title = `${randomSong.artist} - ${randomSong.title} `;
    const a = document.createElement('a');
    const linkText = document.createTextNode(title);
    a.appendChild(linkText);
    a.title = title;
    a.href = randomSong.url;
    a.rel = 'noopener noreferrer';
    a.target = 'blank';

    const iconSpan = document.createElement('span');
    if (randomSong.url.match(/\.doc/)) {
        iconSpan.className = 'fas fa-xs fa-file-word';
    } else if (randomSong.url.match(/\.pdf/)) {
        iconSpan.className = 'fas fa-xs fa-file-pdf';
    } else {
        iconSpan.className = 'fas fa-xs fa-link';
    }

    const randomSongPlace = document.getElementById('randomSong');
    Array.from(randomSongPlace.children).forEach(c => randomSongPlace.removeChild(c));
    randomSongPlace.appendChild(a);
    randomSongPlace.appendChild(iconSpan);
}
