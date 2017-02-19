var fs = require('fs');
var path = require('path');

class CLIArguments {
    /**
     * @param {string} inputFolderPath
     * @param {string} outputImagePath
     * @param {string} outputDescriptorPath
     * @param {string} descriptorType
     * @param {number} padding
     */
    constructor(inputFolderPath, outputImagePath, outputDescriptorPath, descriptorType, padding) {
        this.inputFolderPath = inputFolderPath;
        this.outputImagePath = outputImagePath;
        this.outputDescriptorPath = outputDescriptorPath;
        this.descriptorType = descriptorType;
        this.padding = padding;
    }

    static parse(args) {
        var inputFolderPath;
        var outputImagePath;
        var outputDescriptorPath;
        var descriptorType;
        var padding;
        for (var i = 0; i < args.length; i += 2) {
            var key = args[i].toLowerCase();
            var value = args[i + 1];
            if (key === '-i' || key === '--input-folder') {
                if (inputFolderPath)
                    die('duplicate argument --input-folder');
                inputFolderPath = resolvePath(value);
            } else if (key === '-o' || key === '--output-image') {
                if (outputImagePath)
                    die('duplicate argument --output-imaage');
                var dirName = path.dirname(value);
                var fileName = path.basename(value);
                outputImagePath = path.join(resolvePath(dirName), fileName);
            } else if (key === '-d' || key === '--output-descriptor') {
                if (outputDescriptorPath)
                    die('duplicate argument --output-descriptor');
                var dirName = path.dirname(value);
                var fileName = path.basename(value);
                outputDescriptorPath = path.join(resolvePath(dirName), fileName);
            } else if (key === '-t' || key === '--descriptor-type') {
                if (descriptorType)
                    die('duplicate argument --descriptor-type');
                descriptorType = value.toLowerCase();
            } else if (key === '-p' || key === '--padding') {
                if (padding !== undefined)
                    die('duplicate argument --padding');
                if (!/^[1-9]\d*$/.test(value))
                    die('failed to parse number from --padding argument - ' + value);
                padding = parseInt(value);
            } else {
                die('unknown argument: ' + key);
            }
        }
        // Assert required options.
        if (!inputFolderPath)
            die("Required argument --input-folder is missing");
        if (!outputImagePath)
            die("Required argument --output-image is missing");
        if (!outputDescriptorPath)
            die("Required argument --output-descriptor is missing");
        if (!descriptorType)
            die("Required argument --descriptor-type is missing");

        // Assign default options.
        if (!padding)
            padding = 0;
        // Validate options.
        if (!fs.existsSync(inputFolderPath))
            die("Input folder does not exist " + inputFolderPath);
        if (!fs.existsSync(path.dirname(outputImagePath)))
            die("Folder for output image does not exist " + outputImagePath);
        if (!fs.existsSync(path.dirname(outputDescriptorPath)))
            die("Folder for output descriptor does not exist " + outputDescriptorPath);
        return new CLIArguments(inputFolderPath, outputImagePath, outputDescriptorPath, descriptorType, padding);
    }
}

function resolvePath(p) {
    if (fs.existsSync(p))
        return p;
    p = path.join(process.cwd(), p);
    return p;
}

function die(message) {
    throw new Error(message);
}

module.exports = CLIArguments;
