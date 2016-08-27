(function() {
  var SelectStageFiles, SelectUnStageFiles, git, pathToRepoFile, repo, _ref;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  SelectStageFiles = require('../../lib/views/select-stage-files-view');

  SelectUnStageFiles = require('../../lib/views/select-unstage-files-view');

  describe("SelectStageFiles", function() {
    return it("stages the selected files", function() {
      var fileItem, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectStageFiles(repo, [fileItem]);
      view.confirmSelection();
      view.find('.btn-stage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['add', '-f', pathToRepoFile], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

  describe("SelectUnStageFiles", function() {
    return it("unstages the selected files", function() {
      var fileItem, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectUnStageFiles(repo, [fileItem]);
      view.confirmSelection();
      view.find('.btn-unstage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD', '--', pathToRepoFile], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3Mvc2VsZWN0LXN0YWdlLWZpbGVzLXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUVBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQURQLENBQUE7O0FBQUEsRUFFQSxnQkFBQSxHQUFtQixPQUFBLENBQVEseUNBQVIsQ0FGbkIsQ0FBQTs7QUFBQSxFQUdBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSwyQ0FBUixDQUhyQixDQUFBOztBQUFBLEVBS0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtXQUMzQixFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFVBQUEsY0FBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxjQUFOO09BRkYsQ0FBQTtBQUFBLE1BR0EsSUFBQSxHQUFXLElBQUEsZ0JBQUEsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBQyxRQUFELENBQXZCLENBSFgsQ0FBQTtBQUFBLE1BSUEsSUFBSSxDQUFDLGdCQUFMLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsSUFBTCxDQUFVLG1CQUFWLENBQThCLENBQUMsS0FBL0IsQ0FBQSxDQUxBLENBQUE7YUFNQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWMsY0FBZCxDQUFyQyxFQUFvRTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBcEUsRUFQOEI7SUFBQSxDQUFoQyxFQUQyQjtFQUFBLENBQTdCLENBTEEsQ0FBQTs7QUFBQSxFQWVBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7V0FDN0IsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxVQUFBLGNBQUE7QUFBQSxNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQTVCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sY0FBTjtPQUZGLENBQUE7QUFBQSxNQUdBLElBQUEsR0FBVyxJQUFBLGtCQUFBLENBQW1CLElBQW5CLEVBQXlCLENBQUMsUUFBRCxDQUF6QixDQUhYLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxxQkFBVixDQUFnQyxDQUFDLEtBQWpDLENBQUEsQ0FMQSxDQUFBO2FBTUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxPQUFELEVBQVUsTUFBVixFQUFrQixJQUFsQixFQUF3QixjQUF4QixDQUFyQyxFQUE4RTtBQUFBLFFBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBOUUsRUFQZ0M7SUFBQSxDQUFsQyxFQUQ2QjtFQUFBLENBQS9CLENBZkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/select-stage-files-view-spec.coffee
