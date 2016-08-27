(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }).then(function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsa0NBQVIsQ0FEbkIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxHQUFBO1dBQ2YsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0I7QUFBQSxNQUFBLGFBQUEsRUFBZSxJQUFmO0tBQXhCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7YUFBYyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQWQ7SUFBQSxDQUROLEVBRGU7RUFBQSxDQUhqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-stage-files.coffee
