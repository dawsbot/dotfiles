(function() {
  var InsertNlJsx,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  module.exports = InsertNlJsx = (function() {
    function InsertNlJsx(editor) {
      this.editor = editor;
      this.insertText = __bind(this.insertText, this);
      this.adviseBefore(this.editor, 'insertText', this.insertText);
    }

    InsertNlJsx.prototype.insertText = function(text, options) {
      var cursorBufferPosition, indentLength;
      if (!(text === "\n")) {
        return true;
      }
      if (this.editor.hasMultipleCursors()) {
        return true;
      }
      cursorBufferPosition = this.editor.getCursorBufferPosition();
      if (!(cursorBufferPosition.column > 0)) {
        return true;
      }
      if ('JSXEndTagStart' !== this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray().pop()) {
        return true;
      }
      cursorBufferPosition.column--;
      if ('JSXStartTagEnd' !== this.editor.scopeDescriptorForBufferPosition(cursorBufferPosition).getScopesArray().pop()) {
        return true;
      }
      indentLength = this.editor.indentationForBufferRow(cursorBufferPosition.row);
      this.editor.insertText("\n\n");
      this.editor.setIndentationForBufferRow(cursorBufferPosition.row + 1, indentLength + 1, {
        preserveLeadingWhitespace: false
      });
      this.editor.setIndentationForBufferRow(cursorBufferPosition.row + 2, indentLength, {
        preserveLeadingWhitespace: false
      });
      this.editor.moveUp();
      this.editor.moveToEndOfLine();
      return false;
    };

    InsertNlJsx.prototype.adviseBefore = function(object, methodName, advice) {
      var original;
      original = object[methodName];
      return object[methodName] = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (advice.apply(this, args) !== false) {
          return original.apply(this, args);
        }
      };
    };

    return InsertNlJsx;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9pbnNlcnQtbmwtanN4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBO0lBQUE7c0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLE1BQWYsRUFBdUIsWUFBdkIsRUFBcUMsSUFBQyxDQUFBLFVBQXRDLENBQUEsQ0FEVztJQUFBLENBQWI7O0FBQUEsMEJBTUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNWLFVBQUEsa0NBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFxQixJQUFBLEtBQVEsSUFBVixDQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFDQSxNQUFBLElBQWUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLENBQWY7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxvQkFBQSxHQUF1QixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FIdkIsQ0FBQTtBQUlBLE1BQUEsSUFBQSxDQUFBLENBQW1CLG9CQUFvQixDQUFDLE1BQXJCLEdBQThCLENBQWpELENBQUE7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUpBO0FBS0EsTUFBQSxJQUFtQixnQkFBQSxLQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLG9CQUF6QyxDQUE4RCxDQUFDLGNBQS9ELENBQUEsQ0FBK0UsQ0FBQyxHQUFoRixDQUFBLENBQXZDO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FMQTtBQUFBLE1BTUEsb0JBQW9CLENBQUMsTUFBckIsRUFOQSxDQUFBO0FBT0EsTUFBQSxJQUFtQixnQkFBQSxLQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGdDQUFSLENBQXlDLG9CQUF6QyxDQUE4RCxDQUFDLGNBQS9ELENBQUEsQ0FBK0UsQ0FBQyxHQUFoRixDQUFBLENBQXZDO0FBQUEsZUFBTyxJQUFQLENBQUE7T0FQQTtBQUFBLE1BUUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0Msb0JBQW9CLENBQUMsR0FBckQsQ0FSZixDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBbUIsTUFBbkIsQ0FUQSxDQUFBO0FBQUEsTUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQW1DLG9CQUFvQixDQUFDLEdBQXJCLEdBQXlCLENBQTVELEVBQStELFlBQUEsR0FBYSxDQUE1RSxFQUErRTtBQUFBLFFBQUUseUJBQUEsRUFBMkIsS0FBN0I7T0FBL0UsQ0FWQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQW1DLG9CQUFvQixDQUFDLEdBQXJCLEdBQXlCLENBQTVELEVBQStELFlBQS9ELEVBQTZFO0FBQUEsUUFBRSx5QkFBQSxFQUEyQixLQUE3QjtPQUE3RSxDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBLENBWkEsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FiQSxDQUFBO2FBY0EsTUFmVTtJQUFBLENBTlosQ0FBQTs7QUFBQSwwQkF3QkEsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsTUFBckIsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLE1BQU8sQ0FBQSxVQUFBLENBQWxCLENBQUE7YUFDQSxNQUFPLENBQUEsVUFBQSxDQUFQLEdBQXFCLFNBQUEsR0FBQTtBQUNuQixZQUFBLElBQUE7QUFBQSxRQURvQiw4REFDcEIsQ0FBQTtBQUFBLFFBQUEsSUFBTyxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsRUFBbUIsSUFBbkIsQ0FBQSxLQUE0QixLQUFuQztpQkFDRSxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFERjtTQURtQjtNQUFBLEVBRlQ7SUFBQSxDQXhCZCxDQUFBOzt1QkFBQTs7TUFGRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/insert-nl-jsx.coffee
