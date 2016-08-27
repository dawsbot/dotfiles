(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(cwd) {
    return git.getConfig('commit.template', cwd).then(function(filePath) {
      if (filePath) {
        return fs.readFileSync(Path.get(filePath.trim())).toString().trim();
      } else {
        return '';
      }
    });
  };

  prepFile = function(status, filePath) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate(cwd).then(function(template) {
        var content;
        content = "" + template + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status;
        return fs.writeFileSync(filePath, content);
      });
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  commit = function(directory, filePath) {
    return git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    })["catch"](function(data) {
      return notifier.addError(data);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  module.exports = function(repo, _arg) {
    var andPush, currentPane, filePath, init, stageChanges, startCommit, _ref;
    _ref = _arg != null ? _arg : {}, stageChanges = _ref.stageChanges, andPush = _ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        return prepFile(status, filePath);
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.add(textEditor.onDidSave(function() {
          return commit(dir(repo), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane, filePath);
        }));
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };
    if (stageChanges) {
      return git.add(repo, {
        update: stageChanges
      }).then(function() {
        return init();
      }).then(function() {
        return startCommit();
      });
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUtBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBVGQsQ0FBQTs7QUFBQSxFQVdBLEdBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtXQUNKLENBQUMsR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFBLElBQXNCLElBQXZCLENBQTRCLENBQUMsbUJBQTdCLENBQUEsRUFESTtFQUFBLENBWE4sQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsS0FBRCxHQUFBO0FBQ3pCLE1BQUEsSUFBRyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUFuQjtlQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7QUFBQSxV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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-commit.coffee
