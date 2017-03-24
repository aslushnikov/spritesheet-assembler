# Spritesheet Assembler [![Build Status](https://travis-ci.org/aslushnikov/spritesheet-assembler.svg?branch=master)](https://travis-ci.org/aslushnikov/spritesheet-assembler)
- Support for SVG/PNG/JPG sprites
- Generate CSS/JSON descriptors
- Simple: tiny source, minimal dependencies. Please fork/contribute!

## Install
This package relies on GraphicsMagick, so:
- OS X: `brew install graphicsmagick`
- Linux: `sudo apt-get install graphicsmagick`

Install:
```bash
npm install -g spritesheet-assembler
```
And run:
```bash
spass -i icons/ -o images/spritesheet.png -d styles/icons.css
```

## Demos

1. CSS SpriteSheet [demo](https://aslushnikov.github.io/spritesheet-assembler/demos/css-spritesheet/)
2. Spritesheet packing algorithm [demo](https://aslushnikov.github.io/spritesheet-assembler/demos/algorithm/)
3. Check out utility results in  [tests](https://github.com/aslushnikov/spritesheet-assembler/tree/master/tests)

## Algorithm

- [Demo](https://aslushnikov.github.io/spritesheet-assembler/demos/algorithm/)
- [Source](https://github.com/aslushnikov/spritesheet-assembler/blob/master/lib/Packer.js#L35)

Spritesheet packing algorithm is based on the one described in  [Jake's great article](http://codeincomplete.com/posts/bin-packing/). This implementation, however, doesn't use binary tree, maintaining instead a list of free spaces.

## Code Overview

The code is split into three parts:
- `lib/` - all the logic of bin-packing is here. Lib provides core abstractions of
`Sprite` and `SpriteSheet`, as well as the bin-packing algorithm itself. This
folder **doesn't and shouldn't** depend on any core node modules.
- `compositors/` - this folder contains *compositors*, which are responsible for building actual spritesheet out of sprites. Compositors are associated with export mime types, the relation is defined in `compositors/index.js`.
- `descriptors/` - this folder contains spritesheet descriptor generators. Descriptor generators are associated with the name (which is passed to the utility via `-t` argument). The relation between names and descriptor generators is defined in `descriptors/index.js`.

## Tests

Each test runs spritesheet-assembler with given arguments and compares generated files with expected results.

To run all tests:
```bash
npm test
```

To run only tests with 'svg' in name:
```bash
npm test -- svg
```

To reset test results for all svg tests: (or generate results for a newly added test):
```bash
npm test -- svg reset-results
```
To add a test:

1. create a new folder under `tests/` folder which starts with
two-digit number, e.g. `tests/01-some-new-test/`.
2. add `arguments.js` file which should define input arguments for the utility: [example](https://github.com/aslushnikov/spritesheet-assembler/blob/master/tests/01-svg-simple/arguments.js)

## History

This started as a patch to Chrome DevTools project: https://codereview.chromium.org/2671413004/

## License
See [LICENSE](https://github.com/aslushnikov/spritesheet-assembler/blob/master/LICENSE) here.

## Contacts

Feel free to drop me a line at [aslushnikov@gmail.com](mailto:aslushnikov.com) or via [twitter](https://twitter.com/aslushnikov)
