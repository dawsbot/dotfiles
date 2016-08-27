(function() {
  var PullBranchListView, git, options, repo;

  git = require('../../lib/git');

  PullBranchListView = require('../../lib/views/pull-branch-list-view');

  repo = require('../fixtures').repo;

  options = {
    cwd: repo.getWorkingDirectory()
  };

  describe("PullBranchListView", function() {
    beforeEach(function() {
      this.view = new PullBranchListView(repo, "branch1\nbranch2", "remote", '');
      return spyOn(git, 'cmd').andReturn(Promise.resolve('pulled'));
    });
    it("displays a list of branches and the first option is a special one for the current branch", function() {
      expect(this.view.items.length).toBe(3);
      return expect(this.view.items[0].name).toEqual('== Current ==');
    });
    it("has a property called result which is a promise", function() {
      expect(this.view.result).toBeDefined();
      expect(this.view.result.then).toBeDefined();
      return expect(this.view.result["catch"]).toBeDefined();
    });
    describe("when the special option is selected", function() {
      return it("calls git.cmd with ['pull'] and remote name", function() {
        this.view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['pull', 'remote'], options);
        });
      });
    });
    describe("when a branch option is selected", function() {
      return it("calls git.cmd with ['pull'], the remote name, and branch name", function() {
        this.view.selectNextItemView();
        this.view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['pull', 'remote', 'branch1'], options);
        });
      });
    });
    return describe("when '--rebase' is passed as extraArgs", function() {
      return it("calls git.cmd with ['pull', '--rebase'], the remote name", function() {
        var view;
        view = new PullBranchListView(repo, "branch1\nbranch2", "remote", '--rebase');
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['pull', '--rebase', 'remote'], options);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcHVsbC1icmFuY2gtbGlzdC12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1Q0FBUixDQURyQixDQUFBOztBQUFBLEVBRUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBRkQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVTtBQUFBLElBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7R0FIVixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxrQkFBQSxDQUFtQixJQUFuQixFQUF5QixrQkFBekIsRUFBNkMsUUFBN0MsRUFBdUQsRUFBdkQsQ0FBWixDQUFBO2FBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsUUFBaEIsQ0FBNUIsRUFGUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFJQSxFQUFBLENBQUcsMEZBQUgsRUFBK0YsU0FBQSxHQUFBO0FBQzdGLE1BQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/pull-branch-list-view-spec.coffee
