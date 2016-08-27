(function() {
  var GitDiffTool, Path, fs, git, pathToRepoFile, repo, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitDiffTool = require('../../lib/models/git-difftool');

  describe("GitDiffTool", function() {
    beforeEach(function() {
      atom.config.set('git-plus.includeStagedDiff', true);
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      spyOn(git, 'getConfig').andReturn(Promise.resolve('some-tool'));
      return waitsForPromise(function() {
        return GitDiffTool(repo, {
          file: pathToRepoFile
        });
      });
    });
    return describe("when git-plus.includeStagedDiff config is true", function() {
      it("calls git.cmd with 'diff-index HEAD -z'", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['diff-index', 'HEAD', '-z'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      return it("calls `git.getConfig` to check if a a difftool is set", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('diff.tool', repo.getWorkingDirectory());
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1kaWZmdG9vbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzREFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUZQLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUixDQUpkLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLElBQTlDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBaEIsQ0FBNUIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxLQUFBLENBQU0sR0FBTixFQUFXLFdBQVgsQ0FBdUIsQ0FBQyxTQUF4QixDQUFrQyxPQUFPLENBQUMsT0FBUixDQUFnQixXQUFoQixDQUFsQyxDQUZBLENBQUE7YUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLFdBQUEsQ0FBWSxJQUFaLEVBQWtCO0FBQUEsVUFBQSxJQUFBLEVBQU0sY0FBTjtTQUFsQixFQURjO01BQUEsQ0FBaEIsRUFKUztJQUFBLENBQVgsQ0FBQSxDQUFBO1dBT0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxNQUFBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7ZUFDNUMsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxZQUFELEVBQWUsTUFBZixFQUF1QixJQUF2QixDQUFyQyxFQUFtRTtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBbkUsRUFENEM7TUFBQSxDQUE5QyxDQUFBLENBQUE7YUFHQSxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQSxHQUFBO2VBQzFELE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBWCxDQUFxQixDQUFDLG9CQUF0QixDQUEyQyxXQUEzQyxFQUF3RCxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUF4RCxFQUQwRDtNQUFBLENBQTVELEVBSnlEO0lBQUEsQ0FBM0QsRUFSc0I7RUFBQSxDQUF4QixDQU5BLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-difftool-spec.coffee
