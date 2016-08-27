(function() {
  var CherryPickSelectCommits, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectCommits = require('../../lib/views/cherry-pick-select-commits-view');

  describe("CherryPickSelectCommits view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectCommits(repo, ['commit1', 'commit2']);
    });
    it("displays a list of commits", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd with 'cherry-pick' and the selected commits", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      this.view.confirmSelection();
      this.view.find('.btn-pick-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['cherry-pick', 'commit1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWNvbW1pdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSx1QkFBQSxHQUEwQixPQUFBLENBQVEsaURBQVIsQ0FGMUIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLHVCQUFBLENBQXdCLElBQXhCLEVBQThCLENBQUMsU0FBRCxFQUFZLFNBQVosQ0FBOUIsRUFESDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2FBQy9CLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDLEVBRCtCO0lBQUEsQ0FBakMsQ0FIQSxDQUFBO1dBTUEsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUEsR0FBQTtBQUM5RCxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFNBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQVcsa0JBQVgsQ0FBOEIsQ0FBQyxLQUEvQixDQUFBLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsYUFBRCxFQUFnQixTQUFoQixDQUFyQyxFQUFpRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBakUsRUFKOEQ7SUFBQSxDQUFoRSxFQVB1QztFQUFBLENBQXpDLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/cherry-pick-select-commit-view-spec.coffee
