var path = require('path');

var CSSDescriptor = {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @return {string}
   */
  generate: function(spriteSheet) {
    var css = [
        '.icon {',
        "  background-image: url('../images/sprite.png');",
        `  background-size: ${spriteSheet.width()}px ${spriteSheet.height()}px;`,
        '}',
    ];
    for (var sprite of spriteSheet.sprites()) {
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
