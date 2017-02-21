var path = require('path');

/**
 * Verify that JPEG spritesheet is not generated.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.jpg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-t', 'css'
    ];
};
