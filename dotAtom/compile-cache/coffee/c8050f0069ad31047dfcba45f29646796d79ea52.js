(function() {
  var GitCommit, Path, commentchar_config, commitFilePath, commitPane, commitResolution, commitTemplate, currentPane, fs, git, notifier, pathToRepoFile, repo, setupMocks, status, templateFile, textEditor, workspace, _ref;

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
    spyOn(fs, 'readFileSync').andCallFake(function() {
      if (fs.readFileSync.mostRecentCall.args[0] === 'template') {
        return commitTemplate;
      } else {
        return '';
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
        return expect(git.cmd).toHaveBeenCalledWith(['commit', '--cleanup=strip', "--file=" + commitFilePath], {
          cwd: repo.getWorkingDirectory()
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
    return describe("a failing commit", function() {
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
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jb21taXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc05BQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE9BT0ksT0FBQSxDQUFRLGFBQVIsQ0FQSixFQUNFLFlBQUEsSUFERixFQUVFLGlCQUFBLFNBRkYsRUFHRSxzQkFBQSxjQUhGLEVBSUUsbUJBQUEsV0FKRixFQUtFLGtCQUFBLFVBTEYsRUFNRSxrQkFBQSxVQVRGLENBQUE7O0FBQUEsRUFXQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FYTixDQUFBOztBQUFBLEVBWUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSw2QkFBUixDQVpaLENBQUE7O0FBQUEsRUFhQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBYlgsQ0FBQTs7QUFBQSxFQWVBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsZ0JBQTFCLENBZmpCLENBQUE7O0FBQUEsRUFnQkEsTUFBQSxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBQVQ7QUFBQSxJQUNBLElBQUEsRUFBTSxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FETjtHQWpCRixDQUFBOztBQUFBLEVBbUJBLGtCQUFBLEdBQXFCLEVBbkJyQixDQUFBOztBQUFBLEVBb0JBLFlBQUEsR0FBZSxFQXBCZixDQUFBOztBQUFBLEVBcUJBLGNBQUEsR0FBaUIsUUFyQmpC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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-commit-spec.coffee
