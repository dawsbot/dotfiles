(function() {
  var continuationLine, emptyLine, objectLiteralLine;

  emptyLine = /^\s*$/;

  objectLiteralLine = /^\s*[\w'"]+\s*\:\s*/m;

  continuationLine = /[\{\(;,]\s*$/;

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-line': (function(_this) {
          return function() {
            return _this.endLine(';', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-line-comma': (function(_this) {
          return function() {
            return _this.endLine(',', false);
          };
        })(this)
      });
      atom.commands.add('atom-text-editor', {
        'es6-javascript:end-new-line': (function(_this) {
          return function() {
            return _this.endLine('', true);
          };
        })(this)
      });
      return atom.commands.add('atom-text-editor', {
        'es6-javascript:wrap-block': (function(_this) {
          return function() {
            return _this.wrapBlock();
          };
        })(this)
      });
    },
    endLine: function(terminator, insertNewLine) {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor.getCursors().forEach(function(cursor) {
        var line;
        line = cursor.getCurrentBufferLine();
        editor.moveToEndOfLine();
        if (!terminator) {
          terminator = objectLiteralLine.test(line) ? ',' : ';';
        }
        if (!continuationLine.test(line) && !emptyLine.test(line)) {
          editor.insertText(terminator);
        }
        if (insertNewLine) {
          return editor.insertNewlineBelow();
        }
      });
    },
    wrapBlock: function() {
      var editor, rangesToWrap;
      editor = atom.workspace.getActiveTextEditor();
      rangesToWrap = editor.getSelectedBufferRanges().filter(function(r) {
        return !r.isEmpty();
      });
      if (rangesToWrap.length) {
        rangesToWrap.sort(function(a, b) {
          if (a.start.row > b.start.row) {
            return -1;
          } else {
            return 1;
          }
        }).forEach(function(range) {
          var text;
          text = editor.getTextInBufferRange(range);
          if (/^\s*\{\s*/.test(text) && /\s*\}\s*/.test(text)) {
            return editor.setTextInBufferRange(range, text.replace(/\{\s*/, '').replace(/\s*\}/, ''));
          } else {
            return editor.setTextInBufferRange(range, '{\n' + text + '\n}');
          }
        });
        return editor.autoIndentSelectedRows();
      } else {
        editor.insertText('{\n\n}');
        editor.selectUp(2);
        editor.autoIndentSelectedRows();
        editor.moveRight();
        editor.moveUp();
        return editor.moveToEndOfLine();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2VzNi1qYXZhc2NyaXB0L2xpYi9lczYtamF2YXNjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOENBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBWixDQUFBOztBQUFBLEVBQ0EsaUJBQUEsR0FBb0Isc0JBRHBCLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixjQUZuQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHlCQUFBLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxFQUFjLEtBQWQsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCO09BREYsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0U7QUFBQSxRQUFBLCtCQUFBLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQVMsR0FBVCxFQUFjLEtBQWQsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO09BREYsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0U7QUFBQSxRQUFBLDZCQUFBLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/es6-javascript/lib/es6-javascript.coffee
