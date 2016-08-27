(function() {
  var GitStatus, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitStatus = require('../../lib/models/git-status');

  describe("GitStatus", function() {
    beforeEach(function() {
      return spyOn(git, 'status').andReturn(Promise.resolve('foobar'));
    });
    it("calls git.status", function() {
      GitStatus(repo);
      return expect(git.status).toHaveBeenCalledWith(repo);
    });
    return it("creates a new StatusListView", function() {
      return GitStatus(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGF0dXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0JBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsNkJBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsUUFBWCxDQUFvQixDQUFDLFNBQXJCLENBQStCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQS9CLEVBRFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLFNBQUEsQ0FBVSxJQUFWLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsTUFBWCxDQUFrQixDQUFDLG9CQUFuQixDQUF3QyxJQUF4QyxFQUZxQjtJQUFBLENBQXZCLENBSEEsQ0FBQTtXQU9BLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7YUFDakMsU0FBQSxDQUFVLElBQVYsQ0FBZSxDQUFDLElBQWhCLENBQXFCLFNBQUMsSUFBRCxHQUFBO2VBQ25CLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxXQUFiLENBQUEsRUFEbUI7TUFBQSxDQUFyQixFQURpQztJQUFBLENBQW5DLEVBUm9CO0VBQUEsQ0FBdEIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-status-spec.coffee
