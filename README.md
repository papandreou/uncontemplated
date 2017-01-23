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