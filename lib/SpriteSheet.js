var SpriteSheet = class {
  /**
   * @param {!Map<!Sprite, !{x: number, y: number}>} spritePositions
   */
  constructor(spritePositions) {
    this._width = 0;
    this._height = 0;
    this._sprites = Array.from(spritePositions.keys());
    this._positions = spritePositions;
    for (var sprite of this._sprites) {
        var position = this._positions.get(sprite);
        this._width = Math.max(this._width, position.x + sprite.width);
        this._height = Math.max(this._height, position.y + sprite.height);
    }
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
