(function() {
  var filesFromData, git;

  git = require('../git');

  filesFromData = function(statusData) {
    var files, line, lineMatch, _i, _len;
    files = [];
    for (_i = 0, _len = statusData.length; _i < _len; _i++) {
      line = statusData[_i];
      lineMatch = line.match(/^([ MARCU?!]{2})\s{1}(.*)/);
      if (lineMatch) {
        files.push(lineMatch[2]);
      }
    }
    return files;
  };

  module.exports = function(repo) {
    return git.status(repo).then(function(statusData) {
      var file, _i, _len, _ref, _results;
      _ref = filesFromData(statusData);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(atom.workspace.open(file));
      }
      return _results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LW9wZW4tY2hhbmdlZC1maWxlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtBQUNkLFFBQUEsZ0NBQUE7QUFBQSxJQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFDQSxTQUFBLGlEQUFBOzRCQUFBO0FBQ0UsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVywyQkFBWCxDQUFaLENBQUE7QUFDQSxNQUFBLElBQTJCLFNBQTNCO0FBQUEsUUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFNBQVUsQ0FBQSxDQUFBLENBQXJCLENBQUEsQ0FBQTtPQUZGO0FBQUEsS0FEQTtXQUlBLE1BTGM7RUFBQSxDQUZoQixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEdBQUE7V0FDZixHQUFHLENBQUMsTUFBSixDQUFXLElBQVgsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixTQUFDLFVBQUQsR0FBQTtBQUNwQixVQUFBLDhCQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBO3dCQUFBO0FBQ0Usc0JBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLEVBQUEsQ0FERjtBQUFBO3NCQURvQjtJQUFBLENBQXRCLEVBRGU7RUFBQSxDQVRqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/models/git-open-changed-files.coffee
