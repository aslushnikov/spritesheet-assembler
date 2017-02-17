var fs = require('fs');
var sizeOf = require('image-size');

class SVGSprite {
  /**
   * @param {string} filePath
   * @param {string} content
   * @param {number} width
   * @param {number} height
   */
  constructor(filePath, content, width, height) {
    this.filePath = filePath;
    this.content = content;
    this.width = width;
    this.height = height;
  }

  /**
   * @param {string} filePath
   * @return {!SVGSprite}
   */
  static loadFromFile(filePath) {
    var content = fs.readFileSync(filePath, 'utf-8');
    var dimensions = sizeOf(filePath);
    return new SVGSprite(filePath, content, dimensions.width, dimensions.height);
  }
};

module.exports = SVGSprite;
