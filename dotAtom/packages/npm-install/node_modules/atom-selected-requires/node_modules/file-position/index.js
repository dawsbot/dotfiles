var splitRegex = /\r\n|\n|\r/g

module.exports = filePosition

function filePosition(src) {
  var lines = src.split(splitRegex)

  return getPosition

  function getPosition(row, col) {
    var index = 0

    row = +row|0
    col = +col|0

    for (var i = 0; i < lines.length; i++) {
      if (i !== row) {
        index += lines[i].length + 1
        continue
      }

      index += col
      break
    }

    return index
  }
}
