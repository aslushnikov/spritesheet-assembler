var path = require('path');

/**
 * Verify that SVGs with the same gradient ID's get
 * composed correctly.
 */
module.exports = function(outputFolder) {
    return [
        '-i', __dirname,
        '-o', path.join(outputFolder, 'spritesheet.svg'),
        '-d', path.join(outputFolder, 'icons.css'),
        '-p', 5,
    ];
};
