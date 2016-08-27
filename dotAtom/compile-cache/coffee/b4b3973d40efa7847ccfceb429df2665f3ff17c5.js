(function() {
  var path;

  path = require('path');

  module.exports = function(p) {
    if (p == null) {
      return;
    }
    if (p.match(/\/\.pigments$/)) {
      return 'pigments';
    } else {
      return path.extname(p).slice(1);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9zY29wZS1mcm9tLWZpbGUtbmFtZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLENBQUQsR0FBQTtBQUNmLElBQUEsSUFBYyxTQUFkO0FBQUEsWUFBQSxDQUFBO0tBQUE7QUFDQSxJQUFBLElBQUcsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxlQUFSLENBQUg7YUFBaUMsV0FBakM7S0FBQSxNQUFBO2FBQWlELElBQUksQ0FBQyxPQUFMLENBQWEsQ0FBYixDQUFnQixVQUFqRTtLQUZlO0VBQUEsQ0FEakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/scope-from-file-name.coffee
