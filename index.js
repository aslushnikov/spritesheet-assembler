var fs = require('fs');
var Packer = require('./lib/Packer');
var SVGCompositor = require('./lib/SVGCompositor');
var utils = require('./lib/utils');

var timestamp = 0;
function markStart() {
  timestamp = Date.now();
}
function markEnd(label) {
  console.log('==> ' + label + ': ' + (Date.now() - timestamp) + 'ms');
}

var cliArguments = require('./cliArguments');

// 1. Read all the svg files from given directory.
markStart();
var sprites = utils.readSpritesFromFolder(cliArguments.inputFolderPath);
markEnd('Loaded ' + sprites.length + ' files');

// 2. Iterate over different sprite compositions to find best.
markStart();
var bestStyleSheet = Packer.packEfficiently(sprites, cliArguments.padding, cliArguments.padding);
var bestCoverage = bestStyleSheet.coverage();
markEnd(
  'Created spritesheet ' + bestStyleSheet.width() + 'x' + bestStyleSheet.height() + ' with ' +
  ((bestCoverage * 10000 | 0) / 100) + '% coverage');

// 3. Write results to disk
fs.writeFileSync(cliArguments.outputImagePath, SVGCompositor.compose(bestStyleSheet));
fs.writeFileSync(cliArguments.outputDescriptorPath, cliArguments.descriptor.generate(bestStyleSheet));

