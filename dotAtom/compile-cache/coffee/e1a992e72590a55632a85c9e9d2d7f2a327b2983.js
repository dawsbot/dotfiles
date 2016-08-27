(function() {
  var GitStageFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageFiles = require('../../lib/models/git-stage-files');

  describe("GitStageFiles", function() {
    return it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageFiles(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0NBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtXQUN4QixFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxlQUFYLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQXRDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsYUFBQSxDQUFjLElBQWQsQ0FEQSxDQUFBO2FBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFYLENBQXlCLENBQUMsZ0JBQTFCLENBQUEsRUFIa0Q7SUFBQSxDQUFwRCxFQUR3QjtFQUFBLENBQTFCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-stage-files-spec.coffee
