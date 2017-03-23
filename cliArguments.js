var fs = require('fs');
var path = require('path');

class CLIArguments {
    /**
     * @param {string} inputFolderPath
     * @param {string} outputImagePath
     * @param {string} outputDescriptorPath
     * @param {string} descriptorType
     * @param {number} paddingLeft
     * @param {number} paddingRight
     */
    constructor(inputFolderPath, outputImagePath, outputDescriptorPath, descriptorType, paddingLeft, paddingRight) {
        this.inputFolderPath = inputFolderPath;
        this.outputImagePath = outputImagePath;
        this.outputDescriptorPath = outputDescriptorPath;
        this.descriptorType = descriptorType;
        this.paddingLeft = paddingLeft;
        this.paddingRight = paddingRight;
    }

    static parse(args) {
        var inputFolderPath;
        var outputImagePath;
        var outputDescriptorPath;
        var descriptorType;
        var paddingLeft;
        var paddingRight;
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
                if (paddingLeft !== undefined || paddingRight !== undefined)
                    die('cannot set padding argument when either padding-left or padding-right is given');
                if (!/^[1-9]\d*$/.test(value))
                    die('failed to parse number from --padding argument - ' + value);
                paddingLeft = parseInt(value);
                paddingRight = paddingLeft;
            } else if (key === '--padding-left') {
                if (paddingLeft !== undefined)
                    die('duplicate attempt to set padding-left argument');
                if (!/^[1-9]\d*$/.test(value))
                    die('failed to parse number from --padding-left argument - ' + value);
                paddingLeft = parseInt(value);
            } else if (key === '--padding-right') {
                if (paddingRight !== undefined)
                    die('duplicate attempt to set padding-right argument');
                if (!/^[1-9]\d*$/.test(value))
                    die('failed to parse number from --padding-right argument - ' + value);
                paddingRight = parseInt(value);
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
        if (!paddingLeft)
            paddingLeft = 0;
        if (!paddingRight)
            paddingRight = 0;
        // Validate options.
        if (!fs.existsSync(inputFolderPath))
            die("Input folder does not exist " + inputFolderPath);
        if (!fs.existsSync(path.dirname(outputImagePath)))
            die("Folder for output image does not exist " + outputImagePath);
        if (!fs.existsSync(path.dirname(outputDescriptorPath)))
            die("Folder for output descriptor does not exist " + outputDescriptorPath);
        return new CLIArguments(inputFolderPath, outputImagePath, outputDescriptorPath, descriptorType, paddingLeft, paddingRight);
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
