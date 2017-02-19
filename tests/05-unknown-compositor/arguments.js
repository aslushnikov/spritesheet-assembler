var path = require('path');

/**
 * Verify that tool fails gracefully when given unknown compositor.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.UNKNOWN'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-p', 2,
        '-t', 'css'
    ];
};
