(function() {
  var GitStashApply, GitStashDrop, GitStashPop, GitStashSave, git, options, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitStashApply = require('../../lib/models/git-stash-apply');

  GitStashSave = require('../../lib/models/git-stash-save');

  GitStashPop = require('../../lib/models/git-stash-pop');

  GitStashDrop = require('../../lib/models/git-stash-drop');

  options = {
    cwd: repo.getWorkingDirectory()
  };

  describe("Git Stash commands", function() {
    describe("Apply", function() {
      return it("calls git.cmd with 'stash' and 'apply'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(true));
        GitStashApply(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['stash', 'apply'], options);
      });
    });
    describe("Save", function() {
      return it("calls git.cmd with 'stash' and 'save'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(true));
        GitStashSave(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['stash', 'save'], options);
      });
    });
    describe("Pop", function() {
      return it("calls git.cmd with 'stash' and 'pop'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(true));
        GitStashPop(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['stash', 'pop'], options);
      });
    });
    return describe("Drop", function() {
      return it("calls git.cmd with 'stash' and 'drop'", function() {
        spyOn(git, 'cmd').andReturn(Promise.resolve(true));
        GitStashDrop(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['stash', 'drop'], options);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGFzaC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRUFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FETixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0NBQVIsQ0FGaEIsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUNBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQ0FBUixDQUpkLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlDQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU9BLE9BQUEsR0FDRTtBQUFBLElBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7R0FSRixDQUFBOztBQUFBLEVBVUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixJQUFBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTthQUNoQixFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxhQUFBLENBQWMsSUFBZCxDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE9BQUQsRUFBVSxPQUFWLENBQXJDLEVBQXlELE9BQXpELEVBSDJDO01BQUEsQ0FBN0MsRUFEZ0I7SUFBQSxDQUFsQixDQUFBLENBQUE7QUFBQSxJQU1BLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTthQUNmLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUE1QixDQUFBLENBQUE7QUFBQSxRQUNBLFlBQUEsQ0FBYSxJQUFiLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBckMsRUFBd0QsT0FBeEQsRUFIMEM7TUFBQSxDQUE1QyxFQURlO0lBQUEsQ0FBakIsQ0FOQSxDQUFBO0FBQUEsSUFZQSxRQUFBLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7YUFDZCxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxXQUFBLENBQVksSUFBWixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE9BQUQsRUFBVSxLQUFWLENBQXJDLEVBQXVELE9BQXZELEVBSHlDO01BQUEsQ0FBM0MsRUFEYztJQUFBLENBQWhCLENBWkEsQ0FBQTtXQWtCQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7YUFDZixFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxZQUFBLENBQWEsSUFBYixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQXJDLEVBQXdELE9BQXhELEVBSDBDO01BQUEsQ0FBNUMsRUFEZTtJQUFBLENBQWpCLEVBbkI2QjtFQUFBLENBQS9CLENBVkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-stash-spec.coffee
