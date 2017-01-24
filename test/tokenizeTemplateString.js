var expect = require('unexpected');
var tokenizeTemplateString = require('../lib/tokenizeTemplateString');

describe('tokenizeTemplateString', function () {
    it('should process a simple pattern with no args', function () {
        expect(tokenizeTemplateString`${123} to be a number`, 'to equal', [
            { type: 'variable', value: 123 },
            { type: 'assertionString', value: 'to be a number' }
        ]);
    });

    it('should process a simple pattern with args', function () {
        expect(tokenizeTemplateString`${123} to be within ${100} ${200}`, 'to equal', [
            { type: 'variable', value: 123 },
            { type: 'assertionString', value: 'to be within' },
            { type: 'variable', value: 100 },
            { type: 'variable', value: 200 }
        ]);
    });

    it('should support number literals without ${...}', function () {
        expect(tokenizeTemplateString`${123} to be within 100 200`, 'to equal', [
            { type: 'variable', value: 123 },
            { type: 'assertionString', value: 'to be within' },
            { type: 'variable', value: 100 },
            { type: 'variable', value: 200 }
        ]);
    });

    it('should support number literals with decimals and exponential notation', function () {
        expect(tokenizeTemplateString`9e4 to be within .01 0.4`, 'to equal', [
            { type: 'variable', value: 9e4 },
            { type: 'assertionString', value: 'to be within' },
            { type: 'variable', value: 0.01 },
            { type: 'variable', value: 0.4 }
        ]);
    });

    it('should support doublequoted string literals without ${...}', function () {
        expect(tokenizeTemplateString`"abc" to equal "def"`, 'to equal', [
            { type: 'variable', value: 'abc' },
            { type: 'assertionString', value: 'to equal' },
            { type: 'variable', value: 'def' }
        ]);
    });

    it('should support singlequoted string literals without ${...}', function () {
        expect(tokenizeTemplateString`'abc' to equal 'def'`, 'to equal', [
            { type: 'variable', value: 'abc' },
            { type: 'assertionString', value: 'to equal' },
            { type: 'variable', value: 'def' }
        ]);
    });

    it('should support quoted characters in singlequoted string literals without ${...}', function () {
        expect(tokenizeTemplateString`'a\nb\\c' to equal 'def'`, 'to equal', [
            { type: 'variable', value: 'a\nb\\c' },
            { type: 'assertionString', value: 'to equal' },
            { type: 'variable', value: 'def' }
        ]);
    });
});
