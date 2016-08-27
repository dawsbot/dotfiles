(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function(repo) {
    var currentHead, head, heads, i, _i, _len;
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = _i = 0, _len = heads.length; _i < _len; i = ++_i) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(repo, heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNoZXJyeS1waWNrLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQ0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxzQkFBQSxHQUF5QixPQUFBLENBQVEseUNBQVIsQ0FEekIsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7QUFDZCxRQUFBLHFDQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFvQixDQUFDLEtBQTdCLENBQUE7QUFBQSxJQUNBLFdBQUEsR0FBYyxJQUFJLENBQUMsWUFBTCxDQUFBLENBRGQsQ0FBQTtBQUdBLFNBQUEsb0RBQUE7c0JBQUE7QUFDRSxNQUFBLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNEIsRUFBNUIsQ0FBWCxDQURGO0FBQUEsS0FIQTtBQUFBLElBTUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFELEdBQUE7YUFBVSxJQUFBLEtBQVUsWUFBcEI7SUFBQSxDQUFiLENBTlIsQ0FBQTtXQU9JLElBQUEsc0JBQUEsQ0FBdUIsSUFBdkIsRUFBNkIsS0FBN0IsRUFBb0MsV0FBcEMsRUFSVTtFQUFBLENBSGhCLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQWJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-cherry-pick.coffee
