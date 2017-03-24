var path = require('path');

/**
 * Verify that a mix of raster and vector sprites is not converted
 * to PNG spritesheet.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.png'),
        '-d', path.join(outputFolder, 'icons.css'),
    ];
};
