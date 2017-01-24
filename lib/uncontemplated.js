var tokenizeTemplateString = require('./tokenizeTemplateString');
var expect = require('unexpected');

module.exports = function () { // ...
    let tokens = tokenizeTemplateString.apply(null, arguments);
    let assertions = [];

    if (!tokens[0] || tokens[0].type !== 'variable') {
        throw new Error('no subject');
    }
    let subject = tokens.shift().value;

    while (tokens.length > 0) {
        if (!tokens[0] || tokens[0].type !== 'assertionString') {
            throw new Error('no assertion string');
        }
        var matchAndOrOr = tokens[0].value.match(/\b(and|or)\b/);
        if (matchAndOrOr) {
            if (matchAndOrOr.index > 0) {
                tokens.splice(0, 1, {
                    type: 'assertionString',
                    value: tokens[0].value.substr(0, matchAndOrOr.index - 1)
                }, {
                    type: 'assertionString',
                    value: tokens[0].value.substr(matchAndOrOr.index)
                });
            }
        }


        let i = 1;
        while (i < tokens.length) {
            if (tokens[i].type === 'assertionString') {
                var matchAndOrOr = tokens[i].value.match(/\b(and|or)\b/);
                if (matchAndOrOr) {
                    if (matchAndOrOr.index > 0) {
                        tokens.splice(i, 1, {
                            type: 'assertionString',
                            value: tokens[i].value.substr(0, matchAndOrOr.index - 1)
                        }, {
                            type: 'assertionString',
                            value: tokens[i].value.substr(matchAndOrOr.index)
                        });
                        i += 1;
                    }
                    break;
                }
            } else {
                i += 1;
            }
        }
        let testDescriptionString = tokens[0].value;
        let conjunction = 'and';
        if (assertions.length > 0) {
            matchLeadingAndOrOr = testDescriptionString.match(/^(and|or) (.*)/);
            if (matchLeadingAndOrOr) {
                conjunction = matchLeadingAndOrOr[1];
                testDescriptionString = matchLeadingAndOrOr[2];
            }
        }
        assertions.push({
            conjunction,
            subject,
            testDescriptionString,
            args: tokens.slice(1, i).map(token => token.value)
        });
        tokens = tokens.slice(i);
    }

    if (assertions.length === 1) {
        const { subject, testDescriptionString, args } = assertions[0];
        return expect(subject, testDescriptionString, ...args);
    } else {
        let expectItInstance;

        assertions.forEach(function (assertion) {
            expectItInstance = expectItInstance ?
                expectItInstance[assertion.conjunction](assertion.testDescriptionString, ...assertion.args) :
                expect.it(assertion.testDescriptionString, ...assertion.args);
        });
        return expectItInstance(subject);
    }
};

// Expose a uncontemplated.use etc.
Object.keys(expect).forEach(key => {
    if (typeof expect[key] === 'function') {
        module.exports[key] = expect[key].bind(expect);
    }
});
