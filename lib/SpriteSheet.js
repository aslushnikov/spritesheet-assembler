var SpriteSheet = class {
  /**
   * @param {!Map<!Sprite, !{x: number, y: number}>} spritePositions
   * @param {number} width
   * @param {number} height
   */
  constructor(spritePositions, width, height) {
    this._width = width;
    this._height = height;
    this._sprites = Array.from(spritePositions.keys());
    this._positions = spritePositions;
  }

  /**
   * @param {!Map<!Sprite, !{x: number, y: number}>} spritePositions
   */
  static fromPositions(spritePositions) {
    var width = 0;
    var height = 0;
    for (var sprite of spritePositions.keys()) {
        var position = spritePositions.get(sprite);
        width = Math.max(width, position.x + sprite.width);
        height = Math.max(height, position.y + sprite.height);
    }
    return new SpriteSheet(spritePositions, width, height);
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
   * @return {!Array<!Sprite>}
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
   * @param {!Sprite} sprite
   * @return {!{x: number, y: number}}
   */
  spritePosition(sprite) {
    console.assert(this._positions.has(sprite), 'sprite ' + sprite.filePath + ' has undefined position!');
    return this._positions.get(sprite);
  }
};

module.exports = SpriteSheet;
