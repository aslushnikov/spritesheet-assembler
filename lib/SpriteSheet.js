class SpriteSheet {
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
   * @return {number}
   */
  coverage() {
    if (this._coverage)
        return this._coverage;
    var spritesArea = 0;
    for (var sprite of this._sprites)
        spritesArea += sprite.width * sprite.height;
    this._coverage = spritesArea / (this._width * this._height);
    return this._coverage;
  }

  /**
   * @param {!SVGSprite} sprite
   * @return {!{x: number, y: number}}
   */
  spritePosition(sprite) {
    console.assert(this._positions.has(sprite), 'sprite ' + sprite.filePath + ' has undefined position!');
    return this._positions.get(sprite);
  }
};

module.exports = SpriteSheet;
