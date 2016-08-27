# atom-selected-requires
![](http://img.shields.io/badge/stability-stable-orange.svg?style=flat)
![](http://img.shields.io/npm/v/atom-selected-requires.svg?style=flat)
![](http://img.shields.io/npm/dm/atom-selected-requires.svg?style=flat)
![](http://img.shields.io/npm/l/atom-selected-requires.svg?style=flat)

Retrieve the paths of any require statements in the
current selection. Originally extracted from
[atom-node-resolver](https://github.com/hughsk/atom-node-resolver), and syntax-aware, just like [browserify](http://browserify.org/).

## Usage

[![NPM](https://nodei.co/npm/atom-selected-requires.png)](https://nodei.co/npm/atom-selected-requires/)

### `paths = selectedRequires([editor])`

Given an `editor`, check all of the current selections and return an array of require `paths`. If no editor is
supplied, the currently active editor will be used.

For example, given a file like so:

``` javascript
const a = require('atom-selected-requires')
const b = require('@scoped/package')
const c = require('./local-file')
```

You could run the following:

``` javascript
const selectedRequires = require('atom-selected-requires')
const editor = atom.workspace.getActiveEditor()

console.log(selectedRequires(editor))
```

And receive an array like so in return:

``` javascript
[
  'atom-selected-requires',
  '@scoped/package',
  './local-file'
]
```

## See Also

* [detective](http://github.com/substack/node-detective)

## License

MIT. See [LICENSE.md](http://github.com/hughsk/atom-selected-requires/blob/master/LICENSE.md) for details.
