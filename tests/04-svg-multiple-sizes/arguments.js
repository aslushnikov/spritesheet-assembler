var path = require('path');

/**
 * Verify spritesheet packing in case of multiple sprites of
 * different sizes.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-p', 2,
    ];
};
