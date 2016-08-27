(function() {
  var GitCherryPick, repo;

  repo = require('../fixtures').repo;

  GitCherryPick = require('../../lib/models/git-cherry-pick');

  describe("GitCherryPick", function() {
    it("gets heads from the repo's references", function() {
      spyOn(repo, 'getReferences').andCallThrough();
      GitCherryPick(repo);
      return expect(repo.getReferences).toHaveBeenCalled();
    });
    return it("calls replace on each head with to remove 'refs/heads/'", function() {
      var head;
      head = repo.getReferences().heads[0];
      GitCherryPick(repo);
      return expect(head.replace).toHaveBeenCalledWith('refs/heads/', '');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jaGVycnktcGljay1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtQkFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGFBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQ0FBUixDQURoQixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLElBQUEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxNQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksZUFBWixDQUE0QixDQUFDLGNBQTdCLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxhQUFBLENBQWMsSUFBZCxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQVosQ0FBMEIsQ0FBQyxnQkFBM0IsQ0FBQSxFQUgwQztJQUFBLENBQTVDLENBQUEsQ0FBQTtXQUtBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFvQixDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWxDLENBQUE7QUFBQSxNQUNBLGFBQUEsQ0FBYyxJQUFkLENBREEsQ0FBQTthQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBWixDQUFvQixDQUFDLG9CQUFyQixDQUEwQyxhQUExQyxFQUF5RCxFQUF6RCxFQUg0RDtJQUFBLENBQTlELEVBTndCO0VBQUEsQ0FBMUIsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-cherry-pick-spec.coffee
