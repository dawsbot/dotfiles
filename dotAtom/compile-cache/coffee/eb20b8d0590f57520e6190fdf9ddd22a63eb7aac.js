(function() {
  var GitShow, Os, Path, fs, git, pathToRepoFile, repo, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  Path = require('flavored-path');

  Os = require('os');

  git = require('../../lib/git');

  _ref = require('../fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile;

  GitShow = require('../../lib/models/git-show');

  describe("GitShow", function() {
    beforeEach(function() {
      return spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
    });
    it("calls git.cmd with 'show' and " + pathToRepoFile, function() {
      var args;
      GitShow(repo, 'foobar-hash', pathToRepoFile);
      args = git.cmd.mostRecentCall.args[0];
      expect(__indexOf.call(args, 'show') >= 0).toBe(true);
      return expect(__indexOf.call(args, pathToRepoFile) >= 0).toBe(true);
    });
    it("writes the output to a file", function() {
      var outputFile;
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      outputFile = Path.join(Os.tmpDir(), "foobar-hash.diff");
      waitsForPromise(function() {
        return GitShow(repo, 'foobar-hash', pathToRepoFile);
      });
      return runs(function() {
        var args;
        args = fs.writeFile.mostRecentCall.args;
        expect(args[0]).toBe(outputFile);
        return expect(args[1]).toBe('foobar');
      });
    });
    return describe("When a hash is not specified", function() {
      return it("returns a view for entering a hash", function() {
        var view;
        view = GitShow(repo);
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zaG93LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsT0FBeUIsT0FBQSxDQUFRLGFBQVIsQ0FBekIsRUFBQyxZQUFBLElBQUQsRUFBTyxzQkFBQSxjQUpQLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLDJCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixRQUFoQixDQUE1QixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLEVBQUEsQ0FBSSxnQ0FBQSxHQUFnQyxjQUFwQyxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsVUFBQSxJQUFBO0FBQUEsTUFBQSxPQUFBLENBQVEsSUFBUixFQUFjLGFBQWQsRUFBNkIsY0FBN0IsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FEbkMsQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLGVBQVUsSUFBVixFQUFBLE1BQUEsTUFBUCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQTVCLENBRkEsQ0FBQTthQUdBLE1BQUEsQ0FBTyxlQUFrQixJQUFsQixFQUFBLGNBQUEsTUFBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLElBQXBDLEVBSm9EO0lBQUEsQ0FBdEQsQ0FIQSxDQUFBO0FBQUEsSUFTQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFVBQUEsVUFBQTtBQUFBLE1BQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxXQUFWLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsU0FBQSxHQUFBO2VBQ2pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQWpDLENBQUEsRUFEaUM7TUFBQSxDQUFuQyxDQUFBLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1QixrQkFBdkIsQ0FGYixDQUFBO0FBQUEsTUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQUEsQ0FBUSxJQUFSLEVBQWMsYUFBZCxFQUE2QixjQUE3QixFQURjO01BQUEsQ0FBaEIsQ0FIQSxDQUFBO2FBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQW5DLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxJQUFLLENBQUEsQ0FBQSxDQUFaLENBQWUsQ0FBQyxJQUFoQixDQUFxQixVQUFyQixDQURBLENBQUE7ZUFFQSxNQUFBLENBQU8sSUFBSyxDQUFBLENBQUEsQ0FBWixDQUFlLENBQUMsSUFBaEIsQ0FBcUIsUUFBckIsRUFIRztNQUFBLENBQUwsRUFOZ0M7SUFBQSxDQUFsQyxDQVRBLENBQUE7V0FvQkEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTthQUN2QyxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxJQUFSLENBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxXQUFiLENBQUEsRUFGdUM7TUFBQSxDQUF6QyxFQUR1QztJQUFBLENBQXpDLEVBckJrQjtFQUFBLENBQXBCLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-show-spec.coffee
