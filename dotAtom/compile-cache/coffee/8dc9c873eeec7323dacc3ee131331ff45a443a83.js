(function() {
  var BranchListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  BranchListView = require('../../lib/views/branch-list-view');

  describe("BranchListView", function() {
    beforeEach(function() {
      this.view = new BranchListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("checkouts the selected branch", function() {
      this.view.confirmSelection();
      this.view.checkout('branch1');
      waitsFor(function() {
        return git.cmd.callCount > 0;
      });
      return runs(function() {
        return expect(git.cmd).toHaveBeenCalledWith(['checkout', 'branch1'], {
          cwd: repo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvYnJhbmNoLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsa0JBQXJCLENBQVosQ0FBQTthQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtlQUM1QixPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFENEI7TUFBQSxDQUE5QixFQUZTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUtBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEZ0M7SUFBQSxDQUFsQyxDQUxBLENBQUE7V0FRQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWUsU0FBZixDQURBLENBQUE7QUFBQSxNQUVBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVIsR0FBb0IsRUFBdkI7TUFBQSxDQUFULENBRkEsQ0FBQTthQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFVBQUQsRUFBYSxTQUFiLENBQXJDLEVBQThEO0FBQUEsVUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUE5RCxFQURHO01BQUEsQ0FBTCxFQUprQztJQUFBLENBQXBDLEVBVHlCO0VBQUEsQ0FBM0IsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/branch-list-view-spec.coffee
