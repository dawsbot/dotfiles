(function() {
  var CliStatusView, CommandOutputView, View, domify,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  domify = require('domify');

  CommandOutputView = require('./command-output-view');

  module.exports = CliStatusView = (function(_super) {
    __extends(CliStatusView, _super);

    function CliStatusView() {
      return CliStatusView.__super__.constructor.apply(this, arguments);
    }

    CliStatusView.content = function() {
      return this.div({
        "class": 'cli-status inline-block'
      }, (function(_this) {
        return function() {
          _this.span({
            outlet: 'termStatusContainer'
          }, function() {});
          return _this.span({
            click: 'newTermClick',
            "class": "cli-status icon icon-plus"
          });
        };
      })(this));
    };

    CliStatusView.prototype.commandViews = [];

    CliStatusView.prototype.activeIndex = 0;

    CliStatusView.prototype.initialize = function(serializeState) {
      atom.commands.add('atom-workspace', {
        'terminal-status:new': (function(_this) {
          return function() {
            return _this.newTermClick();
          };
        })(this),
        'terminal-status:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-status:next': (function(_this) {
          return function() {
            return _this.activeNextCommandView();
          };
        })(this),
        'terminal-status:prev': (function(_this) {
          return function() {
            return _this.activePrevCommandView();
          };
        })(this)
      });
      this.createCommandView();
      return this.attach();
    };

    CliStatusView.prototype.createCommandView = function() {
      var commandOutputView, termStatus;
      termStatus = domify('<span class="cli-status icon icon-terminal"></span>');
      commandOutputView = new CommandOutputView;
      commandOutputView.statusIcon = termStatus;
      commandOutputView.statusView = this;
      this.commandViews.push(commandOutputView);
      termStatus.addEventListener('click', (function(_this) {
        return function() {
          return commandOutputView.toggle();
        };
      })(this));
      this.termStatusContainer.append(termStatus);
      return commandOutputView;
    };

    CliStatusView.prototype.activeNextCommandView = function() {
      return this.activeCommandView(this.activeIndex + 1);
    };

    CliStatusView.prototype.activePrevCommandView = function() {
      return this.activeCommandView(this.activeIndex - 1);
    };

    CliStatusView.prototype.activeCommandView = function(index) {
      if (index >= this.commandViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.commandViews.length - 1;
      }
      return this.commandViews[index] && this.commandViews[index].open();
    };

    CliStatusView.prototype.setActiveCommandView = function(commandView) {
      return this.activeIndex = this.commandViews.indexOf(commandView);
    };

    CliStatusView.prototype.removeCommandView = function(commandView) {
      var index;
      index = this.commandViews.indexOf(commandView);
      return index >= 0 && this.commandViews.splice(index, 1);
    };

    CliStatusView.prototype.newTermClick = function() {
      return this.createCommandView().toggle();
    };

    CliStatusView.prototype.attach = function(statusBar) {
      statusBar = document.querySelector("status-bar");
      if (statusBar != null) {
        return this.statusBarTile = statusBar.addLeftTile({
          item: this,
          priority: 100
        });
      }
    };

    CliStatusView.prototype.destroy = function() {
      var index, _i, _ref;
      for (index = _i = _ref = this.commandViews.length; _ref <= 0 ? _i <= 0 : _i >= 0; index = _ref <= 0 ? ++_i : --_i) {
        this.removeCommandView(this.commandViews[index]);
      }
      return this.detach();
    };

    CliStatusView.prototype.toggle = function() {
      if (this.commandViews[this.activeIndex]) {
        return this.commandViews[this.activeIndex].toggle();
      } else {
        return this.newTermClick();
      }
    };

    return CliStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY2xpLXN0YXR1cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4Q0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FEVCxDQUFBOztBQUFBLEVBRUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBRnBCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8seUJBQVA7T0FBTCxFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JDLFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFlBQUEsTUFBQSxFQUFRLHFCQUFSO1dBQU4sRUFBcUMsU0FBQSxHQUFBLENBQXJDLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxLQUFBLEVBQU8sY0FBUDtBQUFBLFlBQXVCLE9BQUEsRUFBTywyQkFBOUI7V0FBTixFQUZxQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNEJBS0EsWUFBQSxHQUFjLEVBTGQsQ0FBQTs7QUFBQSw0QkFNQSxXQUFBLEdBQWEsQ0FOYixDQUFBOztBQUFBLDRCQU9BLFVBQUEsR0FBWSxTQUFDLGNBQUQsR0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/terminal-status/lib/cli-status-view.coffee
