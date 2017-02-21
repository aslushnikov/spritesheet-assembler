var path = require('path');
var gm = require('gm');

class GMCompositor {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @return {!Promise<!Buffer>}
   */
  static compose(spriteSheet) {
    var width = spriteSheet.width();
    var height = spriteSheet.height();
    var command = gm(width, height, 'transparent');
    command._in = ['-background', 'transparent'];
    for (var sprite of spriteSheet.sprites()) {
        if (sprite.mimeType !== 'image/jpeg' && sprite.mimeType !== 'image/png')
            return Promise.reject('GMCompositor cannot process sprites with mimeType ' + sprite.mimeType + ': ' + path.basename(sprite.filePath));
        var position = spriteSheet.spritePosition(sprite);
        command.out('-page');
        command.out(`${width}x${height}+${position.x}+${position.y}`);
        command.out(sprite.filePath);
    }
    command = command.mosaic();

    var fulfill, reject;
    var promise = new Promise((f, r) => { fulfill = f; reject = r; });
    command.toBuffer('png', onResult);
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
