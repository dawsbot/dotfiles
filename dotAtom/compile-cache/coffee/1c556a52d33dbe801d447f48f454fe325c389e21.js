(function() {
  var Color, ColorExpression, createVariableRegExpString;

  Color = require('./color');

  createVariableRegExpString = require('./regexes').createVariableRegExpString;

  module.exports = ColorExpression = (function() {
    ColorExpression.colorExpressionForContext = function(context) {
      return this.colorExpressionForColorVariables(context.getColorVariables());
    };

    ColorExpression.colorExpressionRegexpForColorVariables = function(colorVariables) {
      return createVariableRegExpString(colorVariables);
    };

    ColorExpression.colorExpressionForColorVariables = function(colorVariables) {
      var paletteRegexpString;
      paletteRegexpString = this.colorExpressionRegexpForColorVariables(colorVariables);
      return new ColorExpression({
        name: 'pigments:variables',
        regexpString: paletteRegexpString,
        scopes: ['*'],
        priority: 1,
        handle: function(match, expression, context) {
          var baseColor, evaluated, name, _;
          _ = match[0], _ = match[1], name = match[2];
          if (name == null) {
            name = match[0];
          }
          evaluated = context.readColorExpression(name);
          if (evaluated === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(evaluated);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (context.isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        }
      });
    };

    function ColorExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.scopes = _arg.scopes, this.priority = _arg.priority, this.handle = _arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      color = new Color();
      color.colorExpression = expression;
      color.expressionHandler = this.name;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, results, _ref;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (_ref = re.exec(text), match = _ref[0], _ref) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1leHByZXNzaW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQyw2QkFBOEIsT0FBQSxDQUFRLFdBQVIsRUFBOUIsMEJBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLGVBQUMsQ0FBQSx5QkFBRCxHQUE0QixTQUFDLE9BQUQsR0FBQTthQUMxQixJQUFDLENBQUEsZ0NBQUQsQ0FBa0MsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FBbEMsRUFEMEI7SUFBQSxDQUE1QixDQUFBOztBQUFBLElBR0EsZUFBQyxDQUFBLHNDQUFELEdBQXlDLFNBQUMsY0FBRCxHQUFBO2FBQ3ZDLDBCQUFBLENBQTJCLGNBQTNCLEVBRHVDO0lBQUEsQ0FIekMsQ0FBQTs7QUFBQSxJQU1BLGVBQUMsQ0FBQSxnQ0FBRCxHQUFtQyxTQUFDLGNBQUQsR0FBQTtBQUNqQyxVQUFBLG1CQUFBO0FBQUEsTUFBQSxtQkFBQSxHQUFzQixJQUFDLENBQUEsc0NBQUQsQ0FBd0MsY0FBeEMsQ0FBdEIsQ0FBQTthQUVJLElBQUEsZUFBQSxDQUNGO0FBQUEsUUFBQSxJQUFBLEVBQU0sb0JBQU47QUFBQSxRQUNBLFlBQUEsRUFBYyxtQkFEZDtBQUFBLFFBRUEsTUFBQSxFQUFRLENBQUMsR0FBRCxDQUZSO0FBQUEsUUFHQSxRQUFBLEVBQVUsQ0FIVjtBQUFBLFFBSUEsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsT0FBcEIsR0FBQTtBQUNOLGNBQUEsNkJBQUE7QUFBQSxVQUFDLFlBQUQsRUFBSSxZ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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-expression.coffee
