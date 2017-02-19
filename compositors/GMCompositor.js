var path = require('path');
var gm = require('gm');
var mime = require('mime');

class GMCompositor {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @param {string} mimeType
   * @return {!Promise<!Buffer>}
   */
  static compose(spriteSheet, mimeType) {
    var width = spriteSheet.width();
    var height = spriteSheet.height();
    var command = gm(width, height, 'transparent');
    command._in = ['-background', 'transparent'];
    for (var sprite of spriteSheet.sprites()) {
        var position = spriteSheet.spritePosition(sprite);
        command.out('-page');
        command.out(`${width}x${height}+${position.x}+${position.y}`);
        command.out(sprite.filePath);
    }
    command = command.mosaic();
    var extension = mime.extension(mimeType);

    var fulfill, reject;
    var promise = new Promise((f, r) => { fulfill = f; reject = r; });
    command.toBuffer(extension, onResult);
    return promise;

    function onResult(err, buffer) {
        if (err)
            return reject('Compositor failed: ' + err);
        if (!buffer)
            return reject('Compositor failed: failed to create buffer.');
        fulfill(buffer);
    }
  }
}

module.exports = GMCompositor;
