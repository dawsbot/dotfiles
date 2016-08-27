(function() {
  var ProjectsListView, git, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  init = function(path) {
    return git.cmd(['init'], {
      cwd: path
    }).then(function(data) {
      notifier.addSuccess(data);
      return atom.project.setPaths(atom.project.getPaths());
    });
  };

  module.exports = function() {
    var currentFile, _ref;
    currentFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWluaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw2QkFBUixDQURuQixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLElBQUEsR0FBTyxTQUFDLElBQUQsR0FBQTtXQUNMLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxNQUFELENBQVIsRUFBa0I7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFMO0tBQWxCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7QUFDSixNQUFBLFFBQVEsQ0FBQyxVQUFULENBQW9CLElBQXBCLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF0QixFQUZJO0lBQUEsQ0FETixFQURLO0VBQUEsQ0FKUCxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsUUFBQSxpQkFBQTtBQUFBLElBQUEsV0FBQSwrREFBa0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWQsQ0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLFdBQUEsSUFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBdUIsQ0FBQyxNQUF4QixHQUFpQyxDQUF4RDthQUNNLElBQUEsZ0JBQUEsQ0FBQSxDQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUExQixDQUErQixTQUFDLElBQUQsR0FBQTtlQUFVLElBQUEsQ0FBSyxJQUFMLEVBQVY7TUFBQSxDQUEvQixFQUROO0tBQUEsTUFBQTthQUdFLElBQUEsQ0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBN0IsRUFIRjtLQUZlO0VBQUEsQ0FWakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-init.coffee
