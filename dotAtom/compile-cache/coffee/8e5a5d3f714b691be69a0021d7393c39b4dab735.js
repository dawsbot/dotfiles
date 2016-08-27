(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, _arg) {
    var extraArgs, rebase;
    rebase = (_arg != null ? _arg : {}).rebase;
    if (rebase) {
      extraArgs = ['--rebase'];
    }
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteListView(repo, data, {
        mode: 'pull',
        extraArgs: extraArgs
      }).result;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXB1bGwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSLENBRGpCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDZixRQUFBLGlCQUFBO0FBQUEsSUFEdUIseUJBQUQsT0FBUyxJQUFSLE1BQ3ZCLENBQUE7QUFBQSxJQUFBLElBQTRCLE1BQTVCO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBQyxVQUFELENBQVosQ0FBQTtLQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsQ0FBUixFQUFvQjtBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBcEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTthQUFVLEdBQUEsQ0FBQSxjQUFJLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxRQUFjLFNBQUEsRUFBVyxTQUF6QjtPQUEzQixDQUE4RCxDQUFDLE9BQTdFO0lBQUEsQ0FETixFQUZlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-pull.coffee
