const fs = require('fs');

const listUploads = () => {
    try {
        // Path is relative to project root
        const path = './src/uploads/';
        const files = fs
            .readdirSync(path)
            .filter(name => !name.match(/^index*/))
            .map(name => path.replace('./src', '') + name);
        return files;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    uploads: listUploads
};
