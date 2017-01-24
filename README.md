Uncontemplated
==============

Experimental wrapper for Unexpected that uses ES6 template strings for assertions:

```js
let expect = require('uncontemplated');
let a = 123;
let b = 456;
let c = 789;
expect`${a} to equal ${b}`

expect`${b} to be within ${a} ${c}`

```

String literals and numbers can be passed without enclosing in `${...}`:

```js
expect`${a} to equal 123`

expect`"foo" to equal "bar"`
```

You can use `and` and `or` to execute multiple assertions on the same subject.

```js
expect`${a} to be a number and to be greater than 42`;

expect`"foo" to be a number or to be a string`;
```

The precedence rules and limitations for and/or are the same as for chained
[`expect.it`](http://unexpected.js.org/assertions/any/to-satisfy/),
calls: `or` binds tightest, and there's no way to put parentheses around
an `and` clause.

Arbitrary whitespace is allowed if you want to get all free-form:

```js
expect`
        ${Math.random} to be a function
        and when called
            to be a number
`;

```