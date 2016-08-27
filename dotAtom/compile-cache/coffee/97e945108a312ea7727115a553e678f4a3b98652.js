(function() {
  var DeleteBranchView, git;

  git = require('../git');

  DeleteBranchView = require('../views/delete-branch-view');

  module.exports = function(repo) {
    return git.cmd(['branch'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new DeleteBranchView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRlbGV0ZS1sb2NhbC1icmFuY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw2QkFBUixDQURuQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFwQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRCxHQUFBO2FBQWMsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixJQUF2QixFQUFkO0lBQUEsQ0FETixFQURlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-delete-local-branch.coffee
