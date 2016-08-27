(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteListView(repo, data, {
        mode: 'push'
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXB1c2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSLENBRGpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsR0FBQTtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXBCLENBQW9ELENBQUMsSUFBckQsQ0FBMEQsU0FBQyxJQUFELEdBQUE7YUFDcEQsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU47T0FBM0IsRUFEb0Q7SUFBQSxDQUExRCxFQURlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-push.coffee
