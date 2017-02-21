var path = require('path');

/**
 * Verify that SVG compositor is sane.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-t', 'css'
    ];
};
