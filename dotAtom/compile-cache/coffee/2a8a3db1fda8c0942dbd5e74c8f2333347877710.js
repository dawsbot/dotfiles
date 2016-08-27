(function() {
  var git;

  git = require('../git');

  module.exports = function(repo, _arg) {
    var addAll, file, _ref;
    addAll = (_arg != null ? _arg : {}).addAll;
    if (addAll) {
      return git.add(repo);
    } else {
      file = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
      return git.add(repo, {
        file: file
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWFkZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsR0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQLEdBQUE7QUFDZixRQUFBLGtCQUFBO0FBQUEsSUFEdUIseUJBQUQsT0FBUyxJQUFSLE1BQ3ZCLENBQUE7QUFBQSxJQUFBLElBQUcsTUFBSDthQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQURGO0tBQUEsTUFBQTtBQUdFLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLDZEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEIsQ0FBUCxDQUFBO2FBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO09BQWQsRUFKRjtLQURlO0VBQUEsQ0FGakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-add.coffee
