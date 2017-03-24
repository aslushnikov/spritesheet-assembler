var path = require('path');

var JSONDescriptor = {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @param {string} imageOutputPath
   * @return {string}
   */
  generate: function(spriteSheet, imageOutputPath) {
    var extension = path.extname(imageOutputPath);
    var spriteSheetName = path.basename(imageOutputPath, extension);
    // Manually craft json.
    var json = "{";
    json += `\n  "name": "${spriteSheetName}",`;
    json += `\n  "width": ${spriteSheet.width()},`;
    json += `\n  "height": ${spriteSheet.height()},`;
    json += `\n  "icons": {`;
    var descriptors = [];
    for (var sprite of spriteSheet.sprites()) {
      var position = spriteSheet.spritePosition(sprite);
      var extension = path.extname(sprite.filePath);
      var spriteName = path.basename(sprite.filePath, extension);
      var descriptor = `"${spriteName}": {`;
      descriptor += `"x": ${-position.x}`;
      descriptor += `, "y": ${-position.y}`;
      descriptor += `, "width": ${sprite.width}`;
      descriptor += `, "height": ${sprite.height}`;
      descriptor += `}`;
      descriptors.push(`\n    ` + descriptor);
    }
    json += descriptors.join(',');
    json += `\n  }`;
    json += `\n}`;
    return json;
  },
};

module.exports = JSONDescriptor;
