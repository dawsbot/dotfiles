(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo, _arg) {
    var args, cwd, message;
    message = (_arg != null ? _arg : {}).message;
    cwd = repo.getWorkingDirectory();
    args = ['stash', 'save'];
    if (message) {
      args.push(message);
    }
    return git.cmd(args, {
      cwd: cwd
    }).then(function(msg) {
      if (msg !== '') {
        return OutputViewManager.create().addLine(msg).finish();
      }
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FGcEIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsa0JBQUE7QUFBQSxJQUR1QiwwQkFBRCxPQUFVLElBQVQsT0FDdkIsQ0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQU4sQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FEUCxDQUFBO0FBRUEsSUFBQSxJQUFzQixPQUF0QjtBQUFBLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQUEsQ0FBQTtLQUZBO1dBR0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxNQUFDLEtBQUEsR0FBRDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxHQUFELEdBQUE7QUFDSixNQUFBLElBQW9ELEdBQUEsS0FBUyxFQUE3RDtlQUFBLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxHQUFuQyxDQUF1QyxDQUFDLE1BQXhDLENBQUEsRUFBQTtPQURJO0lBQUEsQ0FETixDQUdBLENBQUMsT0FBRCxDQUhBLENBR08sU0FBQyxHQUFELEdBQUE7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURLO0lBQUEsQ0FIUCxFQUplO0VBQUEsQ0FKakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-stash-save.coffee
