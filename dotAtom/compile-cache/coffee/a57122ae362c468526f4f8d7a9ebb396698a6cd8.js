(function() {
  var OperatorWithInput, Range, Replace, ViewModel, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  OperatorWithInput = require('./general-operators').OperatorWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  Range = require('atom').Range;

  module.exports = Replace = (function(_super) {
    __extends(Replace, _super);

    function Replace(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Replace.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'replace',
        hidden: true,
        singleChar: true,
        defaultText: '\n'
      });
    }

    Replace.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters === "") {
        if (this.vimState.mode === "visual") {
          this.vimState.resetVisualMode();
        } else {
          this.vimState.activateNormalMode();
        }
        return;
      }
      this.editor.transact((function(_this) {
        return function() {
          var currentRowLength, cursor, point, pos, selection, _i, _j, _len, _len1, _ref, _ref1, _results;
          if (_this.motion != null) {
            if (_.contains(_this.motion.select(), true)) {
              _this.editor.replaceSelectedText(null, function(text) {
                return text.replace(/./g, _this.input.characters);
              });
              _ref = _this.editor.getSelections();
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                selection = _ref[_i];
                point = selection.getBufferRange().start;
                _results.push(selection.setBufferRange(Range.fromPointWithDelta(point, 0, 0)));
              }
              return _results;
            }
          } else {
            _ref1 = _this.editor.getCursors();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              cursor = _ref1[_j];
              pos = cursor.getBufferPosition();
              currentRowLength = _this.editor.lineTextForBufferRow(pos.row).length;
              if (!(currentRowLength - pos.column >= count)) {
                continue;
              }
              _.times(count, function() {
                point = cursor.getBufferPosition();
                _this.editor.setTextInBufferRange(Range.fromPointWithDelta(point, 0, 1), _this.input.characters);
                return cursor.moveRight();
              });
              cursor.setBufferPosition(pos);
            }
            if (_this.input.characters === "\n") {
              _.times(count, function() {
                return _this.editor.moveDown();
              });
              return _this.editor.moveToFirstCharacterOfLine();
            }
          }
        };
      })(this));
      return this.vimState.activateNormalMode();
    };

    return Replace;

  })(OperatorWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvcmVwbGFjZS1vcGVyYXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0Msb0JBQXFCLE9BQUEsQ0FBUSxxQkFBUixFQUFyQixpQkFERCxDQUFBOztBQUFBLEVBRUMsWUFBYSxPQUFBLENBQVEsMkJBQVIsRUFBYixTQUZELENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FIRCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDhCQUFBLENBQUE7O0FBQWEsSUFBQSxpQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFBQSx5Q0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLElBQUMsQ0FBQSxRQUFoQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7QUFBQSxRQUFBLE9BQUEsRUFBTyxTQUFQO0FBQUEsUUFBa0IsTUFBQSxFQUFRLElBQTFCO0FBQUEsUUFBZ0MsVUFBQSxFQUFZLElBQTVDO0FBQUEsUUFBa0QsV0FBQSxFQUFhLElBQS9EO09BQWhCLENBRGpCLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUlBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLEtBQXFCLEVBQXhCO0FBR0UsUUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixLQUFrQixRQUFyQjtBQUNFLFVBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxlQUFWLENBQUEsQ0FBQSxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxrQkFBVixDQUFBLENBQUEsQ0FIRjtTQUFBO0FBS0EsY0FBQSxDQVJGO09BQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsY0FBQSwyRkFBQTtBQUFBLFVBQUEsSUFBRyxvQkFBSDtBQUNFLFlBQUEsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLEtBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFBLENBQVgsRUFBNkIsSUFBN0IsQ0FBSDtBQUNFLGNBQUEsS0FBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUE0QixJQUE1QixFQUFrQyxTQUFDLElBQUQsR0FBQTt1QkFDaEMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBMUIsRUFEZ0M7Y0FBQSxDQUFsQyxDQUFBLENBQUE7QUFFQTtBQUFBO21CQUFBLDJDQUFBO3FDQUFBO0FBQ0UsZ0JBQUEsS0FBQSxHQUFRLFNBQVMsQ0FBQyxjQUFWLENBQUEsQ0FBMEIsQ0FBQyxLQUFuQyxDQUFBO0FBQUEsOEJBQ0EsU0FBUyxDQUFDLGNBQVYsQ0FBeUIsS0FBSyxDQUFDLGtCQUFOLENBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQXpCLEVBREEsQ0FERjtBQUFBOzhCQUhGO2FBREY7V0FBQSxNQUFBO0FBUUU7QUFBQSxpQkFBQSw4Q0FBQTtpQ0FBQTtBQUNFLGNBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxpQkFBUCxDQUFBLENBQU4sQ0FBQTtBQUFBLGNBQ0EsZ0JBQUEsR0FBbUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUFHLENBQUMsR0FBakMsQ0FBcUMsQ0FBQyxNQUR6RCxDQUFBO0FBRUEsY0FBQSxJQUFBLENBQUEsQ0FBZ0IsZ0JBQUEsR0FBbUIsR0FBRyxDQUFDLE1BQXZCLElBQWlDLEtBQWpELENBQUE7QUFBQSx5QkFBQTtlQUZBO0FBQUEsY0FJQSxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsRUFBZSxTQUFBLEdBQUE7QUFDYixnQkFBQSxLQUFBLEdBQVEsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBUixDQUFBO0FBQUEsZ0JBQ0EsS0FBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUFLLENBQUMsa0JBQU4sQ0FBeUIsS0FBekIsRUFBZ0MsQ0FBaEMsRUFBbUMsQ0FBbkMsQ0FBN0IsRUFBb0UsS0FBQyxDQUFBLEtBQUssQ0FBQyxVQUEzRSxDQURBLENBQUE7dUJBRUEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxFQUhhO2NBQUEsQ0FBZixDQUpBLENBQUE7QUFBQSxjQVFBLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixHQUF6QixDQVJBLENBREY7QUFBQSxhQUFBO0FBYUEsWUFBQSxJQUFHLEtBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxLQUFxQixJQUF4QjtBQUNFLGNBQUEsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxLQUFSLEVBQWUsU0FBQSxHQUFBO3VCQUNiLEtBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFBLEVBRGE7Y0FBQSxDQUFmLENBQUEsQ0FBQTtxQkFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQUEsRUFIRjthQXJCRjtXQURlO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsQ0FWQSxDQUFBO2FBcUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBQSxFQXRDTztJQUFBLENBSlQsQ0FBQTs7bUJBQUE7O0tBRG9CLGtCQU50QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/operators/replace-operator.coffee
