(function() {
  var BranchListView, OutputViewManager, PullBranchListView, git, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = PullBranchListView = (function(_super) {
    __extends(PullBranchListView, _super);

    function PullBranchListView() {
      return PullBranchListView.__super__.constructor.apply(this, arguments);
    }

    PullBranchListView.prototype.initialize = function(repo, data, remote, extraArgs) {
      this.repo = repo;
      this.data = data;
      this.remote = remote;
      this.extraArgs = extraArgs;
      PullBranchListView.__super__.initialize.apply(this, arguments);
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          return _this.reject = reject;
        };
      })(this));
    };

    PullBranchListView.prototype.parseData = function() {
      var branches, currentBranch, items;
      this.currentBranchString = '== Current ==';
      currentBranch = {
        name: this.currentBranchString
      };
      items = this.data.split("\n");
      branches = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item.replace(/\s/g, '')
        };
      });
      if (branches.length === 1) {
        this.confirmed(branches[0]);
      } else {
        this.setItems([currentBranch].concat(branches));
      }
      return this.focusFilterEditor();
    };

    PullBranchListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      if (name === this.currentBranchString) {
        this.pull();
      } else {
        this.pull(name.substring(name.indexOf('/') + 1));
      }
      return this.cancel();
    };

    PullBranchListView.prototype.pull = function(remoteBranch) {
      var args, startMessage, view;
      if (remoteBranch == null) {
        remoteBranch = '';
      }
      view = OutputViewManager.create();
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      args = ['pull'].concat(this.extraArgs, this.remote, remoteBranch).filter(function(arg) {
        return arg !== '';
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(data) {
          _this.resolve();
          view.addLine(data).finish();
          return startMessage.dismiss();
        };
      })(this))["catch"]((function(_this) {
        return function(error) {
          view.addLine(error).finish();
          return startMessage.dismiss();
        };
      })(this));
    };

    return PullBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9wdWxsLWJyYW5jaC1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSLENBRHBCLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FIakIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBR1E7QUFDSix5Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsaUNBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsRUFBZ0IsTUFBaEIsRUFBeUIsU0FBekIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxTQUFBLE1BQzFCLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsWUFBQSxTQUNuQyxDQUFBO0FBQUEsTUFBQSxvREFBQSxTQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxPQUFELEdBQVcsT0FBWCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFELEdBQVUsT0FGVTtRQUFBLEVBQUE7TUFBQSxDQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/pull-branch-list-view.coffee
