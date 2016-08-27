(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function(repo) {
    return git.unstagedFiles(repo).then(function(data) {
      return new SelectStageHunkFile(repo, data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWh1bmsuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSxzQ0FBUixDQUR0QixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLFNBQUMsSUFBRCxHQUFBO1dBQ2IsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTthQUFjLElBQUEsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBMEIsSUFBMUIsRUFBZDtJQUFBLENBRE4sRUFEYTtFQUFBLENBSGYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFlBUGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-stage-hunk.coffee
