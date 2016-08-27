(function() {
  var git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  module.exports = function(repo) {
    var currentFile, _ref;
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return git.cmd(['checkout', '--', currentFile], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      notifier.addSuccess('File changes checked out successfully');
      return git.refresh();
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNoZWNrb3V0LWN1cnJlbnQtZmlsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsYUFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEdBQUE7QUFDZixRQUFBLGlCQUFBO0FBQUEsSUFBQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQUFkLENBQUE7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsV0FBbkIsQ0FBUixFQUF5QztBQUFBLE1BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBekMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtBQUNKLE1BQUEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsdUNBQXBCLENBQUEsQ0FBQTthQUNBLEdBQUcsQ0FBQyxPQUFKLENBQUEsRUFGSTtJQUFBLENBRE4sRUFGZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-checkout-current-file.coffee
