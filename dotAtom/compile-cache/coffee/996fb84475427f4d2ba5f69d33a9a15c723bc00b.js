(function() {
  var $, StatusView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  module.exports = StatusView = (function(_super) {
    __extends(StatusView, _super);

    function StatusView() {
      return StatusView.__super__.constructor.apply(this, arguments);
    }

    StatusView.content = function(params) {
      return this.div({
        "class": 'git-plus'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "" + params.type + " message"
          }, params.message);
        };
      })(this));
    };

    StatusView.prototype.initialize = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addBottomPanel({
          item: this
        });
      }
      return setTimeout((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this), atom.config.get('git-plus.messageTimeout') * 1000);
    };

    StatusView.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    return StatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zdGF0dXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFXLFNBQUMsTUFBRCxHQUFBO2FBQ1QsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFVBQVA7T0FBTCxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN0QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sRUFBQSxHQUFHLE1BQU0sQ0FBQyxJQUFWLEdBQWUsVUFBdEI7V0FBTCxFQUFzQyxNQUFNLENBQUMsT0FBN0MsRUFEc0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURTO0lBQUEsQ0FBWCxDQUFBOztBQUFBLHlCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7O1FBQ1YsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO0FBQUEsVUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE5QjtPQUFWO2FBQ0EsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ1QsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQURTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUVFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBQSxHQUE2QyxJQUYvQyxFQUZVO0lBQUEsQ0FKWixDQUFBOztBQUFBLHlCQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLEtBQUE7aURBQU0sQ0FBRSxPQUFSLENBQUEsV0FETztJQUFBLENBVlQsQ0FBQTs7c0JBQUE7O0tBRHVCLEtBSDNCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/status-view.coffee
