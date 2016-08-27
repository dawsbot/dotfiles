(function() {
  var GitRemove, currentPane, git, pathToRepoFile, repo, textEditor, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, currentPane = _ref.currentPane;

  GitRemove = require('../../lib/models/git-remove');

  describe("GitRemove", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'getActivePaneItem').andReturn(currentPane);
      return spyOn(git, 'cmd').andReturn(Promise.resolve(repo.relativize(pathToRepoFile)));
    });
    describe("when the file has been modified and user confirms", function() {
      beforeEach(function() {
        spyOn(window, 'confirm').andReturn(true);
        return spyOn(repo, 'isPathModified').andReturn(true);
      });
      describe("when there is a current file open", function() {
        return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
          var args, _ref1;
          GitRemove(repo);
          args = git.cmd.mostRecentCall.args[0];
          expect(__indexOf.call(args, 'rm') >= 0).toBe(true);
          return expect((_ref1 = repo.relativize(pathToRepoFile), __indexOf.call(args, _ref1) >= 0)).toBe(true);
        });
      });
      return describe("when 'showSelector' is set to true", function() {
        return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
          var args;
          GitRemove(repo, {
            showSelector: true
          });
          args = git.cmd.mostRecentCall.args[0];
          return expect(__indexOf.call(args, '*') >= 0).toBe(true);
        });
      });
    });
    return describe("when the file has not been modified and user doesn't need to confirm", function() {
      beforeEach(function() {
        spyOn(window, 'confirm').andReturn(false);
        return spyOn(repo, 'isPathModified').andReturn(false);
      });
      describe("when there is a current file open", function() {
        return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
          var args, _ref1;
          GitRemove(repo);
          args = git.cmd.mostRecentCall.args[0];
          expect(__indexOf.call(args, 'rm') >= 0).toBe(true);
          expect((_ref1 = repo.relativize(pathToRepoFile), __indexOf.call(args, _ref1) >= 0)).toBe(true);
          return expect(window.confirm).not.toHaveBeenCalled();
        });
      });
      return describe("when 'showSelector' is set to true", function() {
        return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
          var args;
          GitRemove(repo, {
            showSelector: true
          });
          args = git.cmd.mostRecentCall.args[0];
          return expect(__indexOf.call(args, '*') >= 0).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1yZW1vdmUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUVBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxPQUFrRCxPQUFBLENBQVEsYUFBUixDQUFsRCxFQUFDLFlBQUEsSUFBRCxFQUFPLHNCQUFBLGNBQVAsRUFBdUIsa0JBQUEsVUFBdkIsRUFBbUMsbUJBQUEsV0FEbkMsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsNkJBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLHFCQUF0QixDQUE0QyxDQUFDLFNBQTdDLENBQXVELFVBQXZELENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLG1CQUF0QixDQUEwQyxDQUFDLFNBQTNDLENBQXFELFdBQXJELENBREEsQ0FBQTthQUVBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQWhCLENBQTVCLEVBSFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBS0EsUUFBQSxDQUFTLG1EQUFULEVBQThELFNBQUEsR0FBQTtBQUM1RCxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEtBQUEsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-remove-spec.coffee
