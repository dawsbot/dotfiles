(function() {
  var $, OutputView, ScrollView, defaultMessage, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, ScrollView = _ref.ScrollView;

  defaultMessage = 'Nothing new to show';

  module.exports = OutputView = (function(_super) {
    __extends(OutputView, _super);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.prototype.message = '';

    OutputView.content = function() {
      return this.div({
        "class": 'git-plus info-view'
      }, (function(_this) {
        return function() {
          return _this.pre({
            "class": 'output'
          }, defaultMessage);
        };
      })(this));
    };

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.addLine = function(line) {
      if (this.message === defaultMessage) {
        this.message = '';
      }
      this.message += line;
      return this;
    };

    OutputView.prototype.reset = function() {
      return this.message = defaultMessage;
    };

    OutputView.prototype.finish = function() {
      this.find(".output").text(this.message);
      this.show();
      return this.timeout = setTimeout((function(_this) {
        return function() {
          return _this.hide();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    OutputView.prototype.toggle = function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return $.fn.toggle.call(this);
    };

    return OutputView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9vdXRwdXQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUFsQixFQUFDLFNBQUEsQ0FBRCxFQUFJLGtCQUFBLFVBQUosQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIscUJBRmpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBQUEsSUFFQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxvQkFBUDtPQUFMLEVBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxRQUFQO1dBQUwsRUFBc0IsY0FBdEIsRUFEZ0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxFQURRO0lBQUEsQ0FGVixDQUFBOztBQUFBLHlCQU1BLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDViw0Q0FBQSxTQUFBLEVBRFU7SUFBQSxDQU5aLENBQUE7O0FBQUEseUJBU0EsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFpQixJQUFDLENBQUEsT0FBRCxLQUFZLGNBQTdCO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQVgsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxJQUFZLElBRFosQ0FBQTthQUVBLEtBSE87SUFBQSxDQVRULENBQUE7O0FBQUEseUJBY0EsS0FBQSxHQUFPLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFELEdBQVcsZUFBZDtJQUFBLENBZFAsQ0FBQTs7QUFBQSx5QkFnQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFOLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsSUFBQyxDQUFBLE9BQXZCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNwQixLQUFDLENBQUEsSUFBRCxDQUFBLEVBRG9CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBQSxHQUE2QyxJQUZwQyxFQUhMO0lBQUEsQ0FoQlIsQ0FBQTs7QUFBQSx5QkF1QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBeUIsSUFBQyxDQUFBLE9BQTFCO0FBQUEsUUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLE9BQWQsQ0FBQSxDQUFBO09BQUE7YUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLElBQWpCLEVBRk07SUFBQSxDQXZCUixDQUFBOztzQkFBQTs7S0FEdUIsV0FKM0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/output-view.coffee
