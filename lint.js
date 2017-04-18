var path = require('path');
var fs = require('fs');

var sourceFiles = [
    'lib/Sprite.js',
    'lib/SpriteSheet.js',
    'lib/Packer.js',
];

var jsCode = sourceFiles.map(filePath => ({
    src: fs.readFileSync(path.join(__dirname, filePath), 'utf8'),
    path: filePath
}));

var compile = require('google-closure-compiler-js').compile;
var flags = {
    jsCode: jsCode,
    languageIn: 'ECMASCRIPT6_STRICT',
    languageOut: 'ECMASCRIPT5',
    warningLevel: 'VERBOSE',
    processCommonJsModules: true,
    checksOnly: true
};
var out = compile(flags);
for (var warn of out.warnings)
    console.warn(warn);
for (var error of out.errors)
    console.error(error);
if (!out.warnings.length && !out.errors.length)
    console.log('Ok.');
