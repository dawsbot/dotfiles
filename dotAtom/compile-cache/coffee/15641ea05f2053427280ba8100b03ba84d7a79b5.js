(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, _arg) {
    var currentFile, cwd, showSelector, _ref;
    showSelector = (_arg != null ? _arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return notifier.addSuccess("Removed " + (prettify(data)));
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, _i, _len, _results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
        file = data[i];
        _results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return _results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXJlbW92ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO0FBQ1YsUUFBQSxvQ0FBQTtBQUFBLElBRGtCLCtCQUFELE9BQWUsSUFBZCxZQUNsQixDQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTixDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQixDQURkLENBQUE7QUFFQSxJQUFBLElBQUcscUJBQUEsSUFBaUIsQ0FBQSxZQUFwQjtBQUNFLE1BQUEsSUFBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixXQUFwQixDQUFBLEtBQW9DLEtBQXBDLElBQTZDLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFoRDtBQUNFLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBZixDQUFBLENBQWtDLENBQUMsT0FBbkMsQ0FBQSxDQUFBLENBQUE7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxrQkFBYixFQUFpQyxXQUFqQyxDQUFSLEVBQXVEO0FBQUEsVUFBQyxLQUFBLEdBQUQ7U0FBdkQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtpQkFBVSxRQUFRLENBQUMsVUFBVCxDQUFxQixVQUFBLEdBQVMsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQTlCLEVBQVY7UUFBQSxDQUROLEVBRkY7T0FERjtLQUFBLE1BQUE7YUFNRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLGtCQUFuQixFQUF1QyxJQUF2QyxFQUE2QyxHQUE3QyxDQUFSLEVBQTJEO0FBQUEsUUFBQyxLQUFBLEdBQUQ7T0FBM0QsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTtlQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsUUFBQSxDQUFTLElBQVQsQ0FBckIsRUFBZDtNQUFBLENBRE4sRUFORjtLQUhVO0VBQUEsQ0FKWixDQUFBOztBQUFBLEVBZ0JBLFFBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFFBQUEsMkJBQUE7QUFBQSxJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVgsQ0FBUCxDQUFBO0FBQ0EsSUFBQSxJQUFHLElBQUg7QUFDRTtXQUFBLG1EQUFBO3VCQUFBO0FBQ0Usc0JBQUEsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxDQUF3QixDQUFBLENBQUEsRUFBbEMsQ0FERjtBQUFBO3NCQURGO0tBQUEsTUFBQTthQUlFLEtBSkY7S0FGUztFQUFBLENBaEJYLENBQUE7O0FBQUEsRUF3QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0F4QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-remove.coffee
