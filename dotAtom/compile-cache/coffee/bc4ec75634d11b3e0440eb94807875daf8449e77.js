(function() {
  var $, BranchListView, CompositeDisposable, InputView, RemoteBranchListView, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  RemoteBranchListView = require('../views/remote-branch-list-view');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.show();
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(event) {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            return _this.createBranch();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      this.panel.destroy();
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    InputView.prototype.createBranch = function() {
      var name;
      this.destroy();
      name = this.branchEditor.getModel().getText();
      if (name.length > 0) {
        return git.cmd(['checkout', '-b', name], {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(message) {
          notifier.addSuccess(message);
          return git.refresh();
        })["catch"]((function(_this) {
          return function(err) {
            return notifier.addError(err);
          };
        })(this));
      }
    };

    return InputView;

  })(View);

  module.exports.newBranch = function(repo) {
    return new InputView(repo);
  };

  module.exports.gitBranches = function(repo) {
    return git.cmd(['branch'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new BranchListView(repo, data);
    });
  };

  module.exports.gitRemoteBranches = function(repo) {
    return git.cmd(['branch', '-r'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteBranchListView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWJyYW5jaC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksc0JBQUEsY0FBSixFQUFvQixZQUFBLElBRHBCLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSLENBTGpCLENBQUE7O0FBQUEsRUFNQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsa0NBQVIsQ0FOdkIsQ0FBQTs7QUFBQSxFQVFNO0FBQ0osZ0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsU0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0gsS0FBQyxDQUFBLE9BQUQsQ0FBUyxjQUFULEVBQTZCLElBQUEsY0FBQSxDQUFlO0FBQUEsWUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLFlBQVksZUFBQSxFQUFpQixpQkFBN0I7V0FBZixDQUE3QixFQURHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHdCQUlBLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-branch.coffee
