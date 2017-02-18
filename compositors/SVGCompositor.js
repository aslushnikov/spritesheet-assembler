var fs = require('fs');
var path = require('path');
var postsvg = require('postsvg');
var renameId = require('postsvg-rename-id');

class SVGCompositor {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @return {string}
   */
  static compose(spriteSheet) {
    var svgBody = '';
    var spriteId = 0;
    for (var sprite of spriteSheet.sprites()) {
      if (sprite.mimeType !== 'image/svg+xml') {
        var error = 'Cannot compose non-svg sprite ' + path.basename(sprite.filePath) + '  of type ' + sprite.mimeType;
        throw new Error(error);
      }
      var spriteSVG = fs.readFileSync(sprite.filePath, 'utf-8').trim();

      // Strip of <?xml> header, if any.
      if (spriteSVG.startsWith('<?xml')) {
        var headerIndexEnd = spriteSVG.indexOf('?>');
        spriteSVG = spriteSVG.substring(headerIndexEnd + 2);
      }

      // Rename sprite ids to avoid clashing.
      spriteSVG = postsvg().use(renameId({pattern: 'sprite' + (++spriteId) + '_[id]'})).process(spriteSVG);

      // Wrap sprite to SVG container with proper position.
      var position = spriteSheet.spritePosition(sprite);
      var prefix = `<svg x="${position.x}" y="${position.y}" width="${sprite.width}" height="${sprite.height}">`;
      var suffix = '</svg>';
      spriteSVG = prefix + spriteSVG + suffix;

      svgBody += spriteSVG;
    }

    var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
    var spriteSheetHeader = `<svg width="${spriteSheet.width()}" height="${spriteSheet.height()}" xmlns="http://www.w3.org/2000/svg">`;
    return xmlHeader + spriteSheetHeader + svgBody + '</svg>';
  }
}

module.exports = SVGCompositor;
