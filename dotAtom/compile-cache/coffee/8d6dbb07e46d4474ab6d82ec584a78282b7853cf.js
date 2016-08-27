(function() {
  var GitTags, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitTags = require('../../lib/models/git-tags');

  describe("GitTags", function() {
    return it("calls git.cmd with 'tag' as an arg", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('data'));
      GitTags(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '-ln'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC10YWdzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUROLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLDJCQUFSLENBRlYsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtXQUNsQixFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLE1BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxPQUFBLENBQVEsSUFBUixDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQXJDLEVBQXFEO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFyRCxFQUh1QztJQUFBLENBQXpDLEVBRGtCO0VBQUEsQ0FBcEIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-tags-spec.coffee
