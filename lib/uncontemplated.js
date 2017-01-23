var processTemplateString = require('./processTemplateString');
var expect = require('unexpected');

module.exports = function () { // ...
    const { subject, testDescriptionString, args } = processTemplateString.apply(null, arguments);
    return expect(subject, testDescriptionString, ...args);
};

// Expose a uncontemplated.use etc.
Object.keys(expect).forEach(key => {
    if (typeof expect[key] === 'function') {
        module.exports[key] = expect[key].bind(expect);
    }
});
