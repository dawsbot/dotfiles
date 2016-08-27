(function() {
  var CherryPickSelectBranch, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectBranch = require('../../lib/views/cherry-pick-select-branch-view');

  describe("CherryPickSelectBranch view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectBranch(repo, ['head1', 'head2'], 'currentHead');
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd to get commits between currentHead and selected head", function() {
      var expectedArgs;
      spyOn(git, 'cmd').andReturn(Promise.resolve('heads'));
      this.view.confirmSelection();
      expectedArgs = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', "currentHead...head1"];
      return expect(git.cmd).toHaveBeenCalledWith(expectedArgs, {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWJyYW5jaC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsZ0RBQVIsQ0FGekIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLHNCQUFBLENBQXVCLElBQXZCLEVBQTZCLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBN0IsRUFBaUQsYUFBakQsRUFESDtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO2FBQ2hDLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDLEVBRGdDO0lBQUEsQ0FBbEMsQ0FIQSxDQUFBO1dBTUEsRUFBQSxDQUFHLG9FQUFILEVBQXlFLFNBQUEsR0FBQTtBQUN2RSxVQUFBLFlBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE9BQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsWUFBQSxHQUFlLENBQ2IsS0FEYSxFQUViLGVBRmEsRUFHYixJQUhhLEVBSWIsMkJBSmEsRUFLYixxQkFMYSxDQUZmLENBQUE7YUFTQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxZQUFyQyxFQUFtRDtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBbkQsRUFWdUU7SUFBQSxDQUF6RSxFQVBzQztFQUFBLENBQXhDLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/cherry-pick-select-branch-view-spec.coffee
