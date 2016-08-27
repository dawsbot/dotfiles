(function() {
  var Operator, Put, settings, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  settings = require('../settings');

  module.exports = Put = (function(_super) {
    __extends(Put, _super);

    Put.prototype.register = null;

    function Put(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.location = (_arg != null ? _arg : {}).location;
      if (this.location == null) {
        this.location = 'after';
      }
      this.complete = true;
      this.register = settings.defaultRegister();
    }

    Put.prototype.execute = function(count) {
      var originalPosition, selection, text, textToInsert, type, _ref;
      if (count == null) {
        count = 1;
      }
      _ref = this.vimState.getRegister(this.register) || {}, text = _ref.text, type = _ref.type;
      if (!text) {
        return;
      }
      textToInsert = _.times(count, function() {
        return text;
      }).join('');
      selection = this.editor.getSelectedBufferRange();
      if (selection.isEmpty()) {
        if (type === 'linewise') {
          textToInsert = textToInsert.replace(/\n$/, '');
          if (this.location === 'after' && this.onLastRow()) {
            textToInsert = "\n" + textToInsert;
          } else {
            textToInsert = "" + textToInsert + "\n";
          }
        }
        if (this.location === 'after') {
          if (type === 'linewise') {
            if (this.onLastRow()) {
              this.editor.moveToEndOfLine();
              originalPosition = this.editor.getCursorScreenPosition();
              originalPosition.row += 1;
            } else {
              this.editor.moveDown();
            }
          } else {
            if (!this.onLastColumn()) {
              this.editor.moveRight();
            }
          }
        }
        if (type === 'linewise' && (originalPosition == null)) {
          this.editor.moveToBeginningOfLine();
          originalPosition = this.editor.getCursorScreenPosition();
        }
      }
      this.editor.insertText(textToInsert);
      if (originalPosition != null) {
        this.editor.setCursorScreenPosition(originalPosition);
        this.editor.moveToFirstCharacterOfLine();
      }
      if (type !== 'linewise') {
        this.editor.moveLeft();
      }
      return this.vimState.activateNormalMode();
    };

    Put.prototype.onLastRow = function() {
      var column, row, _ref;
      _ref = this.editor.getCursorBufferPosition(), row = _ref.row, column = _ref.column;
      return row === this.editor.getBuffer().getLastRow();
    };

    Put.prototype.onLastColumn = function() {
      return this.editor.getLastCursor().isAtEndOfLine();
    };

    return Put;

  })(Operator);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvcHV0LW9wZXJhdG9yLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxXQUFZLE9BQUEsQ0FBUSxxQkFBUixFQUFaLFFBREQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUZYLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUlNO0FBQ0osMEJBQUEsQ0FBQTs7QUFBQSxrQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUVhLElBQUEsYUFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLDJCQUFGLE9BQVksSUFBVixRQUNsQyxDQUFBOztRQUFBLElBQUMsQ0FBQSxXQUFZO09BQWI7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFEWixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBQVEsQ0FBQyxlQUFULENBQUEsQ0FGWixDQURXO0lBQUEsQ0FGYjs7QUFBQSxrQkFZQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLDJEQUFBOztRQURRLFFBQU07T0FDZDtBQUFBLE1BQUEsT0FBZSxJQUFDLENBQUEsUUFBUSxDQUFDLFdBQVYsQ0FBc0IsSUFBQyxDQUFBLFFBQXZCLENBQUEsSUFBb0MsRUFBbkQsRUFBQyxZQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/operators/put-operator.coffee
