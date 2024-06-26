import fs from 'fs-extra';
import path from 'path';
import {expect} from 'chai';
import {HtmlReporter, ReportGenerator, ReportAggregator} from '../index.js';
import {RUNNER, SUITES} from './testdata.js';

let reportAggregator : ReportAggregator;

let htmlReporter  = new HtmlReporter({

    outputDir: './reports/html-reports/invalid/',
    filename: 'report.html',
    reportTitle: 'Unit Test Report Title',
    showInBrowser: false,
    browserName: "dummy",
    collapseTests: true,
    useOnAfterCommandForScreenshot: false
});

suite('HtmlReporter', () => {
    suiteSetup(function () {
        reportAggregator = new ReportAggregator({
            debug: false,
            outputDir: './reports/html-reports/invalid/',
            filename: 'master-report.html',
            reportTitle: 'Master Report',
            browserName : "test browser",
            showInBrowser: true,
            collapseTests: false,
            useOnAfterCommandForScreenshot: false
        });
        reportAggregator.clean();
    });
    //
    // describe('on create', function () {
    //     it('should verify initial properties', function () {
    //         expect(Array.isArray(htmlReporter.suiteUids)).to.equal(true);
    //         expect(htmlReporter.suiteUids.length).to.equal(0);
    //         expect(Array.isArray(htmlReporter.suites)).to.equal(true);
    //         expect(htmlReporter.suites.length).to.deep.equal(0);
    //         expect(htmlReporter.indents).to.equal(0);
    //         expect(htmlReporter.suiteIndents).to.deep.equal({});
    //         expect(htmlReporter.defaultTestIndent).to.equal('   ');
    //         expect(htmlReporter.metrics).to.deep.equal({
    //             passed: 0,
    //             skipped: 0,
    //             failed: 0,
    //             start: 0,
    //             end: 0,
    //             duration: 0
    //         });
    //     })
    // });
    test('onRunnerStart', function () {
        suiteSetup(function () {
            htmlReporter.onRunnerStart(RUNNER);
        });
        //This will fail.
        test('set cid test', function () {
            expect(htmlReporter._currentCid).to.equal("0-0");
        });
    });
    test('onRunnerEnd', function () {
        test('should call htmlOutput method', function () {
            (async () => {
                await htmlReporter.onRunnerEnd(RUNNER);
                let reportFile = path.join(process.cwd(), htmlReporter.options.outputDir, encodeURIComponent(htmlReporter._currentSuiteUid), encodeURIComponent(htmlReporter._currentCid), htmlReporter.options.filename);
                expect(fs.existsSync(reportFile)).to.equal(true);
                //wipe out output
                fs.emptyDirSync(path.join(process.cwd(), htmlReporter.options.outputDir, encodeURIComponent(htmlReporter._currentSuiteUid), encodeURIComponent(htmlReporter._currentCid)));
            })();
        });
        test('should invoke the reportAggregator', function () {
            (async () => {
                await reportAggregator.createReport();
                expect(fs.existsSync(reportAggregator.reportFile)).to.equal(true);
            })();

        })
    });

});
