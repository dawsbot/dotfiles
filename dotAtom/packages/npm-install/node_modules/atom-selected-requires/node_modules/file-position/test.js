var position = require('./')
var test = require('tape')

var src = [
  'lorem',
  'ipsum',
  'dolor',
  'samet'
].join('\n')

test('file-position', function(t) {
  var get = position(src)

  t.equal(get(2, 0), src.indexOf('dolor'))
  t.equal(get(3, 1), src.indexOf('amet'))
  t.equal(get(1, 4), src.indexOf('m\ndolor'))

  t.equal(get(3), src.indexOf('samet'))
  t.equal(get(), 0)

  t.end()
})
