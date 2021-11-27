var fs = require('fs');
var path = require('path');
var postsvg = require('postsvg');
var renameId = require('postsvg-rename-id');

class SVGCompositor {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @return {!Promise<!Buffer>}
   */
  static compose(spriteSheet) {
    var svgBody = '';
    var spriteId = 0;
    for (var sprite of spriteSheet.sprites()) {
      if (sprite.mimeType !== 'image/svg+xml') {
        var error = 'Cannot compose non-svg sprite ' + path.basename(sprite.filePath) + '  of type ' + sprite.mimeType;
        return Promise.reject(error);
      }
      var spriteSVG = fs.readFileSync(sprite.filePath, 'utf-8').trim();

      // Strip of <?xml> header, if any.
      if (spriteSVG.startsWith('<?xml')) {
        var headerIndexEnd = spriteSVG.indexOf('?>');
        spriteSVG = spriteSVG.substring(headerIndexEnd + 2);
      }
      
      spriteSVG = spriteSVG.replace('<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->', '');
      spriteSVG = spriteSVG.replace('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', '');

      // Rename sprite ids to avoid clashing.
      spriteSVG = postsvg().use(renameId({pattern: 'sprite' + (++spriteId) + '_[id]'})).process(spriteSVG);

      // Wrap sprite to SVG container with proper position.
      var position = spriteSheet.spritePosition(sprite);
      var prefix = `<g transform='translate(${position.x} ${position.y})'>`;
      var suffix = '</g>';
      spriteSVG = prefix + spriteSVG + suffix;

      svgBody += spriteSVG;
    }

    var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
    var spriteSheetHeader = `<svg width="${spriteSheet.width()}" height="${spriteSheet.height()}" xmlns="http://www.w3.org/2000/svg">`;
    var result = xmlHeader + spriteSheetHeader + svgBody + '</svg>';
    return Promise.resolve(Buffer.from(result, 'utf8'));
  }
}

module.exports = SVGCompositor;
