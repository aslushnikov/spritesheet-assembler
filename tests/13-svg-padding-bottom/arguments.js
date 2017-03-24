var path = require('path');

/**
 * Verify that padding between sprites works as intended.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '--padding-bottom', 10,
    ];
};
