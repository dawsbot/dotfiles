(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo, _arg) {
    var args, remote;
    remote = (_arg != null ? _arg : {}).remote;
    args = ['branch'];
    if (remote) {
      args.push('-r');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new MergeListView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LW1lcmdlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ2YsUUFBQSxZQUFBO0FBQUEsSUFEdUIseUJBQUQsT0FBUyxJQUFSLE1BQ3ZCLENBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxDQUFDLFFBQUQsQ0FBUCxDQUFBO0FBQ0EsSUFBQSxJQUFrQixNQUFsQjtBQUFBLE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLENBQUEsQ0FBQTtLQURBO1dBRUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTthQUFjLElBQUEsYUFBQSxDQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBZDtJQUFBLENBRE4sRUFIZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-merge.coffee
