(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles, prevMessage;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    prevMessage = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return prevMessage.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    message = prevMessage.join('\n');
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      var currentChanges, nothingToCommit, replacementText, textToReplace;
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ");
      if (prevChangedFiles.length > 0) {
        nothingToCommit = "nothing to commit, working directory clean";
        currentChanges = "committed:\n" + commentchar;
        textToReplace = null;
        if (status.indexOf(nothingToCommit) > -1) {
          textToReplace = nothingToCommit;
        } else if (status.indexOf(currentChanges) > -1) {
          textToReplace = currentChanges;
        }
        replacementText = "Changes to be committed:\n" + (prevChangedFiles.map(function(f) {
          return "" + commentchar + "   " + f;
        }).join("\n"));
        status = status.replace(textToReplace, replacementText);
      }
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
  };

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
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

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC1hbWVuZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK1BBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBTmQsQ0FBQTs7QUFBQSxFQVFBLG1CQUFBLEdBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLFFBQUEsT0FBQTtBQUFBLElBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEVBQVAsQ0FBQTtLQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLGFBRHhCLENBQUE7OztBQUVLO1dBQUEsc0RBQUE7dUJBQUE7QUFDSCxzQkFBQTtBQUFBLFVBQUMsTUFBQSxJQUFEO0FBQUEsVUFBTyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQWxCO1VBQUEsQ0FERztBQUFBOztTQUhlO0VBQUEsQ0FSdEIsQ0FBQTs7QUFBQSxFQWNBLHFCQUFBLEdBQXdCLFNBQUMsSUFBRCxHQUFBO1dBQ3RCO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWDtBQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
