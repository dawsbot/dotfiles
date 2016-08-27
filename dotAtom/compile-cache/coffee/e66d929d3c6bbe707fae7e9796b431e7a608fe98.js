(function() {
  var TagListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagListView = require('../../lib/views/tag-list-view');

  describe("TagListView", function() {
    describe("when there are two tags", function() {
      return it("displays a list of tags", function() {
        var view;
        view = new TagListView(repo, "tag1\ntag2");
        return expect(view.items.length).toBe(2);
      });
    });
    return describe("when there are no tags", function() {
      return it("displays a message to 'Add Tag'", function() {
        var view;
        view = new TagListView(repo);
        expect(view.items.length).toBe(1);
        return expect(view.items[0].tag).toBe('+ Add Tag');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvdGFnLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsSUFBQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO2FBQ2xDLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQVcsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixZQUFsQixDQUFYLENBQUE7ZUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFsQixDQUF5QixDQUFDLElBQTFCLENBQStCLENBQS9CLEVBRjRCO01BQUEsQ0FBOUIsRUFEa0M7SUFBQSxDQUFwQyxDQUFBLENBQUE7V0FLQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQSxHQUFBO2FBQ2pDLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQVcsSUFBQSxXQUFBLENBQVksSUFBWixDQUFYLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0IsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBckIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixXQUEvQixFQUhvQztNQUFBLENBQXRDLEVBRGlDO0lBQUEsQ0FBbkMsRUFOc0I7RUFBQSxDQUF4QixDQUpBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/views/tag-list-view-spec.coffee
