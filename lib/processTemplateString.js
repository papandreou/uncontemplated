module.exports = function (fragments) {
    var tokens = [];
    var arx = arguments;
    fragments.forEach(function (fragment, i) {
        if (i in arx && i > 0) {
            tokens.push({type: 'variable', value: arx[i]});
        }
        if (fragment.trim() !== '') {
            tokens.push({type: 'assertionString', value: fragment.trim()});
        }
    });
    for (var i = 0 ; i < tokens.length ; i += 1) {
        var token = tokens[i];
        if (token.type === 'assertionString') {
            var bits = token.value.match(/"(?:[^"]|\\")*"|'(?:[^']|\\')*'|\s+|\S+/g);
            var modified = false;
            for (var j = 0 ; j < bits.length ; j += 1) {
                var bit = bits[j];
                var replacement = undefined;
                if (/^(?:NaN|-?(?:(?:\d+|\d*\.\d+)(?:[E|e][+|-]?\d+)?|Infinity))$/.test(bit)) {
                    replacement = parseFloat(bit);
                } else {
                    var matchStringLiteral = bit.match(/^(?:'((?:[^']|\\')*)'|"((?:[^"]|\\")*)")$/);
                    if (matchStringLiteral) {
                        replacement = matchStringLiteral[1] || matchStringLiteral[2] || '';
                    }
                }
                if (typeof replacement !== 'undefined') {
                    modified = true;
                    if (j > 0) {
                        var joined = bits.slice(0, j).join('').trim();
                        if (joined !== '') {
                            tokens.splice(i, 0, {type: 'assertionString', value: joined});
                            i += 1;
                        }
                    }
                    tokens.splice(i, 0, {type: 'variable', value: replacement});
                    i += 1;
                    bits = bits.slice(j + 1);
                    j = 0;
                }
            }
            if (modified) {
                var remainingBitsJoined = bits.join('').trim();
                if (remainingBitsJoined === '') {
                    tokens.splice(i, 1);
                    i -= 1;
                } else {
                    tokens.splice(i, 1, {type: 'assertionString', value: bits.join('')});
                }
            }
        }
    }

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
    return {
        subject: tokens[0].value,
        testDescriptionString: tokens[1].value,
        args: argTokens.map(function (token) {
            return token.value;
        })
    };
};
