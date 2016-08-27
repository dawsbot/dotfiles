(function() {
  var GitStageHunk, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageHunk = require('../../lib/models/git-stage-hunk');

  describe("GitStageHunk", function() {
    it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageHunk(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
    return it("opens the view for selecting files to choose from", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      return GitStageHunk(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGFnZS1odW5rLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlDQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixJQUFBLEVBQUEsQ0FBRywrQ0FBSCxFQUFvRCxTQUFBLEdBQUE7QUFDbEQsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLGVBQVgsQ0FBMkIsQ0FBQyxTQUE1QixDQUFzQyxPQUFPLENBQUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxZQUFBLENBQWEsSUFBYixDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQVgsQ0FBeUIsQ0FBQyxnQkFBMUIsQ0FBQSxFQUhrRDtJQUFBLENBQXBELENBQUEsQ0FBQTtXQUtBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLGVBQVgsQ0FBMkIsQ0FBQyxTQUE1QixDQUFzQyxPQUFPLENBQUMsT0FBUixDQUFnQixrQkFBaEIsQ0FBdEMsQ0FBQSxDQUFBO2FBQ0EsWUFBQSxDQUFhLElBQWIsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLElBQUQsR0FBQTtlQUN0QixNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsV0FBYixDQUFBLEVBRHNCO01BQUEsQ0FBeEIsRUFGc0Q7SUFBQSxDQUF4RCxFQU51QjtFQUFBLENBQXpCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-stage-hunk-spec.coffee
