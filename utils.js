var mime = require('mime');
var fs = require('fs');
var sizeOf = require('image-size');
var path = require('path');
var Sprite = require('./lib/Sprite');

var utils = {
    /**
     * @param {string} directoryPath
     * @return {!Array<!Sprite>}
     */
    readSpritesFromFolder: function(directoryPath) {
        var filePaths = fs.readdirSync(directoryPath)
                             .map(fileName => path.join(directoryPath, fileName));
        var sprites = [];
        for (var filePath of filePaths) {
            var mimeType = mime.lookup(filePath);
            if (!mimeType.startsWith('image/'))
                continue;
            sprites.push(utils.readSprite(filePath));
        }
        return sprites;
    },

    /**
     * @param {string} filePath
     * @return {!Sprite}
     */
    readSprite: function(filePath) {
        var dimensions = sizeOf(filePath);
        var mimeType = mime.lookup(filePath);
        return new Sprite(filePath, mimeType, dimensions.width, dimensions.height);
    },

    /**
     * @param {string} message
     */
    die: function(message) {
        console.error("FAILED: " + message);
        process.exit(1);
    },
}

module.exports = utils;
