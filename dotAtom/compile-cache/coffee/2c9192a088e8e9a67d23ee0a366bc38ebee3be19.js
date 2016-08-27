(function() {
  var RebaseListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RebaseListView = require('../../lib/views/rebase-list-view');

  describe("RebaseListView", function() {
    beforeEach(function() {
      this.view = new RebaseListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("rebases onto the selected branch", function() {
      this.view.confirmSelection();
      this.view.rebase('branch1');
      return expect(git.cmd).toHaveBeenCalledWith(['rebase', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmViYXNlLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsa0JBQXJCLENBQVosQ0FBQTthQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUEsR0FBQTtlQUM1QixPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFENEI7TUFBQSxDQUE5QixFQUZTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUtBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEZ0M7SUFBQSxDQUFsQyxDQUxBLENBQUE7V0FRQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLE1BQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBYixDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxTQUFYLENBQXJDLEVBQTREO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUE1RCxFQUhxQztJQUFBLENBQXZDLEVBVHlCO0VBQUEsQ0FBM0IsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/rebase-list-view-spec.coffee
