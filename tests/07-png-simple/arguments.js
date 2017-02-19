var path = require('path');

module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.png'),
        '-d', path.join(outputFolder, 'descriptors.js'),
        '-t', 'devtools'
    ];
};
