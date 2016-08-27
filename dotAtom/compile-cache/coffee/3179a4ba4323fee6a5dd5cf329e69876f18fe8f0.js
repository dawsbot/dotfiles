(function() {
  var GitOpenChangedFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitOpenChangedFiles = require('../../lib/models/git-open-changed-files');

  describe("GitOpenChangedFiles", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'open');
    });
    describe("when file is modified", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve([' M file1.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens changed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file1.txt");
      });
    });
    describe("when file is added", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['?? file2.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens added file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file2.txt");
      });
    });
    return describe("when file is renamed", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['R  file3.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens renamed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file3.txt");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1vcGVuLWNoYW5nZWQtZmlsZXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5Q0FBUixDQUZ0QixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUEsR0FBQTtBQUM5QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsTUFBdEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFHQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxRQUFYLENBQW9CLENBQUMsU0FBckIsQ0FBK0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxjQUFELENBQWhCLENBQS9CLENBQUEsQ0FBQTtlQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLG1CQUFBLENBQW9CLElBQXBCLEVBQUg7UUFBQSxDQUFoQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO2VBQ3ZCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELFdBQWpELEVBRHVCO01BQUEsQ0FBekIsRUFMZ0M7SUFBQSxDQUFsQyxDQUhBLENBQUE7QUFBQSxJQVdBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsQ0FBQyxTQUFyQixDQUErQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFDLGNBQUQsQ0FBaEIsQ0FBL0IsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBSDtRQUFBLENBQWhCLEVBRlM7TUFBQSxDQUFYLENBQUEsQ0FBQTthQUlBLEVBQUEsQ0FBRyxrQkFBSCxFQUF1QixTQUFBLEdBQUE7ZUFDckIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsV0FBakQsRUFEcUI7TUFBQSxDQUF2QixFQUw2QjtJQUFBLENBQS9CLENBWEEsQ0FBQTtXQW1CQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxRQUFYLENBQW9CLENBQUMsU0FBckIsQ0FBK0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxjQUFELENBQWhCLENBQS9CLENBQUEsQ0FBQTtlQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUFHLG1CQUFBLENBQW9CLElBQXBCLEVBQUg7UUFBQSxDQUFoQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO2VBQ3ZCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELFdBQWpELEVBRHVCO01BQUEsQ0FBekIsRUFMK0I7SUFBQSxDQUFqQyxFQXBCOEI7RUFBQSxDQUFoQyxDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-open-changed-files-spec.coffee
