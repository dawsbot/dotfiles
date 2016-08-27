(function() {
  var $, CompositeDisposable, InputView, OutputViewManager, TextEditorView, View, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Git command and arguments'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var _ref1;
            if ((_ref1 = _this.panel) != null) {
              _ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var args, view, _ref1;
          _this.disposables.dispose();
          if ((_ref1 = _this.panel) != null) {
            _ref1.destroy();
          }
          view = OutputViewManager.create();
          args = _this.commandEditor.getText().split(' ');
          if (args[0] === 1) {
            args.shift();
          }
          return git.cmd(args, {
            cwd: _this.repo.getWorkingDirectory()
          }).then(function(data) {
            var msg;
            msg = "git " + (args.join(' ')) + " was successful";
            notifier.addSuccess(msg);
            if ((data != null ? data.length : void 0) > 0) {
              view.addLine(data);
            } else {
              view.reset();
            }
            view.finish();
            git.refresh();
            return _this.currentPane.activate();
          })["catch"](function(msg) {
            if ((msg != null ? msg.length : void 0) > 0) {
              view.addLine(msg);
            } else {
              view.reset();
            }
            view.finish();
            git.refresh();
            return _this.currentPane.activate();
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXJ1bi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0ZBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksc0JBQUEsY0FBSixFQUFvQixZQUFBLElBRHBCLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUxwQixDQUFBOztBQUFBLEVBT007QUFDSixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBOEIsSUFBQSxjQUFBLENBQWU7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFBWSxlQUFBLEVBQWlCLDJCQUE3QjtXQUFmLENBQTlCLEVBREc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsd0JBSUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLElBQUMs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-run.coffee
