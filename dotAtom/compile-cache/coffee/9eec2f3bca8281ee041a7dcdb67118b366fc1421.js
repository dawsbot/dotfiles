(function() {
  var copyCharacterFromAbove, copyCharacterFromBelow;

  copyCharacterFromAbove = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, range, row, _i, _len, _ref, _ref1, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        _ref1 = cursor.getScreenPosition(), row = _ref1.row, column = _ref1.column;
        if (row === 0) {
          continue;
        }
        range = [[row - 1, column], [row - 1, column + 1]];
        _results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return _results;
    });
  };

  copyCharacterFromBelow = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, range, row, _i, _len, _ref, _ref1, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        _ref1 = cursor.getScreenPosition(), row = _ref1.row, column = _ref1.column;
        range = [[row + 1, column], [row + 1, column + 1]];
        _results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return _results;
    });
  };

  module.exports = {
    copyCharacterFromAbove: copyCharacterFromAbove,
    copyCharacterFromBelow: copyCharacterFromBelow
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9pbnNlcnQtbW9kZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQSxzQkFBQSxHQUF5QixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7V0FDdkIsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwyREFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsUUFBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBaEIsRUFBQyxZQUFBLEdBQUQsRUFBTSxlQUFBLE1BQU4sQ0FBQTtBQUNBLFFBQUEsSUFBWSxHQUFBLEtBQU8sQ0FBbkI7QUFBQSxtQkFBQTtTQURBO0FBQUEsUUFFQSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUEsR0FBSSxDQUFMLEVBQVEsTUFBUixDQUFELEVBQWtCLENBQUMsR0FBQSxHQUFJLENBQUwsRUFBUSxNQUFBLEdBQU8sQ0FBZixDQUFsQixDQUZSLENBQUE7QUFBQSxzQkFHQSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWpCLENBQTRCLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixNQUFNLENBQUMseUJBQVAsQ0FBaUMsS0FBakMsQ0FBNUIsQ0FBNUIsRUFIQSxDQURGO0FBQUE7c0JBRGM7SUFBQSxDQUFoQixFQUR1QjtFQUFBLENBQXpCLENBQUE7O0FBQUEsRUFRQSxzQkFBQSxHQUF5QixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7V0FDdkIsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwyREFBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsUUFBZ0IsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBaEIsRUFBQyxZQUFBLEdBQUQsRUFBTSxlQUFBLE1BQU4sQ0FBQTtBQUFBLFFBQ0EsS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFRLE1BQVIsQ0FBRCxFQUFrQixDQUFDLEdBQUEsR0FBSSxDQUFMLEVBQVEsTUFBQSxHQUFPLENBQWYsQ0FBbEIsQ0FEUixDQUFBO0FBQUEsc0JBRUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixDQUE0QixNQUFNLENBQUMsb0JBQVAsQ0FBNEIsTUFBTSxDQUFDLHlCQUFQLENBQWlDLEtBQWpDLENBQTVCLENBQTVCLEVBRkEsQ0FERjtBQUFBO3NCQURjO0lBQUEsQ0FBaEIsRUFEdUI7RUFBQSxDQVJ6QixDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLHdCQUFBLHNCQURlO0FBQUEsSUFFZix3QkFBQSxzQkFGZTtHQWZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/insert-mode.coffee
