var path = require('path');

/**
 * Verify that GM compositor is sane when composing PNG.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.png'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-t', 'css'
    ];
};
