(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile;

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

  prepFile = function(status, filePath, diff) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate(cwd).then(function(template) {
        var content;
        content = "" + template + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status;
        if (diff !== '') {
          content += "\n" + commentchar + "\n" + commentchar + " ------------------------ >8 ------------------------\n" + commentchar + " Do not touch the line above.\n" + commentchar + " Everything below will be removed.\n" + diff;
        }
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

  trimFile = function(filePath) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      var content;
      commentchar = commentchar === '' ? '#' : void 0;
      content = fs.readFileSync(Path.get(filePath)).toString();
      content = content.substring(0, content.indexOf(commentchar));
      return fs.writeFileSync(filePath, content);
    });
  };

  commit = function(directory, filePath) {
    return trimFile(filePath).then(function() {
      return git.cmd(['commit', "--file=" + filePath], {
        cwd: directory
      });
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
        var args;
        if (atom.config.get('git-plus.experimental') && atom.config.get('git-plus.verboseCommits')) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile(status, filePath, diff);
          });
        } else {
          return prepFile(status, filePath, '');
        }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUxBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBVGQsQ0FBQTs7QUFBQSxFQVdBLEdBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtXQUNKLENBQUMsR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFBLElBQXNCLElBQXZCLENBQTRCLENBQUMsbUJBQTdCLENBQUEsRUFESTtFQUFBLENBWE4sQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsS0FBRCxHQUFBO0FBQ3pCLE1BQUEsSUFBRyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUFuQjtlQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7QUFBQSxV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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-commit.coffee
