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
      path: data.substring(1).trim()
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
    var indexOfStatus, lines, message, prevChangedFiles, prevMessage, statusRegex;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '/n';
    });
    statusRegex = /(([ MADRCU?!])\s(.*))/;
    indexOfStatus = lines.findIndex(function(line) {
      return statusRegex.test(line);
    });
    prevMessage = lines.splice(0, indexOfStatus - 1);
    prevMessage.reverse();
    if (prevMessage[0] === '') {
      prevMessage.shift();
    }
    prevMessage.reverse();
    prevChangedFiles = lines.filter(function(line) {
      return line !== '';
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
        replacementText = "committed:\n" + (prevChangedFiles.map(function(f) {
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
