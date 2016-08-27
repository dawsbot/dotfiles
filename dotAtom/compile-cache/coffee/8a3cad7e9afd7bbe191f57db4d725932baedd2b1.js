(function() {
  var HeaderView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.content = function() {
      return this.div({
        "class": 'header-view'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'heading-title',
            outlet: 'title'
          });
          return _this.span({
            "class": 'heading-status',
            outlet: 'status'
          });
        };
      })(this));
    };

    HeaderView.prototype.setStatus = function(status) {
      this.status.removeClass('icon-alert icon-check icon-hourglass icon-stop');
      switch (status) {
        case 'start':
          return this.status.addClass('icon-hourglass');
        case 'stop':
          return this.status.addClass('icon-check');
        case 'kill':
          return this.status.addClass('icon-stop');
        case 'err':
          return this.status.addClass('icon-alert');
      }
    };

    return HeaderView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvaGVhZGVyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxhQUFQO09BQUwsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QixVQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO0FBQUEsWUFBd0IsTUFBQSxFQUFRLE9BQWhDO1dBQU4sQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxnQkFBUDtBQUFBLFlBQXlCLE1BQUEsRUFBUSxRQUFqQztXQUFOLEVBRnlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFLQSxTQUFBLEdBQVcsU0FBQyxNQUFELEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixnREFBcEIsQ0FBQSxDQUFBO0FBQ0EsY0FBTyxNQUFQO0FBQUEsYUFDTyxPQURQO2lCQUNvQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsZ0JBQWpCLEVBRHBCO0FBQUEsYUFFTyxNQUZQO2lCQUVtQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsWUFBakIsRUFGbkI7QUFBQSxhQUdPLE1BSFA7aUJBR21CLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixXQUFqQixFQUhuQjtBQUFBLGFBSU8sS0FKUDtpQkFJa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLEVBSmxCO0FBQUEsT0FGUztJQUFBLENBTFgsQ0FBQTs7c0JBQUE7O0tBRnVCLEtBSHpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/header-view.coffee
