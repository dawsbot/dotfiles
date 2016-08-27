(function() {
  var LogListView, LogViewURI, git;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  LogViewURI = 'atom://git-plus:log';

  module.exports = function(repo, _arg) {
    var currentFile, onlyCurrentFile, _ref;
    onlyCurrentFile = (_arg != null ? _arg : {}).onlyCurrentFile;
    atom.workspace.addOpener(function(uri) {
      if (uri === LogViewURI) {
        return new LogListView;
      }
    });
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    return atom.workspace.open(LogViewURI).then(function(view) {
      if (onlyCurrentFile) {
        return view.currentFileLog(repo, currentFile);
      } else {
        return view.branchLog(repo);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEscUJBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVAsR0FBQTtBQUNmLFFBQUEsa0NBQUE7QUFBQSxJQUR1QixrQ0FBRCxPQUFrQixJQUFqQixlQUN2QixDQUFBO0FBQUEsSUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQWYsQ0FBeUIsU0FBQyxHQUFELEdBQUE7QUFDdkIsTUFBQSxJQUEwQixHQUFBLEtBQU8sVUFBakM7QUFBQSxlQUFPLEdBQUEsQ0FBQSxXQUFQLENBQUE7T0FEdUI7SUFBQSxDQUF6QixDQUFBLENBQUE7QUFBQSxJQUdBLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCw2REFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCLENBSGQsQ0FBQTtXQUlBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLFNBQUMsSUFBRCxHQUFBO0FBQ25DLE1BQUEsSUFBRyxlQUFIO2VBQ0UsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsSUFBcEIsRUFBMEIsV0FBMUIsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsRUFIRjtPQURtQztJQUFBLENBQXJDLEVBTGU7RUFBQSxDQUpqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-log.coffee
