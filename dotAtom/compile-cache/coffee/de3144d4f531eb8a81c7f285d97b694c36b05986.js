(function() {
  var RemoveListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RemoveListView = require('../../lib/views/remove-list-view');

  describe("RemoveListView", function() {
    return it("displays a list of files", function() {
      var view;
      view = new RemoveListView(repo, ['file1', 'file2']);
      return expect(view.items.length).toBe(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmVtb3ZlLWJyYW5jaC1saXN0LXZpZXctc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSLENBRmpCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO1dBQ3pCLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixDQUFDLE9BQUQsRUFBVSxPQUFWLENBQXJCLENBQVgsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0IsRUFGNkI7SUFBQSxDQUEvQixFQUR5QjtFQUFBLENBQTNCLENBSkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/remove-branch-list-view-spec.coffee
