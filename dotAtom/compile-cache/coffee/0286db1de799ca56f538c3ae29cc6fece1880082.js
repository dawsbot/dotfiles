(function() {
  var MergeListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  MergeListView = require('../../lib/views/merge-list-view');

  describe("MergeListView", function() {
    beforeEach(function() {
      this.view = new MergeListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd with 'merge branch1' when branch1 is selected", function() {
      this.view.confirmSelection();
      waitsFor(function() {
        return git.cmd.callCount > 0;
      });
      return expect(git.cmd).toHaveBeenCalledWith(['merge', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvbWVyZ2UtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxpQ0FBUixDQUZoQixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLGtCQUFwQixDQUFaLENBQUE7YUFDQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBLEdBQUE7ZUFBRyxPQUFPLENBQUMsT0FBUixDQUFnQixFQUFoQixFQUFIO01BQUEsQ0FBOUIsRUFGUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFJQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO2FBQ2hDLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDLEVBRGdDO0lBQUEsQ0FBbEMsQ0FKQSxDQUFBO1dBT0EsRUFBQSxDQUFHLDZEQUFILEVBQWtFLFNBQUEsR0FBQTtBQUNoRSxNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsZ0JBQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVIsR0FBb0IsRUFBdkI7TUFBQSxDQUFULENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FBckMsRUFBMkQ7QUFBQSxRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQTNELEVBSGdFO0lBQUEsQ0FBbEUsRUFSd0I7RUFBQSxDQUExQixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/merge-list-view-spec.coffee
