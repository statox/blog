const fs = require('fs');

const listUploads = () => {
    try {
        // Path is relative to project root
        const path = './assets/uploads/';
        const files = fs.readdirSync(path).map(name => path.replace('./assets', '') + name);
        return files;
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    uploads: listUploads
};
