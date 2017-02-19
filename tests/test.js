var path = require('path');
var fs = require('fs');
var rmsync = require('rimraf').sync;
var execFile = require('child_process').execFile;

var testFolderRegex = /^\d\d-.*/;
var tests = fs.readdirSync(__dirname)
    .filter(fileName => testFolderRegex.test(fileName));
var reports = [];

var isResettingResults = process.argv.indexOf('--reset-results') !== -1;
var testResultsFolder = path.join(__dirname, 'actual-results');
rmsync(testResultsFolder);

if (isResettingResults) {
    resetTestResults();
} else {
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

    function onTestComplete() {
        var expectedOutput = path.join(__dirname, testName, 'expected');
        var report = new Report(testName, expectedOutput, outputFolder);
        reports.push(report);
        runNextTest();
    }
}

function resetTestResults() {
    if (!tests.length)
        return;
    var testName = tests.shift();
    var outputFolder = path.join(__dirname, testName, 'expected');
    rmsync(outputFolder);
    fs.mkdirSync(outputFolder);
    runTest(testName, outputFolder, resetTestResults);
}

function runTest(testName, outputFolder, callback) {
    var args = require(path.join(__dirname, testName, 'arguments.js'))(outputFolder);
    args.unshift(path.join(__dirname, '..', 'index.js'));
    execFile('node', args, (error, stdout, stderr) => {
        if (stderr)
            fs.writeFileSync(path.join(outputFolder, 'stderr.txt'), stderr);
        callback();
    });
}

function reportResults(reports) {
    var allOk = true;
    for (var report of reports) {
        allOk = allOk && report.isOk();
        console.log(report.toText());
    }
    if (!allOk)
        console.log("FAILED. See actual results at ./tests/actual-results");
}

class Report {
    constructor(testName, expectedFolder, actualFolder) {
        this.testName = testName;
        this.expectedFolder = expectedFolder;
        this.actualFolder = actualFolder;
        this.missingFiles = [];
        this.unexpectedFiles = [];
        this.mismatchFiles = [];

        var expectedFiles = new Set(fs.readdirSync(expectedFolder));
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
        return !this.missingFiles.length && !this.unexpectedFiles.length && !this.mismatchFiles.length;
    }

    toText() {
        if (this.isOk())
            return this.testName + '    SUCCESS';
        var text = this.testName + '    FAIL\n';
        var lines = [];
        for (var missing of this.missingFiles)
            lines.push('    - Failed to generate: ' + missing);
        for (var unexpected of this.unexpectedFiles)
            lines.push('    - Unexpectedly generated: ' + unexpected);
        for (var mismatch of this.mismatchFiles)
            lines.push('    - Mismatch content: ' + mismatch);
        return text + lines.join('\n');
    }
}
