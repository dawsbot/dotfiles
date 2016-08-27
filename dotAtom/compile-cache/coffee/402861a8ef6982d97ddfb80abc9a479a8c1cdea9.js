(function() {
  var ListView, git;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  module.exports = function(repo) {
    return git.cmd(['branch', '-r'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new ListView(repo, data, {
        isRemote: true
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRlbGV0ZS1yZW1vdGUtYnJhbmNoLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxhQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLElBQVgsQ0FBUixFQUEwQjtBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBMUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTthQUFjLElBQUEsUUFBQSxDQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0FBQUEsUUFBQSxRQUFBLEVBQVUsSUFBVjtPQUFyQixFQUFkO0lBQUEsQ0FETixFQURlO0VBQUEsQ0FIakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-delete-remote-branch.coffee
