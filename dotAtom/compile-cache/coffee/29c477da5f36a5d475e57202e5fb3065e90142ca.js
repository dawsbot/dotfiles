(function() {
  var fs, path,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  module.exports = {
    jsonFixture: function() {
      var paths;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(fixture, data) {
        var json, jsonPath;
        jsonPath = path.resolve.apply(path, __slice.call(paths).concat([fixture]));
        json = fs.readFileSync(jsonPath).toString();
        json = json.replace(/#\{([\w\[\]]+)\}/g, function(m, w) {
          var match, _;
          if (match = /^\[(\w+)\]$/.exec(w)) {
            _ = match[0], w = match[1];
            return data[w].shift();
          } else {
            return data[w];
          }
        });
        return JSON.parse(json);
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvaGVscGVycy9maXh0dXJlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsUUFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxXQUFBLEVBQWEsU0FBQSxHQUFBO0FBQWMsVUFBQSxLQUFBO0FBQUEsTUFBYiwrREFBYSxDQUFBO2FBQUEsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ3pCLFlBQUEsY0FBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLGFBQWEsYUFBQSxLQUFBLENBQUEsUUFBVSxDQUFBLE9BQUEsQ0FBVixDQUFiLENBQVgsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLENBQXlCLENBQUMsUUFBMUIsQ0FBQSxDQURQLENBQUE7QUFBQSxRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLG1CQUFiLEVBQWtDLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtBQUN2QyxjQUFBLFFBQUE7QUFBQSxVQUFBLElBQUcsS0FBQSxHQUFRLGFBQWEsQ0FBQyxJQUFkLENBQW1CLENBQW5CLENBQVg7QUFDRSxZQUFDLFlBQUQsRUFBRyxZQUFILENBQUE7bUJBQ0EsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQVIsQ0FBQSxFQUZGO1dBQUEsTUFBQTttQkFJRSxJQUFLLENBQUEsQ0FBQSxFQUpQO1dBRHVDO1FBQUEsQ0FBbEMsQ0FGUCxDQUFBO2VBU0EsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBVnlCO01BQUEsRUFBZDtJQUFBLENBQWI7R0FKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/helpers/fixtures.coffee
