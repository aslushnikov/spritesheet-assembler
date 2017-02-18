var fs = require('fs');
var path = require('path');
var mime = require('mime');
var utils = require('./utils');
var Packer = require('./lib/Packer');
var compositors = require('./compositors');
var descriptors = require('./descriptors');

var timestamp = 0;
function markStart() {
  timestamp = Date.now();
}
function markEnd(label) {
  console.log('==> ' + label + ': ' + (Date.now() - timestamp) + 'ms');
}

var cliArguments = require('./cliArguments');
var outputMimeType = mime.lookup(cliArguments.outputImagePath);
var compositor = compositors[outputMimeType];
if (!compositor)
    die('Cannot generate output image with mime type ' + outputMimeType);
var descriptor = descriptors[cliArguments.descriptorType];
if (!descriptor)
    die('Cannot find descriptor generator of type ' + cliArguments.descriptorType);

// 1. Read all the svg files from given directory.
markStart();
var sprites = utils.readSpritesFromFolder(cliArguments.inputFolderPath);
markEnd('Loaded ' + sprites.length + ' files');

// 2. Build optimal spritesheet.
markStart();
var spriteSheet = Packer.packEfficiently(sprites, cliArguments.padding, cliArguments.padding);
markEnd(
  'Created spritesheet ' + spriteSheet.width() + 'x' + spriteSheet.height() + ' with ' +
  ((spriteSheet.coverage() * 10000 | 0) / 100) + '% coverage');

// 3. Compose image and write descriptors.
markStart();
var resultImage = compositor.compose(spriteSheet);
var resultDescriptor = descriptor.generate(spriteSheet);
fs.writeFileSync(cliArguments.outputImagePath, resultImage);
fs.writeFileSync(cliArguments.outputDescriptorPath, resultDescriptor);
markEnd(
  'Generated ' + path.basename(cliArguments.outputImagePath) + ' and ' +
  path.basename(cliArguments.outputDescriptorPath));

