(function() {
  var VariableParser, VariableScanner, countLines;

  countLines = require('./utils').countLines;

  VariableParser = require('./variable-parser');

  module.exports = VariableScanner = (function() {
    function VariableScanner(params) {
      if (params == null) {
        params = {};
      }
      this.parser = params.parser, this.registry = params.registry, this.scope = params.scope;
      if (this.parser == null) {
        this.parser = new VariableParser(this.registry);
      }
    }

    VariableScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExpForScope(this.scope), 'gm');
    };

    VariableScanner.prototype.search = function(text, start) {
      var index, lastIndex, line, lineCountIndex, match, matchText, regexp, result, v, _i, _len;
      if (start == null) {
        start = 0;
      }
      if (this.registry.getExpressionsForScope(this.scope).length === 0) {
        return;
      }
      regexp = this.getRegExp();
      regexp.lastIndex = start;
      while (match = regexp.exec(text)) {
        matchText = match[0];
        index = match.index;
        lastIndex = regexp.lastIndex;
        result = this.parser.parse(matchText);
        if (result != null) {
          result.lastIndex += index;
          if (result.length > 0) {
            result.range[0] += index;
            result.range[1] += index;
            line = -1;
            lineCountIndex = 0;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.range[0] += index;
              v.range[1] += index;
              line = v.line = line + countLines(text.slice(lineCountIndex, +v.range[0] + 1 || 9e9));
              lineCountIndex = v.range[0];
            }
            return result;
          } else {
            regexp.lastIndex = result.lastIndex;
          }
        }
      }
      return void 0;
    };

    return VariableScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLFNBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQURqQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEseUJBQUMsTUFBRCxHQUFBOztRQUFDLFNBQU87T0FDbkI7QUFBQSxNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsSUFBQyxDQUFBLGtCQUFBLFFBQVgsRUFBcUIsSUFBQyxDQUFBLGVBQUEsS0FBdEIsQ0FBQTs7UUFDQSxJQUFDLENBQUEsU0FBYyxJQUFBLGNBQUEsQ0FBZSxJQUFDLENBQUEsUUFBaEI7T0FGSjtJQUFBLENBQWI7O0FBQUEsOEJBSUEsU0FBQSxHQUFXLFNBQUEsR0FBQTthQUNMLElBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBNEIsSUFBQyxDQUFBLEtBQTdCLENBQVAsRUFBNEMsSUFBNUMsRUFESztJQUFBLENBSlgsQ0FBQTs7QUFBQSw4QkFPQSxNQUFBLEdBQVEsU0FBQyxJQUFELEVBQU8sS0FBUCxHQUFBO0FBQ04sVUFBQSxxRkFBQTs7UUFEYSxRQUFNO09BQ25CO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxRQUFRLENBQUMsc0JBQVYsQ0FBaUMsSUFBQyxDQUFBLEtBQWxDLENBQXdDLENBQUMsTUFBekMsS0FBbUQsQ0FBN0Q7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FEVCxDQUFBO0FBQUEsTUFFQSxNQUFNLENBQUMsU0FBUCxHQUFtQixLQUZuQixDQUFBO0FBSUEsYUFBTSxLQUFBLEdBQVEsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaLENBQWQsR0FBQTtBQUNFLFFBQUMsWUFBYSxRQUFkLENBQUE7QUFBQSxRQUNDLFFBQVMsTUFBVCxLQURELENBQUE7QUFBQSxRQUVDLFlBQWEsT0FBYixTQUZELENBQUE7QUFBQSxRQUlBLE1BQUEsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxTQUFkLENBSlQsQ0FBQTtBQU1BLFFBQUEsSUFBRyxjQUFIO0FBQ0UsVUFBQSxNQUFNLENBQUMsU0FBUCxJQUFvQixLQUFwQixDQUFBO0FBRUEsVUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO0FBQ0UsWUFBQSxNQUFNLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBYixJQUFtQixLQUFuQixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBYixJQUFtQixLQURuQixDQUFBO0FBQUEsWUFHQSxJQUFBLEdBQU8sQ0FBQSxDQUhQLENBQUE7QUFBQSxZQUlBLGNBQUEsR0FBaUIsQ0FKakIsQ0FBQTtBQU1BLGlCQUFBLDZDQUFBOzZCQUFBO0FBQ0UsY0FBQSxDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBUixJQUFjLEtBQWQsQ0FBQTtBQUFBLGNBQ0EsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYyxLQURkLENBQUE7QUFBQSxjQUVBLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixHQUFTLElBQUEsR0FBTyxVQUFBLENBQVcsSUFBSyw4Q0FBaEIsQ0FGdkIsQ0FBQTtBQUFBLGNBR0EsY0FBQSxHQUFpQixDQUFDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FIekIsQ0FERjtBQUFBLGFBTkE7QUFZQSxtQkFBTyxNQUFQLENBYkY7V0FBQSxNQUFBO0FBZUUsWUFBQSxNQUFNLENBQUMsU0FBUCxHQUFtQixNQUFNLENBQUMsU0FBMUIsQ0FmRjtXQUhGO1NBUEY7TUFBQSxDQUpBO0FBK0JBLGFBQU8sTUFBUCxDQWhDTTtJQUFBLENBUFIsQ0FBQTs7MkJBQUE7O01BTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/variable-scanner.coffee
