# astw

walk the ast

[![browser support](http://ci.testling.com/forivall/astw-babylon.png)](http://ci.testling.com/forivall/astw-babylon)

[![build status](https://secure.travis-ci.org/forivall/astw-babylon.png)](http://travis-ci.org/forivall/astw-babylon)

This module is a faster version of
[falafel](https://github.com/substack/node-falafel)
that only does ast walking and `.parent` tracking, not source transforms.

# example

``` js
var astw = require('astw-babylon');
var deparse = require('escodegen').generate;
var walk = astw('4 + beep(5 * 2)');

walk(function (node) {
    var src = deparse(node);
    console.log(node.type + ' :: ' + JSON.stringify(src));
});
```

# methods

``` js
var astw = require('astw')
```

## var walk = astw(src)

Return a `walk()` function from the source string or ast object `src`.

## walk(cb)

Walk the nodes in the ast with `cb(node)` where `node` is each element in the
ast from [babylon](http://babeljs.io/) but with an additional `.parent`
reference to the parent node.

# install

With [npm](https://npmjs.org) do:

```
npm install astw-babylon
```

# license

MIT
