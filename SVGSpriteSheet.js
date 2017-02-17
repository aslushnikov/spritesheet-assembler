var postsvg = require('postsvg');
var renameId = require('postsvg-rename-id');

class SVGSpriteSheet {
  /**
   * @param {number} width
   * @param {number} height
   * @param {!Map<!SVGSprite, !{x: number, y: number}>} spritePositions
   */
  constructor(width, height, spritePositions) {
    this._width = width;
    this._height = height;
    this._sprites = Array.from(spritePositions.keys());
    this._positions = spritePositions;
  }

  /**
   * @return {number}
   */
  width() {
    return this._width;
  }

  /**
   * @return {number}
   */
  height() {
    return this._height;
  }

  /**
   * @return {!Array<!SVGSprite>}
   */
  sprites() {
    return this._sprites;
  }

  /**
   * @param {!SVGSprite} sprite
   * @return {!{x: number, y: number}}
   */
  spritePosition(sprite) {
    console.assert(this._positions.has(sprite), 'sprite ' + sprite.filePath + ' has undefined position!');
    return this._positions.get(sprite);
  }

  /**
   * @return {string}
   */
  svgText() {
    if (this._svgText)
      return this._svgText;

    var svgBody = '';
    var spriteId = 0;
    for (var sprite of this._sprites) {
      var spriteSVG = sprite.content.trim();

      // Strip of <?xml> header, if any.
      if (spriteSVG.startsWith('<?xml')) {
        var headerIndexEnd = spriteSVG.indexOf('?>');
        spriteSVG = spriteSVG.substring(headerIndexEnd + 2);
      }

      // Rename sprite ids to avoid clashing.
      spriteSVG = postsvg().use(renameId({pattern: 'sprite' + (++spriteId) + '_[id]'})).process(spriteSVG);

      // Wrap sprite to SVG container with proper position.
      var position = this._positions.get(sprite);
      var prefix = `<svg x="${position.x}" y="${position.y}" width="${sprite.width}" height="${sprite.height}">`;
      var suffix = '</svg>';
      spriteSVG = prefix + spriteSVG + suffix;

      svgBody += spriteSVG;
    }

    var xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';
    var spriteSheetHeader = `<svg width="${this._width}" height="${this._height}" xmlns="http://www.w3.org/2000/svg">`;
    return xmlHeader + spriteSheetHeader + svgBody + '</svg>';
  }
};

module.exports = SVGSpriteSheet;
