var path = require('path');

var licenseHeader = [
  '// Copyright 2017 The Chromium Authors. All rights reserved.',
  '// Use of this source code is governed by a BSD-style license that can be', '// found in the LICENSE file.'
].join('\n');

var generatedFileNotice = ['/**', ' * NOTICE: This file was generated by spritesheet_assembler.', ' */'].join('\n');


var DevToolsDescriptor = {
  /**
   * @param {!SpriteSheet} spriteSheet
   * @param {string} imageOutputPath
   * @return {string}
   */
  generate: function(spriteSheet, imageOutputPath) {
    // Manually craft json which alines with our style.
    var json = 'UI.Icon.setSpriteSheet({';
    json += `\n  size: '${spriteSheet.width()}px ${spriteSheet.height()}px',`;
    json += '\n  descriptors: {';
    for (var sprite of spriteSheet.sprites()) {
      var extension = path.extname(sprite.filePath);
      var spriteName = path.basename(sprite.filePath, extension);
      var isMask = false;
      if (spriteName.endsWith('-mask')) {
        spriteName = spriteName.replace(/-mask$/, '');
        isMask = true;
      }
      var descriptor = `'${spriteName}': {`;
      var position = spriteSheet.spritePosition(sprite);
      descriptor += 'x: ' + (-position.x);
      descriptor += ', y: ' + (-position.y);
      descriptor += ', width: ' + sprite.width;
      descriptor += ', height: ' + sprite.height;
      if (isMask)
        descriptor += ', isMask: ' + isMask;
      descriptor += '},';
      json += '\n    ' + descriptor;
    }
    json += '\n  }';
    json += '\n});';
    var fileHeader = licenseHeader + '\n\n' + generatedFileNotice + '\n\n';
    return fileHeader + json;
  },
};

module.exports = DevToolsDescriptor;