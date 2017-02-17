var fs = require('fs');
var path = require('path');
var SVGSprite = require('./SVGSprite');
var Packer = require('./Packer');
var DevToolsDescriptors = require('./DevToolsDescriptors');

var timestamp = 0;
function markStart() {
  timestamp = Date.now();
}
function markEnd(label) {
  console.log('==> ' + label + ': ' + (Date.now() - timestamp) + 'ms');
}

/**
 * @param {string} directoryPath
 * @param {number} padding
 * @param {string} outputSVGPath
 * @param {string} outputJSPath
 */
module.exports = function(directoryPath, padding, outputSVGPath, outputJSPath) {
  // 1. Read all the svg files from given directory.
  markStart();
  var svgFilePaths = fs.readdirSync(directoryPath)
                         .filter(file => path.extname(file) === '.svg')
                         .map(fileName => path.join(directoryPath, fileName));

  var sprites = [];
  var spritesArea = 0;
  for (var filePath of svgFilePaths) {
    var sprite = SVGSprite.loadFromFile(filePath);
    spritesArea += sprite.width * sprite.height;
    sprites.push(sprite);
  }
  markEnd('Loaded ' + svgFilePaths.length + ' files');

  // 2. Iterate over different sprite compositions to find best.
  markStart();
  var bestStyleSheet = null;
  var bestCoverage = 0;
  for (var sortOrderName in Packer.SpriteSortOrder) {
    var sortOrder = Packer.SpriteSortOrder[sortOrderName];
    var spriteSheet = Packer.packSprites(sprites, sortOrder, padding, padding);
    var coverage = spritesArea / (spriteSheet.width() * spriteSheet.height());
    if (!bestStyleSheet || coverage > bestCoverage) {
      bestStyleSheet = spriteSheet;
      bestCoverage = coverage;
    }
  }
  markEnd(
      'Created spritesheet ' + bestStyleSheet.width() + 'x' + bestStyleSheet.height() + ' with ' +
      ((bestCoverage * 10000 | 0) / 100) + '% coverage');

  // 3. Write results to disk
  fs.writeFileSync(outputSVGPath, bestStyleSheet.svgText());
  fs.writeFileSync(outputJSPath, DevToolsDescriptors.generateJS(bestStyleSheet));
}
