# file-position [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/file-position&title=file-position&description=hughsk/file-position%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

Given a row/column number, return the index of that character within the whole string

## Usage ##

[![file-position](https://nodei.co/npm/file-position.png?mini=true)](https://nodei.co/npm/file-position)

### `filePosition(src)(row, column)`

Pass `filePosition` your source file `src` as a string, and it'll return a function. This function takes a `row` and a `column` parameter to look up.

In return, you'll get a single index pointing to the character's position in
the entire string.

``` javascript
var position = require('file-position')
var fs = require('fs')

var file = fs.readFileSync(__filename, 'utf8')

var getIndex = position(src)
var column = 10
var row = 5

var index = getIndex(row, column)
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/file-position/blob/master/LICENSE.md) for details.
