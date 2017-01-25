function normalizeAssertionString(assertionString) {
    return assertionString.trim().replace(/\s\s+/g, ' ');
}

// Taken from http://codereview.stackexchange.com/questions/14532/checking-for-balanced-brackets-in-javascript
function getBalancedPrefixLength(code) {
    var length = code.length;
    var delimiter = '';
    var bracket = [];
    var matching = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (var i = 0; i < length; i++) {
        var char = code.charAt(i);

        switch (char) {
        case '"':
        case "'":
            if (delimiter)
                if (char === delimiter)
                    delimiter = '';
            else delimiter = char;
            break;
        case '/':
            var lookahead = code.charAt(++i);
            switch (lookahead) {
            case '/':
            case '*':
                delimiter = lookahead;
            }
            break;
        case '*':
            if (delimiter === '*' && code.charAt(++i) === '/') delimiter = '';
            break;
        case '\n':
            if (delimiter === '/') delimiter = '';
            break;
        case '\\':
            switch (delimiter) {
            case '"':
            case "'":
                i++;
            }
            break;
        case '(':
        case '[':
        case '{':
            if (!delimiter) bracket.push(char);
            break;
        case ')':
        case ']':
        case '}':
            if (!delimiter && bracket.length && matching[char] !== bracket.pop())
                return -1;
            if (bracket.length === 0) {
                return i + 1;
            }
        }
    }
    return -1;
}

module.exports = function tokenizeTemplateString(fragments) {
    var tokens = [];
    var arx = arguments;
    fragments.forEach(function (fragment, i) {
        if (i in arx && i > 0) {
            tokens.push({type: 'variable', value: arx[i]});
        }
        if (fragment.trim() !== '') {
            tokens.push({type: 'assertionString', value: normalizeAssertionString(fragment)});
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
                if (/^[{[(]/.test(bit)) {
                    var rest = bits.slice(j).join('');
                    var balancedPrefixLength = getBalancedPrefixLength(rest);
                    if (balancedPrefixLength !== -1) {
                        var restPrefix = rest.slice(0, balancedPrefixLength);
                        replacement = eval('(' + restPrefix + ')');
                        var take = restPrefix.length - bit.length;
                        while (take > 0) {
                            var nextBit = bits[j + 1];
                            if (take >= nextBit.length) {
                                take -= nextBit.length;
                                bits[j] += bits[j + 1];
                                bits.splice(j + 1, 1);
                            } else {
                                bits[j] += bits[j + 1].substr(0, take);
                                bits[j + 1] = bits[j + 1].substr(take);
                                take = 0;
                            }
                        }
                    }
                } else if (/^(?:NaN|-?(?:(?:\d+|\d*\.\d+)(?:[E|e][+|-]?\d+)?|Infinity))$/.test(bit)) {
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
                        var joined = normalizeAssertionString(bits.slice(0, j).join(''));
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
                    tokens.splice(i, 1, {type: 'assertionString', value: normalizeAssertionString(bits.join(''))});
                }
            }
        }
    }
    return tokens;
};
