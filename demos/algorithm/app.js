document.addEventListener('DOMContentLoaded', onLoaded);

var sprites;
var spriteSheet;
var maxWidth, maxHeight;

var presets = {
    'simple': [
        '500 x 200',
        '250 x 200',
        '50 x 50 x 20',
    ],
    'square': [
        '50 x 50 x 100',
    ],
    'tall': [
        "50 x 400 x 2",
        "50 x 300 x 5",
        "50 x 200 x 10",
        "50 x 100 x 20",
        "50 x 50 x 40",
    ],
    'wide': [
        "400 x 50 x 2",
        "300 x 50 x 5",
        "200 x 50 x 10",
        "100 x 50 x 20",
        "50 x 50 x 40",
    ],
    'tall-and-wide': [
        "400 x 100",
        "100 x 400",
        "400 x 100",
        "100 x 400",
        "400 x 100",
        "100 x 400",
    ],
    'powers-of-2': [
        "2 x 2 x 256",
        "4 x 4 x 128",
        "8 x 8 x 64",
        "16 x 16 x 32",
        "32 x 32 x 16",
        "64 x 64 x 8",
        "128 x 128 x 4",
        "256 x 256 x 2",
    ],
    'odd-and-even': [
        "50 x 50 x 20",
        "47 x 31 x 20",
        "23 x 17 x 20",
        "109 x 42 x 20",
        "42 x 109 x 20",
        "17 x 33 x 20",
    ],
    'complex': [
        "100 x 100 x 3",
        "60 x 60 x 3",
        "50 x 20 x 20",
        "20 x 50 x 20",
        "250 x 250",
        "250 x 100",
        "100 x 250",
        "400 x 80",
        "80 x 400",
        "10 x 10 x 100",
        "5 x 5 x 500",
    ],
    'devtools-icons': [
        "28 x 24 x 57",
        "10 x 10 x 17",
        "32 x 24 x 8",
        "16 x 16 x 6",
        "10 x 8 x 3",
        "13 x 13 x 3",
        "12 x 12 x 2",
        "14 x 14 x 2",
        "11 x 11",
        "9 x 9",
        "12 x 14 x 2",
        "24 x 26",
    ],
}

function onLoaded() {
    document.querySelector('select').addEventListener('input', onPresetChange);
    onPresetChange();
    document.querySelector('textarea').addEventListener('input', onTextAreaInput);
    document.querySelector('#paddingInput').addEventListener('input', onPaddingInput);
    onPaddingInput();
    window.addEventListener('resize', onResize, false);
    onResize();
}

function onResize() {
    var rect = document.querySelector('.result').getBoundingClientRect();
    maxWidth = rect.width;
    maxHeight = rect.height;
    updateSpriteSheetScale();
}

function onPresetChange() {
    var textArea = document.querySelector('textarea');
    var presetName = document.querySelector('select').value;
    var preset = presets[presetName];
    if (!preset)
        return;
    textArea.value = preset.join('\n');
    onTextAreaInput();
}

function onTextAreaInput() {
    sprites = null;
    spriteSheet = null;
    generateModelsAndRender();
}

function onPaddingInput() {
    paddingValue.value = paddingInput.value;
    spriteSheet = null;
    generateModelsAndRender();
}

function generateModelsAndRender() {
    if (!sprites) {
        var textArea = document.querySelector('textarea');
        var value = textArea.value;
        var lines = value.split('\n');
        sprites = [];
        for (var line of lines) {
            if (!/^[1-9]\d*\s*x\s*[1-9]\d*(\s*x\s*[1-9]\d*)?$/.test(line))
                continue;
            var tokens = line.split(/\s*x\s*/);
            var w = parseInt(tokens[0]);
            var h = parseInt(tokens[1]);
            var n = parseInt(tokens[2]) || 1;
            for (var i = 0; i < n; ++i)
                sprites.push(new Sprite('', 'image/jpeg', w, h));
        }
        document.querySelector('.stats-sprites-count').textContent = `total sprites: ${sprites.length}`;
    }
    if (!spriteSheet) {
        var paddingInput = document.querySelector('#paddingInput');
        var padding = parseInt(paddingInput.value);
        var startTime = Date.now();
        spriteSheet = Packer.packEfficiently(sprites, padding, padding);
        var endTime = Date.now();
        document.querySelector('.stats-time').textContent = `time: ${endTime - startTime}ms`;
    }
    render(spriteSheet);
}

function render(spriteSheet) {
    var container = document.querySelector('.spritesheet');
    container.innerHTML = '';
    var svg = createSVG('svg');
    container.appendChild(svg);
    svg.setAttribute('width', spriteSheet.width());
    svg.setAttribute('height', spriteSheet.height());
    var palette = generatePalette(20);
    var paletteIndex = 0;
    var maxRotation = 10;
    var minRotation = 4;
    for (var sprite of spriteSheet.sprites()) {
        var rect = createSVG('rect');
        var position = spriteSheet.spritePosition(sprite);
        rect.setAttribute('x', position.x + 'px');
        rect.setAttribute('y', position.y + 'px');
        rect.setAttribute('width', sprite.width + 'px');
        rect.setAttribute('height', sprite.height + 'px');
        rect.setAttribute('fill', palette[paletteIndex]);
        rect.setAttribute('stroke', 'black');
        rect.setAttribute('stroke-width', '1px');
        var sign = Math.random() < 0.5 ? -1 : 1;
        var rotation = ((maxRotation - minRotation) * Math.random() + minRotation) * sign|0;
        rect.setAttribute('style', `--rotation: ${rotation}deg`);
        svg.appendChild(rect);
        paletteIndex = (paletteIndex + 1) % palette.length;
    }
    updateSpriteSheetScale();

    var coverage = (spriteSheet.coverage() * 10000 | 0) / 100;
    document.querySelector('.stats-coverage').textContent = `coverage: ${coverage}%`;
    document.querySelector('.stats-size').textContent = `size: ${spriteSheet.width()} x ${spriteSheet.height()}`;
}

function updateSpriteSheetScale() {
    if (!maxWidth || !maxHeight || !spriteSheet)
        return;
    var scale = 1;
    if (spriteSheet.width() > maxWidth || spriteSheet.height() > maxHeight)
        scale = Math.min(maxWidth / spriteSheet.width(), maxHeight / spriteSheet.height());
    var container = document.querySelector('.spritesheet');
    container.setAttribute('style', `transform: scale(${scale});`);
}

function createSVG(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function generatePalette(amount) {
    var result = [];
    var hueStep = 360 / amount;
    for (var i = 0; i < amount; ++i) {
        result.push(`hsl(${hueStep * i}, 100%, 90%)`);
    }
    return result;
}

