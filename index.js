#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var utils = require('./utils');
var Packer = require('./lib/Packer');
var CLIArguments = require('./cliArguments');
var compositors = require('./compositors');
var descriptors = require('./descriptors');

var timestamp = 0;
function markStart() {
  timestamp = Date.now();
}
function markEnd(label) {
  console.log('==> ' + label + ': ' + (Date.now() - timestamp) + 'ms');
}

if (process.argv.length <= 2) {
    utils.showUsage();
    return;
}

if (process.argv.length === 3 && (process.argv[2].toLowerCase() === "-h" || process.argv[2].toLowerCase() === "--help")) {
    utils.showUsage();
    return;
}

if (process.argv.length === 3 && (process.argv[2].toLowerCase() === "-v" || process.argv[2].toLowerCase() === "--version")) {
    console.log(require('./package.json').version);
    return;
}

var cliArguments;
try {
    cliArguments = CLIArguments.parse(process.argv.slice(2));
} catch (e) {
    utils.die(e.message);
    return;
}
var outputMimeType = mime.lookup(cliArguments.outputImagePath);
var compositor = compositors[outputMimeType];
if (!compositor)
    utils.die('Cannot generate output image with mime type ' + outputMimeType);
var descriptor = descriptors[cliArguments.descriptorType];
if (!descriptor)
    utils.die('Cannot find descriptor generator of type ' + cliArguments.descriptorType);

// 1. Read all the svg files from given directory.
markStart();
var sprites = utils.readSpritesFromFolder(cliArguments.inputFolderPath);
markEnd('Loaded ' + sprites.length + ' files');

// 2. Build optimal spritesheet.
markStart();
var spriteSheet = cliArguments.gridCell ? Packer.packInGrid(sprites, cliArguments.paddingRight, cliArguments.paddingBottom, cliArguments.gridCell.width, cliArguments.gridCell.height) : Packer.packEfficiently(sprites, cliArguments.paddingRight, cliArguments.paddingBottom);
markEnd(
  'Created spritesheet ' + spriteSheet.width() + 'x' + spriteSheet.height() + ' with ' +
  ((spriteSheet.coverage() * 10000 | 0) / 100) + '% coverage');

// 3. Compose image and write descriptors.
markStart();
var resultDescriptor = descriptor.generate(spriteSheet, cliArguments.outputImagePath);
fs.writeFileSync(cliArguments.outputDescriptorPath, resultDescriptor);

compositor.compose(spriteSheet)
          .then(onSuccess)
          .catch(onFailure);

function onSuccess(buffer) {
    fs.writeFileSync(cliArguments.outputImagePath, buffer);
    markEnd(
      'Generated ' + path.basename(cliArguments.outputImagePath) + ' and ' +
      path.basename(cliArguments.outputDescriptorPath));
}

function onFailure(err) {
    utils.die(err);
}
