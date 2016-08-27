(function() {
  var Path, commitPane, currentPane, fs, git, mockRepo, mockRepoWithSubmodule, mockSubmodule, notifier, pathToRepoFile, pathToSubmoduleFile, repo, textEditor, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../lib/git');

  notifier = require('../lib/notifier');

  _ref = require('./fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, commitPane = _ref.commitPane, currentPane = _ref.currentPane;

  pathToSubmoduleFile = Path.get("~/some/submodule/file");

  mockRepo = {
    getWorkingDirectory: function() {
      return Path.get("~/some/repository");
    },
    refreshStatus: function() {
      return void 0;
    },
    relativize: function(path) {
      if (path === pathToRepoFile) {
        return "directory/file";
      }
    },
    repo: {
      submoduleForPath: function(path) {
        return void 0;
      }
    }
  };

  mockSubmodule = {
    getWorkingDirectory: function() {
      return Path.get("~/some/submodule");
    },
    relativize: function(path) {
      if (path === pathToSubmoduleFile) {
        return "file";
      }
    }
  };

  mockRepoWithSubmodule = Object.create(mockRepo);

  mockRepoWithSubmodule.repo = {
    submoduleForPath: function(path) {
      if (path === pathToSubmoduleFile) {
        return mockSubmodule;
      }
    }
  };

  describe("Git-Plus git module", function() {
    describe("git.getConfig", function() {
      var args;
      args = ['config', '--get', 'user.name'];
      describe("when a repo file path isn't specified", function() {
        return it("spawns a command querying git for the given global setting", function() {
          spyOn(git, 'cmd').andReturn(Promise.resolve('akonwi'));
          waitsForPromise(function() {
            return git.getConfig('user.name');
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: Path.get('~')
            });
          });
        });
      });
      describe("when a repo file path is specified", function() {
        return it("checks for settings in that repo", function() {
          spyOn(git, 'cmd').andReturn(Promise.resolve('akonwi'));
          waitsForPromise(function() {
            return git.getConfig('user.name', repo.getWorkingDirectory());
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
      describe("when the command fails without an error message", function() {
        return it("resolves to ''", function() {
          spyOn(git, 'cmd').andReturn(Promise.reject(''));
          waitsForPromise(function() {
            return git.getConfig('user.name', repo.getWorkingDirectory()).then(function(result) {
              return expect(result).toEqual('');
            });
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
      return describe("when the command fails with an error message", function() {
        return it("rejects with the error message", function() {
          spyOn(git, 'cmd').andReturn(Promise.reject('getConfig error'));
          spyOn(notifier, 'addError');
          return waitsForPromise(function() {
            return git.getConfig('user.name', 'bad working dir').then(function(result) {
              return fail("should have been rejected");
            })["catch"](function(error) {
              return expect(notifier.addError).toHaveBeenCalledWith('getConfig error');
            });
          });
        });
      });
    });
    describe("git.getRepo", function() {
      return it("returns a promise resolving to repository", function() {
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return waitsForPromise(function() {
          return git.getRepo().then(function(actual) {
            return expect(actual.getWorkingDirectory()).toEqual(repo.getWorkingDirectory());
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise resolving to absolute path of repo", function() {
        spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return git.dir().then(function(dir) {
          return expect(dir).toEqual(repo.getWorkingDirectory());
        });
      });
    });
    describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepoWithSubmodule];
        });
        return expect(git.getSubmodule(pathToSubmoduleFile).getWorkingDirectory()).toEqual(Path.get("~/some/submodule"));
      });
    });
    describe("git.relativize", function() {
      return it("returns relativized filepath for files in repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo, mockRepoWithSubmodule];
        });
        expect(git.relativize(pathToRepoFile)).toBe('directory/file');
        return expect(git.relativize(pathToSubmoduleFile)).toBe("file");
      });
    });
    describe("git.cmd", function() {
      it("returns a promise", function() {
        return waitsForPromise(function() {
          var promise;
          promise = git.cmd();
          expect(promise["catch"]).toBeDefined();
          expect(promise.then).toBeDefined();
          return promise["catch"](function(output) {
            return expect(output).toContain('usage');
          });
        });
      });
      it("returns a promise that is fulfilled with stdout on success", function() {
        return waitsForPromise(function() {
          return git.cmd(['--version']).then(function(output) {
            return expect(output).toContain('git version');
          });
        });
      });
      it("returns a promise that is rejected with stderr on failure", function() {
        return waitsForPromise(function() {
          return git.cmd(['help', '--bogus-option'])["catch"](function(output) {
            return expect(output).toContain('unknown option');
          });
        });
      });
      return it("returns a promise that is fulfilled with stderr on success", function() {
        var cloneDir, initDir;
        initDir = 'git-plus-test-dir' + Math.random();
        cloneDir = initDir + '-clone';
        return waitsForPromise(function() {
          return git.cmd(['init', initDir]).then(function() {
            return git.cmd(['clone', '--progress', initDir, cloneDir]);
          }).then(function(output) {
            fs.removeSync(initDir);
            fs.removeSync(cloneDir);
            return expect(output).toContain('Cloning');
          });
        });
      });
    });
    describe("git.add", function() {
      it("calls git.cmd with ['add', '--all', {fileName}]", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            file: pathToSubmoduleFile
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', pathToSubmoduleFile], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      it("calls git.cmd with ['add', '--all', '.'] when no file is specified", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      return it("calls git.cmd with ['add', '--update'...] when update option is true", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            update: true
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--update', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.reset", function() {
      return it("resets and unstages all files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.reset(mockRepo).then(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.stagedFiles", function() {
      return it("returns an empty array when there are no staged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.stagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.unstagedFiles", function() {
      return it("returns an empty array when there are no unstaged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.unstagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.status", function() {
      return it("calls git.cmd with 'status' as the first argument", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args;
          if (args[0][0] === 'status') {
            return Promise.resolve(true);
          }
        });
        return git.status(mockRepo).then(function() {
          return expect(true).toBeTruthy();
        });
      });
    });
    describe("git.refresh", function() {
      it("calls git.cmd with 'add' and '--refresh' arguments for each repo in project", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args[0];
          expect(args[0]).toBe('add');
          return expect(args[1]).toBe('--refresh');
        });
        spyOn(mockRepo, 'getWorkingDirectory').andCallFake(function() {
          return expect(mockRepo.getWorkingDirectory.callCount).toBe(1);
        });
        return git.refresh();
      });
      return it("calls repo.refreshStatus for each repo in project", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo];
        });
        spyOn(mockRepo, 'refreshStatus');
        spyOn(git, 'cmd').andCallFake(function() {
          return void 0;
        });
        git.refresh();
        return expect(mockRepo.refreshStatus.callCount).toBe(1);
      });
    });
    return describe("git.diff", function() {
      return it("calls git.cmd with ['diff', '-p', '-U1'] and the file path", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve("string");
        });
        git.diff(mockRepo, pathToRepoFile);
        return expect(git.cmd).toHaveBeenCalledWith(['diff', '-p', '-U1', pathToRepoFile], {
          cwd: mockRepo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvZ2l0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZKQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFlBQVIsQ0FGTixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxPQU1JLE9BQUEsQ0FBUSxZQUFSLENBTkosRUFDRSxZQUFBLElBREYsRUFFRSxzQkFBQSxjQUZGLEVBR0Usa0JBQUEsVUFIRixFQUlFLGtCQUFBLFVBSkYsRUFLRSxtQkFBQSxXQVRGLENBQUE7O0FBQUEsRUFXQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLHVCQUFULENBWHRCLENBQUE7O0FBQUEsRUFhQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsbUJBQVQsRUFBSDtJQUFBLENBQXJCO0FBQUEsSUFDQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBRGY7QUFBQSxJQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUFVLE1BQUEsSUFBb0IsSUFBQSxLQUFRLGNBQTVCO2VBQUEsaUJBQUE7T0FBVjtJQUFBLENBRlo7QUFBQSxJQUdBLElBQUEsRUFDRTtBQUFBLE1BQUEsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEdBQUE7ZUFBVSxPQUFWO01BQUEsQ0FBbEI7S0FKRjtHQWRGLENBQUE7O0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/git-spec.coffee
