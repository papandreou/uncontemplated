var expect = require('unexpected');
var processTemplateString = require('../lib/processTemplateString');

describe('processTemplateString', function () {
    it('should process a simple pattern with no args', function () {
        expect(processTemplateString`${123} to be a number`, 'to equal', {
            subject: 123,
            testDescriptionString: 'to be a number',
            args: []
        });
    });

    it('should process a simple pattern with args', function () {
        expect(processTemplateString`${123} to be within ${100} ${200}`, 'to equal', {
            subject: 123,
            testDescriptionString: 'to be within',
            args: [100, 200]
        });
    });

    it('should support number literals without ${...}', function () {
        expect(processTemplateString`${123} to be within 100 200`, 'to equal', {
            subject: 123,
            testDescriptionString: 'to be within',
            args: [100, 200]
        });
    });

    it('should support number literals with decimals and exponential notation', function () {
        expect(processTemplateString`9e4 to be within .01 0.4`, 'to equal', {
            subject: 9e4,
            testDescriptionString: 'to be within',
            args: [0.01, 0.4]
        });
    });

    it('should support doublequoted string literals without ${...}', function () {
        expect(processTemplateString`"abc" to equal "def"`, 'to equal', {
            subject: 'abc',
            testDescriptionString: 'to equal',
            args: ['def']
        });
    });

    it('should support singlequoted string literals without ${...}', function () {
        expect(processTemplateString`'abc' to equal 'def'`, 'to equal', {
            subject: 'abc',
            testDescriptionString: 'to equal',
            args: ['def']
        });
    });

    it('should support quoted characters in singlequoted string literals without ${...}', function () {
        expect(processTemplateString`'a\nb\\c' to equal 'def'`, 'to equal', {
            subject: 'a\nb\\c',
            testDescriptionString: 'to equal',
            args: ['def']
        });
    });
});
