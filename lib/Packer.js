var SpriteSheet = require('./SpriteSheet');

var Packer = {
  SpriteSortOrder: {
    // Sort by decreasing of sprite width
    Width: (a, b) => b.width - a.width || Packer._compareNames(a, b),
    // Sort by decreasing of sprite height
    Height: (a, b) => b.height - a.height || Packer._compareNames(a, b),
    // Sort by decreasing of sprite maxside
    MaxSide: (a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height) || Packer._compareNames(a, b),
    // Sort by decreasing of sprite area
    Area: (a, b) => b.width * b.height - a.width * a.height || Packer._compareNames(a, b),
  },

  /**
   * @param {!Sprite} spriteA
   * @param {!Sprite} spriteB
   * @return {number}
   */
  _compareNames: function(spriteA, spriteB) {
    if (spriteA.filePath < spriteB.filePath)
      return -1;
    if (spriteA.filePath > spriteB.filePath)
      return 1;
    return 0;
  },

  /**
   * @param {!Array<!Sprite>} sprites
   * @param {!Packer.SpriteSortOrder} spriteComparator
   * @param {number} rightPadding
   * @param {number} bottomPadding
   * @return {!SpriteSheet}
   */
  packSprites: function(sprites, spriteComparator, rightPadding, bottomPadding) {
    console.assert(sprites.length, 'cannot create spritesheet with 0 sprites!');
    sprites.sort(spriteComparator);

    var totalWidth = sprites[0].width + rightPadding;
    var totalHeight = sprites[0].height + bottomPadding;
    /** @type {!Map<!Sprite, !{x: number, y: number}>} */
    var positions = new Map();

    var freeSpaces = new Set();
    freeSpaces.add({x: 0, y: 0, width: totalWidth, height: totalHeight});
    for (var sprite of sprites) {
      var spriteWidth = sprite.width + rightPadding;
      var spriteHeight = sprite.height + bottomPadding;
      var freeSpace = null;
      for (var space of freeSpaces) {
        if (space.width >= spriteWidth && space.height >= spriteHeight) {
          freeSpace = space;
          break;
        }
      }

      if (!freeSpace) {
        var canGrowRight = spriteHeight <= totalHeight;
        var canGrowDown = spriteWidth <= totalWidth;
        console.assert(canGrowDown || canGrowRight, 'cannot grow spritesheet in either direction!');
        // Lean towards square sprite sheet.
        var growRightAspectRatio = Math.abs(totalHeight / (totalWidth + spriteWidth) - 1);
        var growDownAspectRatio = Math.abs((totalHeight + spriteHeight) / totalWidth - 1);
        if (!canGrowDown || (canGrowRight && growRightAspectRatio < growDownAspectRatio)) {
          freeSpace = {x: totalWidth, y: 0, width: spriteWidth, height: totalHeight};
          totalWidth += spriteWidth;
        } else {
          freeSpace = {x: 0, y: totalHeight, width: totalWidth, height: spriteHeight};
          totalHeight += spriteHeight;
        }
      } else {
        freeSpaces.delete(freeSpace);
      }

      positions.set(sprite, {x: freeSpace.x, y: freeSpace.y});

      var rightSpace =
          {x: freeSpace.x + spriteWidth, y: freeSpace.y, width: freeSpace.width - spriteWidth, height: spriteHeight};
      var downSpace = {
        x: freeSpace.x,
        y: freeSpace.y + spriteHeight,
        width: freeSpace.width,
        height: freeSpace.height - spriteHeight
      };
      if (rightSpace.width && rightSpace.height)
        freeSpaces.add(rightSpace);
      if (downSpace.width && downSpace.height)
        freeSpaces.add(downSpace);
    }

    return SpriteSheet.fromPositions(positions);
  },

  /**
   * @param {!Array<!Sprite>} sprites
   * @param {number} rightPadding
   * @param {number} bottomPadding
   * @return {!SpriteSheet}
   */
  packEfficiently: function(sprites, rightPadding, bottomPadding) {
    var bestStyleSheet = null;
    var bestCoverage = 0;
    // Iterate over different sprite compositions to find best.
    for (var sortOrderName in Packer.SpriteSortOrder) {
      var sortOrder = Packer.SpriteSortOrder[sortOrderName];
      var spriteSheet = Packer.packSprites(sprites, sortOrder, rightPadding, bottomPadding);
      var coverage = spriteSheet.coverage();
      if (!bestStyleSheet || coverage > bestCoverage) {
        bestStyleSheet = spriteSheet;
        bestCoverage = coverage;
      }
    }
    return bestStyleSheet;
  },

  /**
   * @param {!Array<!Sprite>} sprites
   * @param {number} rightPadding
   * @param {number} bottomPadding
   * @param {number} cellWidth
   * @param {number} cellHeight
   * @return {!SpriteSheet}
   */
  packInGrid: function(sprites, rightPadding, bottomPadding, cellWidth, cellHeight) {
    var gridWidth = Math.ceil(Math.sqrt(sprites.length));
    var gridHeight = Math.ceil(sprites.length / gridWidth);
    /** @type {!Map<!Sprite, !{x: number, y: number}>} */
    var positions = new Map();
    for (var i = 0; i < sprites.length; ++i) {
        var sprite = sprites[i];
        console.assert(sprite.width <= cellWidth && sprite.height <= cellHeight, `Sprite ${sprite.filePath} cannot fit into the given cell size: ${cellWidth} x ${cellHeight}`);
        var row = Math.floor(i / gridWidth);
        var column = i % gridWidth;
        var x = column * (cellWidth + rightPadding);
        var y = row * (cellHeight + bottomPadding);
        var offsetX = Math.floor((cellWidth - sprite.width)/2);
        var offsetY = Math.floor((cellHeight - sprite.height)/2);
        positions.set(sprite, {
            x: x + offsetX,
            y: y + offsetY
        });
    }
    var width = gridWidth * cellWidth + (gridWidth - 1) * rightPadding;
    var height = gridHeight * cellHeight + (gridHeight - 1) * bottomPadding;
    return new SpriteSheet(positions, width, height);
  }
};

module.exports = Packer;
