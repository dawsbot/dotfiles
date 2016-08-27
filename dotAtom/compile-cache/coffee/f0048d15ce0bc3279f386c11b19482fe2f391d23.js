(function() {
  var BranchListView, DeleteBranchListView, git, notifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = DeleteBranchListView = (function(_super) {
    __extends(DeleteBranchListView, _super);

    function DeleteBranchListView() {
      return DeleteBranchListView.__super__.constructor.apply(this, arguments);
    }

    DeleteBranchListView.prototype.initialize = function(repo, data, _arg) {
      this.repo = repo;
      this.data = data;
      this.isRemote = (_arg != null ? _arg : {}).isRemote;
      return DeleteBranchListView.__super__.initialize.apply(this, arguments);
    };

    DeleteBranchListView.prototype.confirmed = function(_arg) {
      var branch, name, remote;
      name = _arg.name;
      if (name.startsWith("*")) {
        name = name.slice(1);
      }
      if (!this.isRemote) {
        this["delete"](name);
      } else {
        branch = name.substring(name.indexOf('/') + 1);
        remote = name.substring(0, name.indexOf('/'));
        this["delete"](branch, remote);
      }
      return this.cancel();
    };

    DeleteBranchListView.prototype["delete"] = function(branch, remote) {
      var args;
      args = remote ? ['push', remote, '--delete'] : ['branch', '-D'];
      return git.cmd(args.concat(branch), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(message) {
        return notifier.addSuccess(message);
      })["catch"](function(error) {
        return notifier.addError(error);
      });
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9kZWxldGUtYnJhbmNoLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUVRO0FBQ0osMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1DQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEVBQWUsSUFBZixHQUFBO0FBQWtDLE1BQWpDLElBQUMsQ0FBQSxPQUFBLElBQWdDLENBQUE7QUFBQSxNQUExQixJQUFDLENBQUEsT0FBQSxJQUF5QixDQUFBO0FBQUEsTUFBbEIsSUFBQyxDQUFBLDJCQUFGLE9BQVksSUFBVixRQUFpQixDQUFBO2FBQUEsc0RBQUEsU0FBQSxFQUFsQztJQUFBLENBQVosQ0FBQTs7QUFBQSxtQ0FFQSxTQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxVQUFBLG9CQUFBO0FBQUEsTUFEVyxPQUFELEtBQUMsSUFDWCxDQUFBO0FBQUEsTUFBQSxJQUF3QixJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUF4QjtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWCxDQUFQLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxRQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBQSxDQUFELENBQVEsSUFBUixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBQSxHQUFvQixDQUFuQyxDQUFULENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsRUFBa0IsSUFBSSxDQUFDLE9BQUwsQ0FBYSxHQUFiLENBQWxCLENBRFQsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFFBQUEsQ0FBRCxDQUFRLE1BQVIsRUFBZ0IsTUFBaEIsQ0FGQSxDQUhGO09BREE7YUFPQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBUlM7SUFBQSxDQUZYLENBQUE7O0FBQUEsbUNBWUEsU0FBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNOLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFVLE1BQUgsR0FBZSxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLFVBQWpCLENBQWYsR0FBaUQsQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUF4RCxDQUFBO2FBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFJLENBQUMsTUFBTCxDQUFZLE1BQVosQ0FBUixFQUE2QjtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQTdCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxPQUFELEdBQUE7ZUFBYSxRQUFRLENBQUMsVUFBVCxDQUFvQixPQUFwQixFQUFiO01BQUEsQ0FETixDQUVBLENBQUMsT0FBRCxDQUZBLENBRU8sU0FBQyxLQUFELEdBQUE7ZUFBVyxRQUFRLENBQUMsUUFBVCxDQUFrQixLQUFsQixFQUFYO01BQUEsQ0FGUCxFQUZNO0lBQUEsQ0FaUixDQUFBOztnQ0FBQTs7S0FEaUMsZUFOckMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/delete-branch-view.coffee
