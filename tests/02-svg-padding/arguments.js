var path = require('path');

module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'descriptors.js'),
        '-p', 10,
        '-t', 'devtools'
    ];
};
