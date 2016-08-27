(function() {
  var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, prepFile, showCommitFilePath, showFile, showObject, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), "" + objectHash + ".diff");
  };

  showObject = function(repo, objectHash, file) {
    var args;
    args = ['show', '--color=never', '--format=full'];
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--', file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      if (data.length > 0) {
        return prepFile(data, objectHash);
      }
    });
  };

  prepFile = function(text, objectHash) {
    return fs.writeFile(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    }, function(err) {
      if (err) {
        return notifier.addError(err);
      } else {
        return showFile(objectHash);
      }
    });
  };

  showFile = function(objectHash) {
    var disposables, splitDirection;
    disposables = new CompositeDisposable;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(showCommitFilePath(objectHash), {
      activatePane: true
    }).then(function(textBuffer) {
      if (textBuffer != null) {
        return disposables.add(textBuffer.onDidDestroy(function() {
          disposables.dispose();
          try {
            return fs.unlinkSync(showCommitFilePath(objectHash));
          } catch (_error) {}
        }));
      }
    });
  };

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show'
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
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var name, text;
            text = _this.objectHash.getModel().getText().split(' ');
            name = text.length === 2 ? text[1] : text[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return (_ref2 = this.panel) != null ? _ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXNob3cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBSkQsQ0FBQTs7QUFBQSxFQUtBLE9BQXlCLE9BQUEsQ0FBUSxzQkFBUixDQUF6QixFQUFDLHNCQUFBLGNBQUQsRUFBaUIsWUFBQSxJQUxqQixDQUFBOztBQUFBLEVBT0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBUE4sQ0FBQTs7QUFBQSxFQVNBLGtCQUFBLEdBQXFCLFNBQUMsVUFBRCxHQUFBO1dBQ25CLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFWLEVBQXVCLEVBQUEsR0FBRyxVQUFILEdBQWMsT0FBckMsRUFEbUI7RUFBQSxDQVRyQixDQUFBOztBQUFBLEVBWUEsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsSUFBbkIsR0FBQTtBQUNYLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQsRUFBMEIsZUFBMUIsQ0FBUCxDQUFBO0FBQ0EsSUFBQSxJQUEyQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQTNCO0FBQUEsTUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-show.coffee
