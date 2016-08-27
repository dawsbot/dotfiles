(function() {
  var SelectUnstageFiles, git;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  module.exports = function(repo) {
    return git.stagedFiles(repo).then(function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXVuc3RhZ2UtZmlsZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxvQ0FBUixDQURyQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxrQkFBQSxDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUFkO0lBQUEsQ0FBM0IsRUFEZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-unstage-files.coffee
