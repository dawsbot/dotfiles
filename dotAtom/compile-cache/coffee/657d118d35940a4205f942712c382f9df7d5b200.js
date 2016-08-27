(function() {
  var git, gitBranches, gitRemoteBranches, newBranch, pathToRepoFile, repo, _ref, _ref1;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  _ref1 = require('../../lib/models/git-branch'), gitBranches = _ref1.gitBranches, gitRemoteBranches = _ref1.gitRemoteBranches, newBranch = _ref1.newBranch;

  describe("GitBranch", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'addModalPanel').andCallThrough();
    });
    describe(".gitBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitBranches(repo);
        });
      });
      return it("displays a list of the repo's branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    describe(".gitRemoteBranches", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve('branch1\nbranch2'));
        return waitsForPromise(function() {
          return gitRemoteBranches(repo);
        });
      });
      return it("displays a list of the repo's remote branches", function() {
        expect(git.cmd).toHaveBeenCalledWith(['branch', '-r'], {
          cwd: repo.getWorkingDirectory()
        });
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
    return describe(".newBranch", function() {
      beforeEach(function() {
        spyOn(git, 'cmd').andReturn(function() {
          return Promise.reject('new branch created');
        });
        return newBranch(repo);
      });
      return it("displays a text input", function() {
        return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1icmFuY2gtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUZBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQURQLENBQUE7O0FBQUEsRUFFQSxRQUlJLE9BQUEsQ0FBUSw2QkFBUixDQUpKLEVBQ0Usb0JBQUEsV0FERixFQUVFLDBCQUFBLGlCQUZGLEVBR0Usa0JBQUEsU0FMRixDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNQLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixlQUF0QixDQUFzQyxDQUFDLGNBQXZDLENBQUEsRUFETztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBNUIsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsV0FBQSxDQUFZLElBQVosRUFBSDtRQUFBLENBQWhCLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsUUFBQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsQ0FBckMsRUFBaUQ7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQWpELENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQXRCLENBQW9DLENBQUMsZ0JBQXJDLENBQUEsRUFGMkM7TUFBQSxDQUE3QyxFQUx1QjtJQUFBLENBQXpCLENBSEEsQ0FBQTtBQUFBLElBWUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUE1QixDQUFBLENBQUE7ZUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFBRyxpQkFBQSxDQUFrQixJQUFsQixFQUFIO1FBQUEsQ0FBaEIsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxRQUFBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxFQUFXLElBQVgsQ0FBckMsRUFBdUQ7QUFBQSxVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQXZELENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQXRCLENBQW9DLENBQUMsZ0JBQXJDLENBQUEsRUFGa0Q7TUFBQSxDQUFwRCxFQUw2QjtJQUFBLENBQS9CLENBWkEsQ0FBQTtXQXFCQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixTQUFBLEdBQUE7aUJBQUcsT0FBTyxDQUFDLE1BQVIsQ0FBZSxvQkFBZixFQUFIO1FBQUEsQ0FBNUIsQ0FBQSxDQUFBO2VBQ0EsU0FBQSxDQUFVLElBQVYsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtlQUMxQixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUF0QixDQUFvQyxDQUFDLGdCQUFyQyxDQUFBLEVBRDBCO01BQUEsQ0FBNUIsRUFMcUI7SUFBQSxDQUF2QixFQXRCb0I7RUFBQSxDQUF0QixDQVJBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-branch-spec.coffee
