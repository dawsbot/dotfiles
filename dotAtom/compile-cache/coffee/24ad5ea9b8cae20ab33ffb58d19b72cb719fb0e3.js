(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + decimal + "|" + int + "|" + decimal + ")";

  percent = "" + float + "%";

  variables = '(?:@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |\\t|:|=|,|\\n|\'|"|\\(|\\[|\\{|>';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: "" + float + "%?",
    intOrPercent: "(?:" + percent + "|" + int + ")",
    floatOrPercent: "(?:" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'\\n\\r]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var res, v, variableNamesWithPrefix, variableNamesWithoutPrefix, withPrefixes, withoutPrefixes, _i, _j, _len, _len1;
      variableNamesWithPrefix = [];
      variableNamesWithoutPrefix = [];
      withPrefixes = variables.filter(function(v) {
        return !v.noNamePrefix;
      });
      withoutPrefixes = variables.filter(function(v) {
        return v.noNamePrefix;
      });
      res = [];
      if (withPrefixes.length > 0) {
        for (_i = 0, _len = withPrefixes.length; _i < _len; _i++) {
          v = withPrefixes[_i];
          variableNamesWithPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("((?:" + namePrefixes + ")(" + (variableNamesWithPrefix.join('|')) + ")(\\s+!default)?(?!_|-|\\w|\\d|[ \\t]*[\\.:=]))");
      }
      if (withoutPrefixes.length > 0) {
        for (_j = 0, _len1 = withoutPrefixes.length; _j < _len1; _j++) {
          v = withoutPrefixes[_j];
          variableNamesWithoutPrefix.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
        }
        res.push("(" + (variableNamesWithoutPrefix.join('|')) + ")");
      }
      return res.join('|');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9yZWdleGVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxREFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxNQUFOLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVcsS0FBQSxHQUFLLEdBRGhCLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVMsS0FBQSxHQUFLLEdBQUwsR0FBVyxPQUFYLEdBQW1CLEdBQW5CLEdBQXNCLEdBQXRCLEdBQTBCLEdBQTFCLEdBQTZCLE9BQTdCLEdBQXFDLEdBRjlDLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsRUFBQSxHQUFHLEtBQUgsR0FBUyxHQUhuQixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUFZLHFFQUpaLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsc0NBTGYsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsSUFDQSxLQUFBLEVBQU8sS0FEUDtBQUFBLElBRUEsT0FBQSxFQUFTLE9BRlQ7QUFBQSxJQUdBLGVBQUEsRUFBaUIsRUFBQSxHQUFHLEtBQUgsR0FBUyxJQUgxQjtBQUFBLElBSUEsWUFBQSxFQUFlLEtBQUEsR0FBSyxPQUFMLEdBQWEsR0FBYixHQUFnQixHQUFoQixHQUFvQixHQUpuQztBQUFBLElBS0EsY0FBQSxFQUFpQixLQUFBLEdBQUssT0FBTCxHQUFhLEdBQWIsR0FBZ0IsS0FBaEIsR0FBc0IsR0FMdkM7QUFBQSxJQU1BLEtBQUEsRUFBTyxXQU5QO0FBQUEsSUFPQSxRQUFBLEVBQVUsZUFQVjtBQUFBLElBUUEsV0FBQSxFQUFhLGFBUmI7QUFBQSxJQVNBLEVBQUEsRUFBSSxTQVRKO0FBQUEsSUFVQSxFQUFBLEVBQUksU0FWSjtBQUFBLElBV0EsU0FBQSxFQUFXLFNBWFg7QUFBQSxJQVlBLFlBQUEsRUFBYyxZQVpkO0FBQUEsSUFhQSwwQkFBQSxFQUE0QixTQUFDLFNBQUQsR0FBQTtBQUMxQixVQUFBLCtHQUFBO0FBQUEsTUFBQSx1QkFBQSxHQUEwQixFQUExQixDQUFBO0FBQUEsTUFDQSwwQkFBQSxHQUE2QixFQUQ3QixDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsU0FBQyxDQUFELEdBQUE7ZUFBTyxDQUFBLENBQUssQ0FBQyxhQUFiO01BQUEsQ0FBakIsQ0FGZixDQUFBO0FBQUEsTUFHQSxlQUFBLEdBQWtCLFNBQVMsQ0FBQyxNQUFWLENBQWlCLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLGFBQVQ7TUFBQSxDQUFqQixDQUhsQixDQUFBO0FBQUEsTUFLQSxHQUFBLEdBQU0sRUFMTixDQUFBO0FBT0EsTUFBQSxJQUFHLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXpCO0FBQ0UsYUFBQSxtREFBQTsrQkFBQTtBQUNFLFVBQUEsdUJBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsb0NBQWYsRUFBcUQsTUFBckQsQ0FBN0IsQ0FBQSxDQURGO0FBQUEsU0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLElBQUosQ0FBVSxNQUFBLEdBQU0sWUFBTixHQUFtQixJQUFuQixHQUFzQixDQUFDLHVCQUF1QixDQUFDLElBQXhCLENBQTZCLEdBQTdCLENBQUQsQ0FBdEIsR0FBeUQsaURBQW5FLENBSEEsQ0FERjtPQVBBO0FBYUEsTUFBQSxJQUFHLGVBQWUsQ0FBQyxNQUFoQixHQUF5QixDQUE1QjtBQUNFLGFBQUEsd0RBQUE7a0NBQUE7QUFDRSxVQUFBLDBCQUEwQixDQUFDLElBQTNCLENBQWdDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFlLG9DQUFmLEVBQXFELE1BQXJELENBQWhDLENBQUEsQ0FERjtBQUFBLFNBQUE7QUFBQSxRQUdBLEdBQUcsQ0FBQyxJQUFKLENBQVUsR0FBQSxHQUFFLENBQUMsMEJBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsR0FBaEMsQ0FBRCxDQUFGLEdBQXdDLEdBQWxELENBSEEsQ0FERjtPQWJBO2FBbUJBLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxFQXBCMEI7SUFBQSxDQWI1QjtHQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/regexes.coffee
