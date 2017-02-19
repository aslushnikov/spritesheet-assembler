var path = require('path');

/**
 * Verify that CSS descriptor is generated properly.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.png'),
        '-d', path.join(outputFolder, 'icons.js'),
        '-p', 5,
        '-t', 'devtools'
    ];
};