(function() {
  var GitLog, LogListView, git, logFileURI, pathToRepoFile, repo, view, _ref;

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  GitLog = require('../../lib/models/git-log');

  LogListView = require('../../lib/views/log-list-view');

  view = new LogListView;

  logFileURI = 'atom://git-plus:log';

  describe("GitLog", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(view));
      spyOn(atom.workspace, 'addOpener');
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn({
        getPath: function() {
          return pathToRepoFile;
        }
      });
      spyOn(view, 'branchLog');
      return waitsForPromise(function() {
        return GitLog(repo);
      });
    });
    it("adds a custom opener for the log file URI", function() {
      return expect(atom.workspace.addOpener).toHaveBeenCalled();
    });
    it("opens the log file URI", function() {
      return expect(atom.workspace.open).toHaveBeenCalledWith(logFileURI);
    });
    it("calls branchLog on the view", function() {
      return expect(view.branchLog).toHaveBeenCalledWith(repo);
    });
    return describe("when 'onlyCurrentFile' option is true", function() {
      return it("calls currentFileLog on the view", function() {
        spyOn(view, 'currentFileLog');
        waitsForPromise(function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
        return runs(function() {
          return expect(view.currentFileLog).toHaveBeenCalledWith(repo, repo.relativize(pathToRepoFile));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1sb2ctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQURQLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLDBCQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVIsQ0FIZCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLEdBQUEsQ0FBQSxXQUxQLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEscUJBTmIsQ0FBQTs7QUFBQSxFQVFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixNQUF0QixDQUE2QixDQUFDLFNBQTlCLENBQXdDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLENBQXhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLFdBQXRCLENBREEsQ0FBQTtBQUFBLE1BRUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLHFCQUF0QixDQUE0QyxDQUFDLFNBQTdDLENBQXVEO0FBQUEsUUFBRSxPQUFBLEVBQVMsU0FBQSxHQUFBO2lCQUFHLGVBQUg7UUFBQSxDQUFYO09BQXZELENBRkEsQ0FBQTtBQUFBLE1BR0EsS0FBQSxDQUFNLElBQU4sRUFBWSxXQUFaLENBSEEsQ0FBQTthQUlBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsTUFBQSxDQUFPLElBQVAsRUFBSDtNQUFBLENBQWhCLEVBTFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBT0EsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTthQUM5QyxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUF0QixDQUFnQyxDQUFDLGdCQUFqQyxDQUFBLEVBRDhDO0lBQUEsQ0FBaEQsQ0FQQSxDQUFBO0FBQUEsSUFVQSxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO2FBQzNCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELFVBQWpELEVBRDJCO0lBQUEsQ0FBN0IsQ0FWQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO2FBQ2hDLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBWixDQUFzQixDQUFDLG9CQUF2QixDQUE0QyxJQUE1QyxFQURnQztJQUFBLENBQWxDLENBYkEsQ0FBQTtXQWdCQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO2FBQ2hELEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsUUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLGdCQUFaLENBQUEsQ0FBQTtBQUFBLFFBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQUcsTUFBQSxDQUFPLElBQVAsRUFBYTtBQUFBLFlBQUEsZUFBQSxFQUFpQixJQUFqQjtXQUFiLEVBQUg7UUFBQSxDQUFoQixDQURBLENBQUE7ZUFFQSxJQUFBLENBQUssU0FBQSxHQUFBO2lCQUNILE1BQUEsQ0FBTyxJQUFJLENBQUMsY0FBWixDQUEyQixDQUFDLG9CQUE1QixDQUFpRCxJQUFqRCxFQUF1RCxJQUFJLENBQUMsVUFBTCxDQUFnQixjQUFoQixDQUF2RCxFQURHO1FBQUEsQ0FBTCxFQUhxQztNQUFBLENBQXZDLEVBRGdEO0lBQUEsQ0FBbEQsRUFqQmlCO0VBQUEsQ0FBbkIsQ0FSQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-log-spec.coffee
