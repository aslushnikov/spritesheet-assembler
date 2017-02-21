var path = require('path');
var fs = require('fs');
var rmsync = require('rimraf').sync;
var execFile = require('child_process').execFile;
var colors = require('colors');
var die = require('../utils').die;


var args = process.argv.slice(2);
var resetResults = args.indexOf('--reset-results');
if (resetResults !== -1)
    args.splice(resetResults, 1);
if (args.length > 1)
    die('Unknown arguments: ' + args.slice(1).join(' '));
var testFilter = args.length === 1 ? args[0] : '';

if (testFilter)
    console.log('ATTENTION:'.yellow + ' Running tests whose name include "' + testFilter + '"');
var testFolderRegex = /^\d\d-.*/;
var tests = fs.readdirSync(__dirname)
    .filter(fileName => testFolderRegex.test(fileName))
    .filter(fileName => fileName.includes(testFilter));
var reports = [];

var isResettingResults = resetResults !== -1;
if (isResettingResults) {
    resetTestResults();
} else {
    var testResultsFolder = path.join(__dirname, 'actual-results');
    rmsync(testResultsFolder);
    fs.mkdirSync(testResultsFolder);
    runNextTest();
}

function runNextTest() {
    if (!tests.length) {
        reportResults(reports);
        return;
    }
    var testName = tests.shift();
    var outputFolder = path.join(testResultsFolder, testName);
    fs.mkdirSync(outputFolder);
    runTest(testName, outputFolder, onTestComplete);

    function onTestComplete(testError) {
        var expectedOutput = path.join(__dirname, testName, 'expected');
        var report = new Report(testName, expectedOutput, outputFolder, testError);
        reports.push(report);
        runNextTest();
    }
}

function resetTestResults() {
    if (!tests.length) {
        console.log("Test results are regenerated.");
        return;
    }
    var testName = tests.shift();
    var outputFolder = path.join(__dirname, testName, 'expected');
    rmsync(outputFolder);
    fs.mkdirSync(outputFolder);
    runTest(testName, outputFolder, resetTestResults);
}

function runTest(testName, outputFolder, callback) {
    var argumentsFile = path.join(__dirname, testName, 'arguments.js');
    if (!fs.existsSync(argumentsFile)) {
        callback('test is missing arguments.js file');
        return;
    }

    var args = require(argumentsFile)(outputFolder);
    args.unshift(path.join(__dirname, '..', 'index.js'));
    execFile('node', args, (error, stdout, stderr) => {
        if (stderr)
            fs.writeFileSync(path.join(outputFolder, 'stderr.txt'), stderr);
        callback();
    });
}

function reportResults(reports) {
    var failed = reports.filter(report => !report.isOk());
    var ok = reports.filter(report => report.isOk());
    for (var report of reports)
        console.log(report.textTitle());
    console.log('================');
    console.log('PASSED: '.green + ok.length + '/' + reports.length);
    for (var fail of failed)
        console.log(fail.toText());
    if (!failed.length) {
        console.log('All tests passed.'.green);
        process.exit(0);
    } else {
        process.exit(1);
    }
}

class Report {
    constructor(testName, expectedFolder, actualFolder, testError) {
        this.testName = testName;
        this.expectedFolder = expectedFolder;
        this.actualFolder = actualFolder;
        this.missingFiles = [];
        this.unexpectedFiles = [];
        this.mismatchFiles = [];
        this.badTestError = testError;

        var expectedFiles = new Set();
        if (fs.existsSync(expectedFolder))
            expectedFiles = new Set(fs.readdirSync(expectedFolder));
        var actualFiles = new Set(fs.readdirSync(actualFolder));
        for (var actualFile of actualFiles) {
            if (!expectedFiles.has(actualFile))
                this.unexpectedFiles.push(actualFile);
        }
        for (var expectedFile of expectedFiles) {
            if (!actualFiles.has(expectedFile)) {
                this.missingFiles.push(expectedFile);
                continue;
            }
            var expectedBuffer = fs.readFileSync(path.join(expectedFolder, expectedFile));
            var actualBuffer = fs.readFileSync(path.join(actualFolder, expectedFile));
            if (!expectedBuffer.equals(actualBuffer))
                this.mismatchFiles.push(expectedFile);
            else
                fs.unlinkSync(path.join(actualFolder, expectedFile));
        }
        if (this.isOk())
            rmsync(actualFolder);
    }

    /**
     * @return {boolean}
     */
    isOk() {
        return !this.badTestError && !this.missingFiles.length && !this.unexpectedFiles.length && !this.mismatchFiles.length;
    }

    textTitle() {
        if (this.isOk())
            return 'success '.green + this.testName;
        if (this.badTestError)
            return 'invalid '.red + this.testName;
        return '   fail '.red + this.testName;
    }

    toText() {
        var padding = '            ';
        var text = this.textTitle();
        if (this.isOk())
            return text;
        if (this.badTestError)
            return text + '\n' + padding + '- ' + this.badTestError;
        var lines = [text];
        for (var missing of this.missingFiles)
            lines.push(padding + '- Failed to generate: ' + missing);
        for (var unexpected of this.unexpectedFiles) {
            lines.push(padding + '- Unexpectedly generated: ' + unexpected);
            if (unexpected === 'stderr.txt') {
                var content = fs.readFileSync(path.join(this.actualFolder, unexpected), 'utf8');
                content = content.split('\n').map(line => padding + '    ' + line).join('\n');
                lines.push(content);
            }
        }
        for (var mismatch of this.mismatchFiles)
            lines.push(padding + '- Mismatch content: ' + mismatch);
        return lines.join('\n');
    }
}
