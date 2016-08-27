(function() {
  var DeleteBranchView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  DeleteBranchView = require('../../lib/views/delete-branch-view');

  describe("DeleteBranchView", function() {
    it("deletes the selected local branch", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "branch/1\nbranch2");
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['branch', '-D', 'branch/1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
    return it("deletes the selected remote branch when `isRemote: true`", function() {
      var view;
      spyOn(git, 'cmd').andReturn(Promise.resolve('success'));
      view = new DeleteBranchView(repo, "origin/branch", {
        isRemote: true
      });
      view.confirmSelection();
      return expect(git.cmd).toHaveBeenCalledWith(['push', 'origin', '--delete', 'branch'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvZGVsZXRlLWJyYW5jaC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsb0NBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsSUFBQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQSxHQUFBO0FBQ3RDLFVBQUEsSUFBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsU0FBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixtQkFBdkIsQ0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQSxDQUZBLENBQUE7YUFHQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxJQUFYLEVBQWlCLFVBQWpCLENBQXJDLEVBQW1FO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFuRSxFQUpzQztJQUFBLENBQXhDLENBQUEsQ0FBQTtXQU1BLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsVUFBQSxJQUFBO0FBQUEsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBVyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLGVBQXZCLEVBQXdDO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtPQUF4QyxDQURYLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsVUFBbkIsRUFBK0IsUUFBL0IsQ0FBckMsRUFBK0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQS9FLEVBSjZEO0lBQUEsQ0FBL0QsRUFQMkI7RUFBQSxDQUE3QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/delete-branch-view-spec.coffee
