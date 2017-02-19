var path = require('path');

module.exports = function(outputFolder) {
    return [
        '-i', path.join(__dirname, 'input'),
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'descriptors.js'),
        '-t', 'devtools'
    ];
};
