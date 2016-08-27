(function() {
  var GitAdd, git, pathToRepoFile, repo, _ref;

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  git = require('../../lib/git');

  GitAdd = require('../../lib/models/git-add');

  describe("GitAdd", function() {
    it("calls git.add with the current file if `addAll` is false", function() {
      spyOn(git, 'add');
      spyOn(atom.workspace, 'getActiveTextEditor').andCallFake(function() {
        return {
          getPath: function() {
            return pathToRepoFile;
          }
        };
      });
      GitAdd(repo);
      return expect(git.add).toHaveBeenCalledWith(repo, {
        file: repo.relativize(pathToRepoFile)
      });
    });
    return it("calls git.add without a file option if `addAll` is true", function() {
      spyOn(git, 'add');
      GitAdd(repo, {
        addAll: true
      });
      return expect(git.add).toHaveBeenCalledWith(repo);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1hZGQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLDBCQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixJQUFBLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBQSxDQUFBO0FBQUEsTUFDQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IscUJBQXRCLENBQTRDLENBQUMsV0FBN0MsQ0FBeUQsU0FBQSxHQUFBO2VBQ3ZEO0FBQUEsVUFBQSxPQUFBLEVBQVMsU0FBQSxHQUFBO21CQUFHLGVBQUg7VUFBQSxDQUFUO1VBRHVEO01BQUEsQ0FBekQsQ0FEQSxDQUFBO0FBQUEsTUFHQSxNQUFBLENBQU8sSUFBUCxDQUhBLENBQUE7YUFJQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxJQUFyQyxFQUEyQztBQUFBLFFBQUEsSUFBQSxFQUFNLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQU47T0FBM0MsRUFMNkQ7SUFBQSxDQUEvRCxDQUFBLENBQUE7V0FPQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLElBQVAsRUFBYTtBQUFBLFFBQUEsTUFBQSxFQUFRLElBQVI7T0FBYixDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxJQUFyQyxFQUg0RDtJQUFBLENBQTlELEVBUmlCO0VBQUEsQ0FBbkIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-add-spec.coffee
