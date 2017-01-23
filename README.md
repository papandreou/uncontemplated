Uncontemplated
==============

Experimental wrapper for Unexpected that uses ES6 template strings for assertions:

```js
let expect = require('uncontemplated');
let a = 123;

expect`${a} to equal 123`

expect`${a} to be within 100 200`

```
