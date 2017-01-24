var tokenizeTemplateString = require('./tokenizeTemplateString');
var expect = require('unexpected');

module.exports = function () { // ...
    const tokens = tokenizeTemplateString.apply(null, arguments);

    if (!tokens[0] || tokens[0].type !== 'variable') {
        throw new Error('no subject');
    }
    if (!tokens[1] || tokens[1].type !== 'assertionString') {
        throw new Error('no assertion string');
    }
    var argTokens = tokens.slice(2);
    if (argTokens.some(function (token) { return token.type !== 'variable'; })) {
        throw new Error('only one assertion string allowed');
    }

    const subject = tokens[0].value;
    const testDescriptionString = tokens[1].value;
    const args = argTokens.map(function (token) {
        return token.value;
    });

    return expect(subject, testDescriptionString, ...args);
};

// Expose a uncontemplated.use etc.
Object.keys(expect).forEach(key => {
    if (typeof expect[key] === 'function') {
        module.exports[key] = expect[key].bind(expect);
    }
});
