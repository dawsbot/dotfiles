(function() {
  var ColorParser, ColorScanner, countLines, getRegistry;

  countLines = require('./utils').countLines;

  getRegistry = require('./color-expressions').getRegistry;

  ColorParser = require('./color-parser');

  module.exports = ColorScanner = (function() {
    function ColorScanner(_arg) {
      this.context = (_arg != null ? _arg : {}).context;
      this.parser = this.context.parser;
      this.registry = this.context.registry;
    }

    ColorScanner.prototype.getRegExp = function() {
      return new RegExp(this.registry.getRegExp(), 'g');
    };

    ColorScanner.prototype.getRegExpForScope = function(scope) {
      return new RegExp(this.registry.getRegExpForScope(scope), 'g');
    };

    ColorScanner.prototype.search = function(text, scope, start) {
      var color, index, lastIndex, match, matchText, regexp;
      if (start == null) {
        start = 0;
      }
      regexp = this.getRegExpForScope(scope);
      regexp.lastIndex = start;
      if (match = regexp.exec(text)) {
        matchText = match[0];
        lastIndex = regexp.lastIndex;
        color = this.parser.parse(matchText, scope);
        if ((index = matchText.indexOf(color.colorExpression)) > 0) {
          lastIndex += -matchText.length + index + color.colorExpression.length;
          matchText = color.colorExpression;
        }
        return {
          color: color,
          match: matchText,
          lastIndex: lastIndex,
          range: [lastIndex - matchText.length, lastIndex],
          line: countLines(text.slice(0, +(lastIndex - matchText.length) + 1 || 9e9)) - 1
        };
      }
    };

    return ColorScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLFNBQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQyxjQUFlLE9BQUEsQ0FBUSxxQkFBUixFQUFmLFdBREQsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsMEJBQUYsT0FBVyxJQUFULE9BQ2QsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQW5CLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBQyxDQUFBLE9BQU8sQ0FBQyxRQURyQixDQURXO0lBQUEsQ0FBYjs7QUFBQSwyQkFJQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQ0wsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUEsQ0FBUCxFQUE4QixHQUE5QixFQURLO0lBQUEsQ0FKWCxDQUFBOztBQUFBLDJCQU9BLGlCQUFBLEdBQW1CLFNBQUMsS0FBRCxHQUFBO2FBQ2IsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxpQkFBVixDQUE0QixLQUE1QixDQUFQLEVBQTJDLEdBQTNDLEVBRGE7SUFBQSxDQVBuQixDQUFBOztBQUFBLDJCQVVBLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsS0FBZCxHQUFBO0FBQ04sVUFBQSxpREFBQTs7UUFEb0IsUUFBTTtPQUMxQjtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFuQixDQUFULENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLEtBRG5CLENBQUE7QUFHQSxNQUFBLElBQUcsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFYO0FBQ0UsUUFBQyxZQUFhLFFBQWQsQ0FBQTtBQUFBLFFBQ0MsWUFBYSxPQUFiLFNBREQsQ0FBQTtBQUFBLFFBR0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLFNBQWQsRUFBeUIsS0FBekIsQ0FIUixDQUFBO0FBT0EsUUFBQSxJQUFHLENBQUMsS0FBQSxHQUFRLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQUssQ0FBQyxlQUF4QixDQUFULENBQUEsR0FBcUQsQ0FBeEQ7QUFDRSxVQUFBLFNBQUEsSUFBYSxDQUFBLFNBQVUsQ0FBQyxNQUFYLEdBQW9CLEtBQXBCLEdBQTRCLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBL0QsQ0FBQTtBQUFBLFVBQ0EsU0FBQSxHQUFZLEtBQUssQ0FBQyxlQURsQixDQURGO1NBUEE7ZUFXQTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxTQURQO0FBQUEsVUFFQSxTQUFBLEVBQVcsU0FGWDtBQUFBLFVBR0EsS0FBQSxFQUFPLENBQ0wsU0FBQSxHQUFZLFNBQVMsQ0FBQyxNQURqQixFQUVMLFNBRkssQ0FIUDtBQUFBLFVBT0EsSUFBQSxFQUFNLFVBQUEsQ0FBVyxJQUFLLHFEQUFoQixDQUFBLEdBQW9ELENBUDFEO1VBWkY7T0FKTTtJQUFBLENBVlIsQ0FBQTs7d0JBQUE7O01BTkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-scanner.coffee
