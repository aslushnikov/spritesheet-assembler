var path = require('path');

var CSSDescriptor = {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @param {string} imageOutputPath
   * @return {string}
   */
  generate: function(spriteSheet, imageOutputPath) {
    var spriteSheetName = path.basename(imageOutputPath);
    var css = [
        '.icon {',
        `  background-image: url('../images/${spriteSheetName}');`,
        `  background-size: ${spriteSheet.width()}px ${spriteSheet.height()}px;`,
        '}',
    ];
    var sprites = spriteSheet.sprites().slice();
    sprites.sort((a, b) => {
        if (a.filePath < b.filePath)
            return -1;
        if (a.filePath > b.filePath)
            return 1;
        return 0;
    });
    for (var sprite of sprites) {
      var extension = path.extname(sprite.filePath);
      var spriteName = path.basename(sprite.filePath, extension);
      var position = spriteSheet.spritePosition(sprite);
      css.push(`.icon-${spriteName} {`);
      css.push(`  background-position: -${position.x}px -${position.y}px;`);
      css.push(`  width: ${sprite.width}px;`);
      css.push(`  height: ${sprite.height}px;`);
      css.push('}');
    }
    return css.join('\n');
  },
};

module.exports = CSSDescriptor;
