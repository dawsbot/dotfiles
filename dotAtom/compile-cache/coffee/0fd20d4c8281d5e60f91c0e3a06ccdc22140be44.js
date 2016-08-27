(function() {
  var GitInit, git;

  git = require('../../lib/git');

  GitInit = require('../../lib/models/git-init');

  describe("GitInit", function() {
    return it("sets the project path to the new repo path", function() {
      spyOn(atom.project, 'setPaths');
      spyOn(atom.project, 'getPaths').andCallFake(function() {
        return ['some/path'];
      });
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve(true);
      });
      return waitsForPromise(function() {
        return GitInit().then(function() {
          return expect(atom.project.setPaths).toHaveBeenCalledWith(['some/path']);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1pbml0LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUixDQURWLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7V0FDbEIsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxNQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQixVQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQixVQUFwQixDQUErQixDQUFDLFdBQWhDLENBQTRDLFNBQUEsR0FBQTtlQUFHLENBQUMsV0FBRCxFQUFIO01BQUEsQ0FBNUMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBLEdBQUE7ZUFDNUIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFENEI7TUFBQSxDQUE5QixDQUZBLENBQUE7YUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQUEsQ0FBQSxDQUFTLENBQUMsSUFBVixDQUFlLFNBQUEsR0FBQTtpQkFDYixNQUFBLENBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFwQixDQUE2QixDQUFDLG9CQUE5QixDQUFtRCxDQUFDLFdBQUQsQ0FBbkQsRUFEYTtRQUFBLENBQWYsRUFEYztNQUFBLENBQWhCLEVBTCtDO0lBQUEsQ0FBakQsRUFEa0I7RUFBQSxDQUFwQixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/spec/models/git-init-spec.coffee
