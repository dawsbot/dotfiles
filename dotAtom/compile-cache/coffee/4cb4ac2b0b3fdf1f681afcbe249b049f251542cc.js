(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile, verboseCommitsEnabled;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.experimental') && atom.config.get('git-plus.verboseCommits');
  };

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
    if (diff == null) {
      diff = '';
    }
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
      var content, startOfComments;
      commentchar = commentchar === '' ? '#' : void 0;
      content = fs.readFileSync(Path.get(filePath)).toString();
      startOfComments = content.indexOf(content.split('\n').find(function(line) {
        return line.startsWith(commentchar);
      }));
      content = content.substring(0, startOfComments);
      return fs.writeFileSync(filePath, content);
    });
  };

  commit = function(directory, filePath) {
    var promise;
    promise = null;
    if (verboseCommitsEnabled()) {
      promise = trimFile(filePath).then(function() {
        return git.cmd(['commit', "--file=" + filePath], {
          cwd: directory
        });
      });
    } else {
      promise = git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
        cwd: directory
      });
    }
    return promise.then(function(data) {
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
        if (verboseCommitsEnabled()) {
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
          return prepFile(status, filePath);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd01BQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FOVixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBVGQsQ0FBQTs7QUFBQSxFQVdBLHFCQUFBLEdBQXdCLFNBQUEsR0FBQTtXQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBQSxJQUE2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQWhEO0VBQUEsQ0FYeEIsQ0FBQTs7QUFBQSxFQWFBLEdBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTtXQUNKLENBQUMsR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFBLElBQXNCLElBQXZCLENBQTRCLENBQUMsbUJBQTdCLENBQUEsRUFESTtFQUFBLENBYk4sQ0FBQTs7QUFBQSxFQWdCQSxjQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO1dBQ2YsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLEtBQUQsR0FBQTtBQUN6QixNQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBbkI7ZUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFwQixFQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxNQUFSLENBQWUsb0JBQWYsRUFIRjtPQUR5QjtJQUFBLENBQTNCLEVBRGU7RUFBQSxDQWhCakIsQ0FBQTs7QUFBQSxFQXVCQSxXQUFBLEdBQWMsU0FBQyxHQUFELEdBQUE7V0FDWixHQUFHLENBQUMsU0FBSixDQUFjLGlCQUFkLEVBQWlDLEdBQWpDLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsU0FBQyxRQUFELEdBQUE7QUFDekMsTUFBQSxJQUFHLFFBQUg7ZUFBaUIsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxRQUFRLENBQUMsSUFBVCxDQUFBLENBQVQsQ0FBaEIsQ0FBMEMsQ0FBQyxRQUEzQyxDQUFBLENBQXFELENBQUMsSUFBdEQsQ0FBQSxFQUFqQjtPQUFBLE1BQUE7ZUFBbUYsR0FBbkY7T0FEeUM7SUFBQSxDQUEzQyxFQURZO0VBQUEsQ0F2QmQsQ0FBQTs7QUFBQSxFQTJCQSxRQUFBLEdBQVcsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixJQUFuQixHQUFBO0FBQ1QsUUFBQSxHQUFBOztNQUQ0QixPQUFLO0tBQ2pDO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQU4sQ0FBQTtXQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsa0JBQWQsRUFBa0MsR0FBbEMsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxTQUFDLFdBQUQsR0FBQTtBQUMxQyxNQUFBLFdBQUEsR0FBaUIsV0FBSCxHQUFvQixXQUFXLENBQUMsSUFBWixDQUFBLENBQXBCLEdBQTRDLEdBQTFELENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFlLGNBQWYsRUFBK0IsSUFBL0IsQ0FEVCxDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUFhLENBQUMsT0FBZCxDQUFzQixLQUF0QixFQUE4QixJQUFBLEdBQUksV0FBSixHQUFnQixHQUE5QyxDQUZULENBQUE7YUFHQSxXQUFBLENBQVksR0FBWixDQUFnQixDQUFDLElBQWpCLENBQXNCLFNBQUMsUUFBRCxHQUFBO0FBQ3BCLFlBQUEsT0FBQTtBQUFBLFFBQUEsT0FBQSxHQUNFLEVBQUEsR0FBSyxRQUFMLEdBQWMsSUFBZCxHQUNOLFdBRE0sR0FDTSxxRUFETixHQUMwRSxXQUQxRSxHQUVGLFNBRkUsR0FFTyxXQUZQLEdBRW1CLDhEQUZuQixHQUVnRixXQUZoRixHQUU0RixJQUY1RixHQUdQLFdBSE8sR0FHSyxHQUhMLEdBR1EsTUFKVixDQUFBO0FBTUEsUUFBQSxJQUFHLElBQUEsS0FBVSxFQUFiO0FBQ0UsVUFBQSxPQUFBLElBQ0ssSUFBQSxHQUFJLFdBQUosR0FBZ0IsSUFBaEIsR0FDWCxXQURXLEdBQ0MseURBREQsR0FDeUQsV0FEekQsR0FFVCxpQ0FGUyxHQUV1QixXQUZ2QixHQUVtQyxzQ0FGbkMsR0FHa0IsSUFKdkIsQ0FERjtTQU5BO2VBYUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsT0FBM0IsRUFkb0I7TUFBQSxDQUF0QixFQUowQztJQUFBLENBQTVDLEVBRlM7RUFBQSxDQTNCWCxDQUFBOztBQUFBLEVBaURBLG1CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixRQUFBLElBQUE7aURBQWMsQ0FBRSxRQUFoQixDQUFBLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsU0FBQyxJQUFELEdBQUE7YUFDOUIsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsU0FBQyxRQUFELEdBQUE7QUFDbkIsWUFBQSxLQUFBO0FBQUEsUUFBQSwwR0FBc0IsQ0FBRSxRQUFyQixDQUE4QixnQkFBOUIsNEJBQUg7QUFDRSxVQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBN0I7QUFDRSxZQUFBLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBQSxDQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsUUFBUSxDQUFDLE9BQVQsQ0FBQSxDQUFBLENBSEY7V0FBQTtBQUlBLGlCQUFPLElBQVAsQ0FMRjtTQURtQjtNQUFBLENBQXJCLEVBRDhCO0lBQUEsQ0FBaEMsV0FEb0I7RUFBQSxDQWpEdEIsQ0FBQTs7QUFBQSxFQTJEQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBTixDQUFBO1dBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxrQkFBZCxFQUFrQyxHQUFsQyxDQUFzQyxDQUFDLElBQXZDLENBQTRDLFNBQUMsV0FBRCxHQUFBO0FBQzFDLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFdBQUEsR0FBaUIsV0FBQSxLQUFlLEVBQWxCLEdBQTBCLEdBQTFCLEdBQUEsTUFBZCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxRQUFULENBQWhCLENBQW1DLENBQUMsUUFBcEMsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLGVBQUEsR0FBa0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFkLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsU0FBQyxJQUFELEdBQUE7ZUFBVSxJQUFJLENBQUMsVUFBTCxDQUFnQixXQUFoQixFQUFWO01BQUEsQ0FBekIsQ0FBaEIsQ0FGbEIsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQWxCLEVBQXFCLGVBQXJCLENBSFYsQ0FBQTthQUlBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLE9BQTNCLEVBTDBDO0lBQUEsQ0FBNUMsRUFGUztFQUFBLENBM0RYLENBQUE7O0FBQUEsRUFvRUEsTUFBQSxHQUFTLFNBQUMsU0FBRCxFQUFZLFFBQVosR0FBQTtBQUNQLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUNBLElBQUEsSUFBRyxxQkFBQSxDQUFBLENBQUg7QUFDRSxNQUFBLE9BQUEsR0FBVSxRQUFBLENBQVMsUUFBVCxDQUFrQixDQUFDLElBQW5CLENBQXdCLFNBQUEsR0FBQTtlQUFHLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELEVBQVksU0FBQSxHQUFTLFFBQXJCLENBQVIsRUFBMEM7QUFBQSxVQUFBLEdBQUEsRUFBSyxTQUFMO1NBQTFDLEVBQUg7TUFBQSxDQUF4QixDQUFWLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxPQUFBLEdBQVUsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxpQkFBWCxFQUErQixTQUFBLEdBQVMsUUFBeEMsQ0FBUixFQUE2RDtBQUFBLFFBQUEsR0FBQSxFQUFLLFNBQUw7T0FBN0QsQ0FBVixDQUhGO0tBREE7V0FLQSxPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsTUFBQSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLG1CQUFBLENBQUEsQ0FEQSxDQUFBO2FBRUEsR0FBRyxDQUFDLE9BQUosQ0FBQSxFQUhXO0lBQUEsQ0FBYixDQUlBLENBQUMsT0FBRCxDQUpBLENBSU8sU0FBQyxJQUFELEdBQUE7YUFDTCxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFsQixFQURLO0lBQUEsQ0FKUCxFQU5PO0VBQUEsQ0FwRVQsQ0FBQTs7QUFBQSxFQWlGQSxPQUFBLEdBQVUsU0FBQyxXQUFELEVBQWMsUUFBZCxHQUFBO0FBQ1IsSUFBQSxJQUEwQixXQUFXLENBQUMsT0FBWixDQUFBLENBQTFCO0FBQUEsTUFBQSxXQUFXLENBQUMsUUFBWixDQUFBLENBQUEsQ0FBQTtLQUFBO0FBQUEsSUFDQSxXQUFXLENBQUMsT0FBWixDQUFBLENBREEsQ0FBQTtXQUVBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUhRO0VBQUEsQ0FqRlYsQ0FBQTs7QUFBQSxFQXNGQSxRQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxRQUFBLGNBQUE7QUFBQSxJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFIO0FBQ0UsTUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBK0IsQ0FBQyxPQUFBLEdBQU8sY0FBUixDQUEvQixDQUFBLENBREEsQ0FERjtLQUFBO1dBR0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBSlM7RUFBQSxDQXRGWCxDQUFBOztBQUFBLEVBNEZBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEscUVBQUE7QUFBQSwwQkFEc0IsT0FBd0IsSUFBdkIsb0JBQUEsY0FBYyxlQUFBLE9BQ3JDLENBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBVixFQUEwQixnQkFBMUIsQ0FBWCxDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FEZCxDQUFBO0FBQUEsSUFFQSxJQUFBLEdBQU8sU0FBQSxHQUFBO2FBQUcsY0FBQSxDQUFlLElBQWYsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixTQUFDLE1BQUQsR0FBQTtBQUNsQyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUcscUJBQUEsQ0FBQSxDQUFIO0FBQ0UsVUFBQSxJQUFBLEdBQU8sQ0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixVQUExQixDQUFQLENBQUE7QUFDQSxVQUFBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FBM0I7QUFBQSxZQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBVixDQUFBLENBQUE7V0FEQTtpQkFFQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztBQUFBLFlBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7V0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO21CQUFVLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFFBQWpCLEVBQTJCLElBQTNCLEVBQVY7VUFBQSxDQUROLEVBSEY7U0FBQSxNQUFBO2lCQU1FLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFFBQWpCLEVBTkY7U0FEa0M7TUFBQSxDQUExQixFQUFIO0lBQUEsQ0FGUCxDQUFBO0FBQUEsSUFVQSxXQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osUUFBQSxDQUFTLFFBQVQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLFVBQUQsR0FBQTtBQUNKLFFBQUEsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsU0FBQSxHQUFBO2lCQUNuQyxNQUFBLENBQU8sR0FBQSxDQUFJLElBQUosQ0FBUCxFQUFrQixRQUFsQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUEsR0FBQTtBQUFHLFlBQUEsSUFBaUIsT0FBakI7cUJBQUEsT0FBQSxDQUFRLElBQVIsRUFBQTthQUFIO1VBQUEsQ0FETixFQURtQztRQUFBLENBQXJCLENBQWhCLENBQUEsQ0FBQTtlQUdBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFNBQUEsR0FBQTtpQkFBRyxPQUFBLENBQVEsV0FBUixFQUFxQixRQUFyQixFQUFIO1FBQUEsQ0FBeEIsQ0FBaEIsRUFKSTtNQUFBLENBRE4sQ0FNQSxDQUFDLE9BQUQsQ0FOQSxDQU1PLFNBQUMsR0FBRCxHQUFBO2VBQVMsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEIsRUFBVDtNQUFBLENBTlAsRUFEWTtJQUFBLENBVmQsQ0FBQTtBQW1CQSxJQUFBLElBQUcsWUFBSDthQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO0FBQUEsUUFBQSxNQUFBLEVBQVEsWUFBUjtPQUFkLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsU0FBQSxHQUFBO2VBQUcsSUFBQSxDQUFBLEVBQUg7TUFBQSxDQUF6QyxDQUFtRCxDQUFDLElBQXBELENBQXlELFNBQUEsR0FBQTtlQUFHLFdBQUEsQ0FBQSxFQUFIO01BQUEsQ0FBekQsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFBLENBQUEsQ0FBTSxDQUFDLElBQVAsQ0FBWSxTQUFBLEdBQUE7ZUFBRyxXQUFBLENBQUEsRUFBSDtNQUFBLENBQVosQ0FDQSxDQUFDLE9BQUQsQ0FEQSxDQUNPLFNBQUMsT0FBRCxHQUFBO0FBQ0wsUUFBQSw2Q0FBRyxPQUFPLENBQUMsU0FBVSxnQkFBckI7aUJBQ0UsV0FBQSxDQUFBLEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBSEY7U0FESztNQUFBLENBRFAsRUFIRjtLQXBCZTtFQUFBLENBNUZqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-commit.coffee
