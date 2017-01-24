var expect = require('unexpected');
var contemplate = require('../');

describe('uncontemplated', function () {
    describe('with a value-less assertion', function () {
        let a = 123;
        it('should succeed', function () {
            contemplate`${a} to be a number`;
        });

        it('should fail with a diff', function () {
            expect(() => contemplate`${a} to be a string`, 'to throw', 'expected 123 to be a string');
        });
    });

    describe('with an assertion that takes a value', function () {
        let a = 123;
        let b = 100;
        it('should succeed', function () {
            contemplate`${a} to be greater than ${b}`;
        });

        it('should fail with a diff', function () {
            expect(() => contemplate`${a} to be less than ${b}`, 'to throw', 'expected 123 to be less than 100');
        });
    });

    describe('with literal numbers as subject and value', function () {
        it('should succeed', function () {
            contemplate`123 to be greater than 100`;
        });

        it('should fail with a diff', function () {
            expect(() => contemplate`123 to be less than 100`, 'to throw', 'expected 123 to be less than 100');
        });
    });

    describe('with middle-of-the-rocket assertions', function () {
        contemplate.addAssertion('<number> when incremented <assertion?>', (expect, subject, ...rest) => expect(subject + 1, ...rest));

        it('should succeed', function () {
            contemplate.addAssertion('<number> when incremented <assertion?>', (expect, subject, ...rest) => expect(subject + 1, ...rest));
            contemplate`123 when incremented to equal 124`;
        });

        it('should fail with a diff', function () {
            expect(() => contemplate`123 when incremented to equal 456`, 'to throw', 'expected 123 when incremented to equal 456');
        });
    });

    describe('with multiple assertions on the same subject, separated by the word "and"', function () {
        it('should succeed', function () {
            contemplate`123 to be greater than 100 and to be a number`;
        });

        it('should fail with a diff', function () {
            expect(
                () => contemplate`123 to be greater than 100 and to be a string`,
                'to throw',
                "✓ expected 123 to be greater than 100 and\n" +
                "⨯ expected 123 to be a string"
            );
        });
    });

    describe('with multiple assertions on the same subject, separated by the word "or"', function () {
        it('should succeed', function () {
            contemplate`123 to be less than 100 or to be a number`;
        });

        it('should fail with a diff', function () {
            expect(
                () => contemplate`123 to be less than 100 or to be a string`,
                'to throw',
                "⨯ expected 123 to be less than 100 or\n" +
                "⨯ expected 123 to be a string"
            );
        });
    });

    it('should allow arbitrary whitespace around and inside the assertion strings', function () {
        contemplate`
            123 to be greater than 100
            and to be         a number
        `;
    });
});
