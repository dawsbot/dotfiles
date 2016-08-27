(function() {
  var Decrease, Increase, Operator, Range, settings,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Operator = require('./general-operators').Operator;

  Range = require('atom').Range;

  settings = require('../settings');

  Increase = (function(_super) {
    __extends(Increase, _super);

    Increase.prototype.step = 1;

    function Increase() {
      Increase.__super__.constructor.apply(this, arguments);
      this.complete = true;
      this.numberRegex = new RegExp(settings.numberRegex());
    }

    Increase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
        return function() {
          var cursor, increased, _i, _len, _ref;
          increased = false;
          _ref = _this.editor.getCursors();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cursor = _ref[_i];
            if (_this.increaseNumber(count, cursor)) {
              increased = true;
            }
          }
          if (!increased) {
            return atom.beep();
          }
        };
      })(this));
    };

    Increase.prototype.increaseNumber = function(count, cursor) {
      var cursorPosition, newValue, numEnd, numStart, number, range;
      cursorPosition = cursor.getBufferPosition();
      numEnd = cursor.getEndOfCurrentWordBufferPosition({
        wordRegex: this.numberRegex,
        allowNext: false
      });
      if (numEnd.column === cursorPosition.column) {
        numEnd = cursor.getEndOfCurrentWordBufferPosition({
          wordRegex: this.numberRegex,
          allowNext: true
        });
        if (numEnd.row !== cursorPosition.row) {
          return;
        }
        if (numEnd.column === cursorPosition.column) {
          return;
        }
      }
      cursor.setBufferPosition(numEnd);
      numStart = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: this.numberRegex,
        allowPrevious: false
      });
      range = new Range(numStart, numEnd);
      number = parseInt(this.editor.getTextInBufferRange(range), 10);
      if (isNaN(number)) {
        cursor.setBufferPosition(cursorPosition);
        return;
      }
      number += this.step * count;
      newValue = String(number);
      this.editor.setTextInBufferRange(range, newValue, {
        normalizeLineEndings: false
      });
      cursor.setBufferPosition({
        row: numStart.row,
        column: numStart.column - 1 + newValue.length
      });
      return true;
    };

    return Increase;

  })(Operator);

  Decrease = (function(_super) {
    __extends(Decrease, _super);

    function Decrease() {
      return Decrease.__super__.constructor.apply(this, arguments);
    }

    Decrease.prototype.step = -1;

    return Decrease;

  })(Increase);

  module.exports = {
    Increase: Increase,
    Decrease: Decrease
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5jcmVhc2Utb3BlcmF0b3JzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEscUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FERCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQU9NO0FBQ0osK0JBQUEsQ0FBQTs7QUFBQSx1QkFBQSxJQUFBLEdBQU0sQ0FBTixDQUFBOztBQUVhLElBQUEsa0JBQUEsR0FBQTtBQUNYLE1BQUEsMkNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFEWixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLE1BQUEsQ0FBTyxRQUFRLENBQUMsV0FBVCxDQUFBLENBQVAsQ0FGbkIsQ0FEVztJQUFBLENBRmI7O0FBQUEsdUJBT0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDthQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsY0FBQSxpQ0FBQTtBQUFBLFVBQUEsU0FBQSxHQUFZLEtBQVosQ0FBQTtBQUNBO0FBQUEsZUFBQSwyQ0FBQTs4QkFBQTtBQUNFLFlBQUEsSUFBRyxLQUFDLENBQUEsY0FBRCxDQUFnQixLQUFoQixFQUF1QixNQUF2QixDQUFIO0FBQXVDLGNBQUEsU0FBQSxHQUFZLElBQVosQ0FBdkM7YUFERjtBQUFBLFdBREE7QUFHQSxVQUFBLElBQUEsQ0FBQSxTQUFBO21CQUFBLElBQUksQ0FBQyxJQUFMLENBQUEsRUFBQTtXQUplO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFETztJQUFBLENBUFQsQ0FBQTs7QUFBQSx1QkFjQSxjQUFBLEdBQWdCLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUVkLFVBQUEseURBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLE1BQU0sQ0FBQyxpQ0FBUCxDQUF5QztBQUFBLFFBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxXQUFaO0FBQUEsUUFBeUIsU0FBQSxFQUFXLEtBQXBDO09BQXpDLENBRFQsQ0FBQTtBQUdBLE1BQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxLQUFpQixjQUFjLENBQUMsTUFBbkM7QUFFRSxRQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsaUNBQVAsQ0FBeUM7QUFBQSxVQUFBLFNBQUEsRUFBVyxJQUFDLENBQUEsV0FBWjtBQUFBLFVBQXlCLFNBQUEsRUFBVyxJQUFwQztTQUF6QyxDQUFULENBQUE7QUFDQSxRQUFBLElBQVUsTUFBTSxDQUFDLEdBQVAsS0FBZ0IsY0FBYyxDQUFDLEdBQXpDO0FBQUEsZ0JBQUEsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUFVLE1BQU0sQ0FBQyxNQUFQLEtBQWlCLGNBQWMsQ0FBQyxNQUExQztBQUFBLGdCQUFBLENBQUE7U0FKRjtPQUhBO0FBQUEsTUFTQSxNQUFNLENBQUMsaUJBQVAsQ0FBeUIsTUFBekIsQ0FUQSxDQUFBO0FBQUEsTUFVQSxRQUFBLEdBQVcsTUFBTSxDQUFDLHVDQUFQLENBQStDO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFdBQVo7QUFBQSxRQUF5QixhQUFBLEVBQWUsS0FBeEM7T0FBL0MsQ0FWWCxDQUFBO0FBQUEsTUFZQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sUUFBTixFQUFnQixNQUFoQixDQVpaLENBQUE7QUFBQSxNQWVBLE1BQUEsR0FBUyxRQUFBLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixLQUE3QixDQUFULEVBQThDLEVBQTlDLENBZlQsQ0FBQTtBQWdCQSxNQUFBLElBQUcsS0FBQSxDQUFNLE1BQU4sQ0FBSDtBQUNFLFFBQUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLGNBQXpCLENBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FGRjtPQWhCQTtBQUFBLE1Bb0JBLE1BQUEsSUFBVSxJQUFDLENBQUEsSUFBRCxHQUFNLEtBcEJoQixDQUFBO0FBQUEsTUF1QkEsUUFBQSxHQUFXLE1BQUEsQ0FBTyxNQUFQLENBdkJYLENBQUE7QUFBQSxNQXdCQSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLEtBQTdCLEVBQW9DLFFBQXBDLEVBQThDO0FBQUEsUUFBQSxvQkFBQSxFQUFzQixLQUF0QjtPQUE5QyxDQXhCQSxDQUFBO0FBQUEsTUEwQkEsTUFBTSxDQUFDLGlCQUFQLENBQXlCO0FBQUEsUUFBQSxHQUFBLEVBQUssUUFBUSxDQUFDLEdBQWQ7QUFBQSxRQUFtQixNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQVQsR0FBZ0IsQ0FBaEIsR0FBa0IsUUFBUSxDQUFDLE1BQXREO09BQXpCLENBMUJBLENBQUE7QUEyQkEsYUFBTyxJQUFQLENBN0JjO0lBQUEsQ0FkaEIsQ0FBQTs7b0JBQUE7O0tBRHFCLFNBUHZCLENBQUE7O0FBQUEsRUFxRE07QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsSUFBQSxHQUFNLENBQUEsQ0FBTixDQUFBOztvQkFBQTs7S0FEcUIsU0FyRHZCLENBQUE7O0FBQUEsRUF3REEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLFVBQUEsUUFBRDtBQUFBLElBQVcsVUFBQSxRQUFYO0dBeERqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/lib/operators/increase-operators.coffee
