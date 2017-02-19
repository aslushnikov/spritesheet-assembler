# Spritesheet Assembler

## Install

```bash
npm install -g spritesheet-assembler
```

## Use

```bash
spass -i icons/ -o images/spritesheet.png -d styles/icons.css -t css
```

## Supported formats

- SVG
- PNG
- JPG

## Algorithm

TBD

## Architecture Overview

TBD

## Tests

To run all tests;
```bash
npm test
```

To run only tests with 'svg' in name:
```bash
npm test -- svg
```

To reset test results (or generate a results for a newly added test):
```bash
npm test -- --reset-results
```

## History

This started as a patch to Chrome DevTools project: https://codereview.chromium.org/2671413004/


