(function() {
  var GitCommit, Path, commentchar_config, commitFileContent, commitFilePath, commitPane, commitResolution, commitTemplate, currentPane, fs, git, notifier, pathToRepoFile, repo, setupMocks, status, templateFile, textEditor, workspace, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, workspace = _ref.workspace, pathToRepoFile = _ref.pathToRepoFile, currentPane = _ref.currentPane, textEditor = _ref.textEditor, commitPane = _ref.commitPane;

  git = require('../../lib/git');

  GitCommit = require('../../lib/models/git-commit');

  notifier = require('../../lib/notifier');

  commitFilePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');

  status = {
    replace: function() {
      return status;
    },
    trim: function() {
      return status;
    }
  };

  commentchar_config = '';

  templateFile = '';

  commitTemplate = 'foobar';

  commitFileContent = {
    toString: function() {
      return commitFileContent;
    },
    indexOf: function() {
      return 5;
    },
    substring: function() {
      return 'commit message';
    },
    split: function(splitPoint) {
      if (splitPoint === '\n') {
        return ['commit message', '# comments to be deleted'];
      }
    }
  };

  commitResolution = Promise.resolve('commit success');

  setupMocks = function() {
    atom.config.set('git-plus.openInPane', false);
    spyOn(currentPane, 'activate');
    spyOn(commitPane, 'destroy').andCallThrough();
    spyOn(commitPane, 'splitRight');
    spyOn(atom.workspace, 'getActivePane').andReturn(currentPane);
    spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
    spyOn(atom.workspace, 'getPanes').andReturn([currentPane, commitPane]);
    spyOn(atom.workspace, 'paneForURI').andReturn(commitPane);
    spyOn(status, 'replace').andCallFake(function() {
      return status;
    });
    spyOn(status, 'trim').andCallThrough();
    spyOn(commitFileContent, 'substring').andCallThrough();
    spyOn(fs, 'readFileSync').andCallFake(function() {
      if (fs.readFileSync.mostRecentCall.args[0] === 'template') {
        return commitTemplate;
      } else {
        return commitFileContent;
      }
    });
    spyOn(fs, 'writeFileSync');
    spyOn(fs, 'writeFile');
    spyOn(fs, 'unlink');
    spyOn(git, 'refresh');
    spyOn(git, 'getConfig').andCallFake(function() {
      var arg;
      arg = git.getConfig.mostRecentCall.args[0];
      if (arg === 'commit.template') {
        return Promise.resolve(templateFile);
      } else if (arg === 'core.commentchar') {
        return Promise.resolve(commentchar_config);
      }
    });
    spyOn(git, 'cmd').andCallFake(function() {
      var args;
      args = git.cmd.mostRecentCall.args[0];
      if (args[0] === 'status') {
        return Promise.resolve(status);
      } else if (args[0] === 'commit') {
        return commitResolution;
      } else if (args[0] === 'diff') {
        return Promise.resolve('diff');
      }
    });
    spyOn(git, 'stagedFiles').andCallFake(function() {
      var args;
      args = git.stagedFiles.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory()) {
        return Promise.resolve([pathToRepoFile]);
      }
    });
    spyOn(git, 'add').andCallFake(function() {
      var args;
      args = git.add.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory() && args[1].update) {
        return Promise.resolve(true);
      }
    });
    spyOn(notifier, 'addError');
    spyOn(notifier, 'addInfo');
    return spyOn(notifier, 'addSuccess');
  };

  describe("GitCommit", function() {
    describe("a regular commit", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        commitResolution = Promise.resolve('commit success');
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      it("gets the current pane", function() {
        return expect(atom.workspace.getActivePane).toHaveBeenCalled();
      });
      it("gets the commentchar from configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('core.commentchar', Path.dirname(commitFilePath));
      });
      it("gets staged files", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      it("removes lines with '(...)' from status", function() {
        return expect(status.replace).toHaveBeenCalled();
      });
      it("gets the commit template from git configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('commit.template', Path.dirname(commitFilePath));
      });
      it("writes to a file", function() {
        var argsTo_fsWriteFile;
        argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
        return expect(argsTo_fsWriteFile[0]).toEqual(commitFilePath);
      });
      it("shows the file", function() {
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      it("calls git.cmd with ['commit'...] on textEditor save", function() {
        textEditor.save();
        waitsFor(function() {
          return git.cmd.callCount > 1;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['commit', "--cleanup=strip", "--file=" + commitFilePath], {
            cwd: repo.getWorkingDirectory()
          });
        });
      });
      it("closes the commit pane when commit is successful", function() {
        textEditor.save();
        waitsFor(function() {
          return commitPane.destroy.callCount > 0;
        });
        return runs(function() {
          return expect(commitPane.destroy).toHaveBeenCalled();
        });
      });
      it("notifies of success when commit is successful", function() {
        textEditor.save();
        waitsFor(function() {
          return notifier.addSuccess.callCount > 0;
        });
        return runs(function() {
          return expect(notifier.addSuccess).toHaveBeenCalledWith('commit success');
        });
      });
      return it("cancels the commit on textEditor destroy", function() {
        textEditor.destroy();
        expect(currentPane.activate).toHaveBeenCalled();
        return expect(fs.unlink).toHaveBeenCalledWith(commitFilePath);
      });
    });
    describe("when core.commentchar config is not set", function() {
      return it("uses '#' in commit file", function() {
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe('#');
        });
      });
    });
    describe("when core.commentchar config is set to '$'", function() {
      return it("uses '$' as the commentchar", function() {
        commentchar_config = '$';
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe(commentchar_config);
        });
      });
    });
    describe("when commit.template config is not set", function() {
      return it("commit file starts with a blank line", function() {
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo).then(function() {
            var argsTo_fsWriteFile;
            argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
            return expect(argsTo_fsWriteFile[1].charAt(0)).toEqual("\n");
          });
        });
      });
    });
    describe("when commit.template config is set", function() {
      return it("commit file starts with content of that file", function() {
        templateFile = 'template';
        setupMocks();
        GitCommit(repo);
        waitsFor(function() {
          return fs.writeFileSync.callCount > 0;
        });
        return runs(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].indexOf(commitTemplate)).toBe(0);
        });
      });
    });
    describe("when 'stageChanges' option is true", function() {
      return it("calls git.add with update option set to true", function() {
        setupMocks();
        return GitCommit(repo, {
          stageChanges: true
        }).then(function() {
          return expect(git.add).toHaveBeenCalledWith(repo, {
            update: true
          });
        });
      });
    });
    describe("a failing commit", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        commitResolution = Promise.reject('commit error');
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      return it("notifies of error and doesn't close commit pane", function() {
        textEditor.save();
        waitsFor(function() {
          return notifier.addError.callCount > 0;
        });
        return runs(function() {
          expect(notifier.addError).toHaveBeenCalledWith('commit error');
          return expect(commitPane.destroy).not.toHaveBeenCalled();
        });
      });
    });
    return describe("when the verbose commit setting is true", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        atom.config.set("git-plus.experimental", true);
        atom.config.set("git-plus.verboseCommits", true);
        return setupMocks();
      });
      it("calls git.cmd with the --verbose flag", function() {
        waitsForPromise(function() {
          return GitCommit(repo);
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['diff', '--color=never', '--staged'], {
            cwd: repo.getWorkingDirectory()
          });
        });
      });
      return it("trims the commit file", function() {
        textEditor.save();
        waitsFor(function() {
          return commitFileContent.substring.callCount > 0;
        });
        return runs(function() {
          return expect(commitFileContent.substring).toHaveBeenCalledWith(0, commitFileContent.indexOf());
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jb21taXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseU9BQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE9BT0ksT0FBQSxDQUFRLGFBQVIsQ0FQSixFQUNFLFlBQUEsSUFERixFQUVFLGlCQUFBLFNBRkYsRUFHRSxzQkFBQSxjQUhGLEVBSUUsbUJBQUEsV0FKRixFQUtFLGtCQUFBLFVBTEYsRUFNRSxrQkFBQSxVQVRGLENBQUE7O0FBQUEsRUFXQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FYTixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSw2QkFBUixDQVpaLENBQUE7O0FBQUEsRUFhQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBYlgsQ0FBQTs7QUFBQSxFQWVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsZ0JBQTFCLENBZmpCLENBQUE7O0FBQUEsRUFnQkEsTUFBQSxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBQVQ7QUFBQSxJQUNBLElBQUEsRUFBTSxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FETjtHQWpCRixDQUFBOztBQUFBLEVBbUJBLGtCQUFBLEdBQXFCLEVBbkJyQixDQUFBOztBQUFBLEVBb0JBLFlBQUEsR0FBZSxFQXBCZixDQUFBOztBQUFBLEVBcUJBLGNBQUEsR0FBaUIsUUFyQmpC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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-commit-spec.coffee
