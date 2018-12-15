
const fs = require('fs');

function deleteFiles(files) {
    for (let f of files) {
        fs.unlink(f, function() {});
    }
}

module.exports = {
    deleteFiles
}