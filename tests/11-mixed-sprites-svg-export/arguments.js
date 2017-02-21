var path = require('path');

/**
 * Verify that SVGComposer fails when given non-svg sprites.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-t', 'css'
    ];
};
