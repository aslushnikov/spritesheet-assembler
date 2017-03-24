var path = require('path');

/**
 * Verify that devtools descriptor is generated properly.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.png'),
        '-d', path.join(outputFolder, 'icons.json'),
        '-p', 5,
    ];
};
