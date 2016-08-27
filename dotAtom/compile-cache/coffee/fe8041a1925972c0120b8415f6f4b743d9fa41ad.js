(function() {
  var $$, ListView, OutputViewManager, PullBranchListView, SelectListView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  PullBranchListView = require('./pull-branch-list-view');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data, _arg) {
      var _ref1;
      this.repo = repo;
      this.data = data;
      _ref1 = _arg != null ? _arg : {}, this.mode = _ref1.mode, this.tag = _ref1.tag, this.extraArgs = _ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var name;
      name = _arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      return git.cmd(['branch', '-r'], {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          return new PullBranchListView(_this.repo, data, remoteName, _this.extraArgs).result;
        };
      })(this));
    };

    ListView.prototype.confirmed = function(_arg) {
      var name, pullOption;
      name = _arg.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullOption = atom.config.get('git-plus.pullBeforePush');
        this.extraArgs = (pullOption != null ? pullOption.includes('--rebase') : void 0) ? '--rebase' : '';
        if (!((pullOption != null) && pullOption === 'no')) {
          this.pull(name).then((function(_this) {
            return function() {
              return _this.execute(name);
            };
          })(this))["catch"](function() {});
        } else {
          this.execute(name);
        }
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs) {
      var args, command, message, startMessage, view, _ref1;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = OutputViewManager["new"]();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]).filter(function(arg) {
        return arg !== '';
      });
      command = (_ref1 = atom.config.get('git-plus.gitPath')) != null ? _ref1 : 'git';
      message = "" + (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        if (data !== '') {
          view.addLine(data).finish();
        }
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          return git.cmd([_this.mode, '-u', remote, 'HEAD'], {
            cwd: _this.repo.getWorkingDirectory()
          }).then(function(message) {
            view.addLine(message).finish();
            return startMessage.dismiss();
          });
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdGUtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FKcEIsQ0FBQTs7QUFBQSxFQUtBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx5QkFBUixDQUxyQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxFQUFlLElBQWYsR0FBQTtBQUNWLFVBQUEsS0FBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLDZCQUR5QixPQUEwQixJQUF6QixJQUFDLENBQUEsYUFBQSxNQUFNLElBQUMsQ0FBQSxZQUFBLEtBQUssSUFBQyxDQUFBLGtCQUFBLFNBQ3hDLENBQUE7QUFBQSxNQUFBLDBDQUFBLFNBQUEsQ0FBQSxDQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPO09BRFI7O1FBRUEsSUFBQyxDQUFBLFlBQWE7T0FGZDtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUhBLENBQUE7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/remote-list-view.coffee
