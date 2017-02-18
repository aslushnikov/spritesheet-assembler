var fs = require('fs');
var path = require('path');
var descriptors = require('./descriptors');

function die(message) {
    console.error("FAILED: " + message);
    process.exit(1);
}

class CLIArguments {
    constructor(inputFolderPath, outputImagePath, outputDescriptorPath, descriptor, padding) {
        this.inputFolderPath = inputFolderPath;
        this.outputImagePath = outputImagePath;
        this.outputDescriptorPath = outputDescriptorPath;
        this.descriptor = descriptor;
        this.padding = padding;
    }
}

function parseCommandLineArguments() {
    var inputFolderPath;
    var outputImagePath;
    var outputDescriptorPath;
    var descriptor;
    var padding = 0; // Default padding is 0.
    for (var i = 2; i < process.argv.length; i += 2) {
        var key = process.argv[i].toLowerCase();
        var value = process.argv[i + 1];
        if (key === '-h' || key === '--help') {
            console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
            process.exit(0);
        } else if (key === '-i' || key === '--input-folder') {
            if (inputFolderPath)
                die('duplicate argument --input-folder');
            inputFolderPath = path.join(process.cwd(), value);
        } else if (key === '-o' || key === '--output-image') {
            if (outputImagePath)
                die('duplicate argument --output-imaage');
            outputImagePath = path.join(process.cwd(), value);
        } else if (key === '-d' || key === '--output-descriptor') {
            if (outputDescriptorPath)
                die('duplicate argument --output-descriptor');
            outputDescriptorPath = path.join(process.cwd(), value);
        } else if (key === '-t' || key === '--descriptor-type') {
            if (descriptor)
                die('duplicate argument --descriptor-type');
            descriptor = descriptors[value.toLowerCase()];
            if (!descriptor)
                die("Unknown value of --descriptor-type - " + value);
        } else if (key === '-p' || key === '--padding') {
            if (padding !== null)
                die('duplicate argument --padding');
            if (!/^[1-9]\d*$/.test(value))
                die('failed to parse number from --padding argument - ' + value);
            padding = parseInt(value);
        }
    }
    // Assert required options.
    if (!inputFolderPath)
        die("Required argument --input-folder is missing");
    if (!outputImagePath)
        die("Required argument --output-image is missing");
    if (!outputDescriptorPath)
        die("Required argument --output-descriptor is missing");
    if (!descriptor)
        die("Required argument --descriptor-type is missing");
    // Validate options.
    if (!fs.existsSync(inputFolderPath))
        die("Input folder does not exist " + inputFolderPath);
    if (!fs.existsSync(path.dirname(outputImagePath)))
        die("Folder for output image does not exist " + outputImagePath);
    if (!fs.existsSync(path.dirname(outputDescriptorPath)))
        die("Folder for output descriptor does not exist " + outputDescriptorPath);
    return new CLIArguments(inputFolderPath, outputImagePath, outputDescriptorPath, descriptor, padding);
}

// Call parsing right away.
module.exports = parseCommandLineArguments();
