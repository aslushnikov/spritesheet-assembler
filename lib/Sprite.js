class Sprite {
  /**
   * @param {string} filePath
   * @param {string} content
   * @param {number} width
   * @param {number} height
   */
  constructor(filePath, mimeType, width, height) {
    this.filePath = filePath;
    this.mimeType = mimeType;
    this.width = width;
    this.height = height;
  }
};

module.exports = Sprite;
