import fs from 'fs-extra';
import path from 'path';
import {expect} from 'chai';
import {HtmlReporter, ReportGenerator, ReportAggregator} from '../index.js';
import {RUNNER, SUITES} from './testdata.js';

let htmlReporter  = new HtmlReporter({
    outputDir: './reports/html-reports/valid',
    filename: 'report.html',
    reportTitle: 'Unit Test Report Title',
    browserName: "dummy"
});
let reportAggregator  = new ReportAggregator({
        outputDir: './reports/html-reports/valid',
        filename: 'master-report.html',
        reportTitle: 'Master Report',
        browserName : "test browser",
        produceJson: true,
    });
    reportAggregator.clean();

suite('HtmlReporter', async () => {
   test('on create should verify initial properties', async () => {
        expect(htmlReporter._suiteUids.size).to.deep.equal(0);
        expect(htmlReporter._indents).to.equal(0);
        expect(htmlReporter._suiteIndents).to.deep.equal({});
        expect(htmlReporter.defaultTestIndent).to.equal('   ');
        expect(htmlReporter.metrics).to.deep.equal({
            passed: 0,
            skipped: 0,
            failed: 0,
            duration: 0
        });
    });
    test('onRunnerStart should set cid', async () =>  {
        htmlReporter.onRunnerStart(RUNNER);
        expect(htmlReporter._currentCid).to.equal(RUNNER.cid);
     });
    test('onSuiteStart should add to suiteUids', async () =>  {
        htmlReporter.onSuiteStart(SUITES[0])
        expect(htmlReporter._suiteUids.size).to.equal(1);
        // expect(htmlReporter._suiteUids[0]).to.equal('Foo test1')
        expect(htmlReporter._currentSuiteUid).to.equal('Foo test1')
        expect(htmlReporter._suiteIndents['Foo test1']).to.equal(1)
    });

    test('onTestStart', async () =>  {
        htmlReporter.onTestStart(SUITES[0].tests[0])
    });
    test('onTestPass', async () =>  {
        htmlReporter.onTestPass(SUITES[0].tests[0])
        expect(htmlReporter.metrics.passed).to.equal(1)
        htmlReporter.onTestEnd(SUITES[0].tests[0])
    });

    test('onTestStart', async () =>  {
        htmlReporter.onTestStart(SUITES[0].tests[1])
    });
    test('onTestFail', async () =>  {
        htmlReporter.onTestFail(SUITES[0].tests[1])
        expect(htmlReporter.metrics.failed).to.equal(1)
        htmlReporter.onTestEnd(SUITES[0].tests[1])
    });

    test('onTestStart', async () =>  {
        htmlReporter.onTestStart(SUITES[0].tests[2])
    });
    test('onTestSkip', async () =>  {
        htmlReporter.onTestSkip(SUITES[0].tests[2])
        expect(htmlReporter.metrics.skipped).to.equal(1)
        htmlReporter.onTestEnd(SUITES[0].tests[2])
    });

    test('onTestEnd', async () =>  {
        htmlReporter.onTestEnd(SUITES[0].tests[0]);
        htmlReporter.onTestEnd(SUITES[0].tests[1]);
        htmlReporter.onTestEnd(SUITES[0].tests[2]);
    });


    test('onSuiteEnd', async () =>  {
        htmlReporter.onSuiteEnd(SUITES[0])

        test('should decrease indents', async () =>  {
            expect(htmlReporter._indents).to.equal(0)
        });

        test('should add the suite to the suites array', async () =>  {
            expect(htmlReporter._suiteUids.size).to.equal(1)
        })
    });

    test('call reportAggregator', async () =>  {
        await htmlReporter.onRunnerEnd(RUNNER);
        await reportAggregator.createReport();
        expect(fs.existsSync(reportAggregator.reportFile)).to.equal(true);
    });

});
