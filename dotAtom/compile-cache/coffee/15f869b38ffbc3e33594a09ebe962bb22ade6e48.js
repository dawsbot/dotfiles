(function() {
  var GitMerge, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitMerge = require('../../lib/models/git-merge');

  describe("GitMerge", function() {
    describe("when called with no options", function() {
      return it("calls git.cmd with 'branch'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(''));
        GitMerge(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['branch'], {
          cwd: repo.getWorkingDirectory()
        });
      });
    });
    return describe("when called with { remote: true } option", function() {
      return it("calls git.cmd with 'remote branch'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(''));
        GitMerge(repo, {
          remote: true
        });
        return expect(git.cmd).toHaveBeenCalledWith(['branch', '-r'], {
          cwd: repo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1tZXJnZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSw0QkFBUixDQUZYLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsSUFBQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO2FBQ3RDLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxRQUNBLFFBQUEsQ0FBUyxJQUFULENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxDQUFyQyxFQUFpRDtBQUFBLFVBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7U0FBakQsRUFIZ0M7TUFBQSxDQUFsQyxFQURzQztJQUFBLENBQXhDLENBQUEsQ0FBQTtXQU1BLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBLEdBQUE7YUFDbkQsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxRQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLElBQVQsRUFBZTtBQUFBLFVBQUEsTUFBQSxFQUFRLElBQVI7U0FBZixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxJQUFYLENBQXJDLEVBQXVEO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUF2RCxFQUh1QztNQUFBLENBQXpDLEVBRG1EO0lBQUEsQ0FBckQsRUFQbUI7RUFBQSxDQUFyQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-merge-spec.coffee
