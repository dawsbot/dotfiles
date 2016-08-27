(function() {
  var BranchListView, RemoteBranchListView, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  git = require('../git');

  BranchListView = require('../views/branch-list-view');

  module.exports = RemoteBranchListView = (function(_super) {
    __extends(RemoteBranchListView, _super);

    function RemoteBranchListView() {
      return RemoteBranchListView.__super__.constructor.apply(this, arguments);
    }

    RemoteBranchListView.prototype.args = ['checkout', '-t'];

    return RemoteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdGUtYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxJQUFBLEdBQU0sQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFOLENBQUE7O2dDQUFBOztLQURpQyxlQUpuQyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/remote-branch-list-view.coffee
