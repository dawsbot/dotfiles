(function() {
  var ExpressionsRegistry, VariableExpression, registry, sass_handler;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n\\r]+);?', ['less']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['scss', 'sass', 'haml'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  sass_handler = function(match, solver) {
    var all_hyphen, all_underscore;
    solver.appendResult([match[1], match[2], 0, match[0].length]);
    if (match[1].match(/[-_]/)) {
      all_underscore = match[1].replace(/-/g, '_');
      all_hyphen = match[1].replace(/_/g, '-');
      if (match[1] !== all_underscore) {
        solver.appendResult([all_underscore, match[2], 0, match[0].length, true]);
      }
      if (match[1] !== all_hyphen) {
        solver.appendResult([all_hyphen, match[2], 0, match[0].length, true]);
      }
    }
    return solver.endParsing(match[0].length);
  };

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?\\s*;', ['scss', 'haml'], sass_handler);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*([^\\{]*?)(\\s*!default)?\\s*(?:$|\\/)', ['sass', 'haml'], sass_handler);

  registry.createExpression('pigments:css_vars', '(--[^\\s:]+):\\s*([^\\n;]+);', ['css'], function(match, solver) {
    solver.appendResult(["var(" + match[1] + ")", match[2], 0, match[0].length]);
    return solver.endParsing(match[0].length);
  });

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['styl', 'stylus'], function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, inCommaSensitiveContext, key, name, scope, scopeBegin, scopeEnd, value, _i, _len, _ref, _ref1;
    buffer = '';
    _ref = match, match = _ref[0], name = _ref[1], content = _ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (_i = 0, _len = content.length; _i < _len; _i++) {
      char = content[_i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = buffer.replace(/\s+/g, '');
        if (buffer.length) {
          _ref1 = buffer.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
          solver.appendResult([scope.concat(key).join('.'), value, current - buffer.length - 1, current]);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['styl', 'stylus']);

  registry.createExpression('pigments:latex', '\\\\definecolor(\\{[^\\}]+\\})\\{([^\\}]+)\\}\\{([^\\}]+)\\}', ['tex'], function(match, solver) {
    var mode, name, value, values, _;
    _ = match[0], name = match[1], mode = match[2], value = match[3];
    value = (function() {
      switch (mode) {
        case 'RGB':
          return "rgb(" + value + ")";
        case 'gray':
          return "gray(" + (Math.round(parseFloat(value) * 100)) + "%)";
        case 'rgb':
          values = value.split(',').map(function(n) {
            return Math.floor(n * 255);
          });
          return "rgb(" + (values.join(',')) + ")";
        case 'cmyk':
          return "cmyk(" + value + ")";
        case 'HTML':
          return "#" + value;
        default:
          return value;
      }
    })();
    solver.appendResult([name, value, 0, _.length, false, true]);
    return solver.endParsing(_.length);
  });

  registry.createExpression('pigments:latex_mix', '\\\\definecolor(\\{[^\\}]+\\})(\\{[^\\}\\n!]+[!][^\\}\\n]+\\})', ['tex'], function(match, solver) {
    var name, value, _;
    _ = match[0], name = match[1], value = match[2];
    solver.appendResult([name, value, 0, _.length, false, true]);
    return solver.endParsing(_.length);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZS1leHByZXNzaW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0RBQUE7O0FBQUEsRUFBQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVIsQ0FBdEIsQ0FBQTs7QUFBQSxFQUNBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUixDQURyQixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBQSxHQUFlLElBQUEsbUJBQUEsQ0FBb0Isa0JBQXBCLENBSGhDLENBQUE7O0FBQUEsRUFLQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsZUFBMUIsRUFBMkMscURBQTNDLEVBQWtHLENBQUMsTUFBRCxDQUFsRyxDQUxBLENBQUE7O0FBQUEsRUFRQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsc0JBQTFCLEVBQWtELHdFQUFsRCxFQUE0SCxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLE1BQWpCLENBQTVILEVBQXNKLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNwSixJQUFDLFFBQVMsUUFBVixDQUFBO1dBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFqQyxFQUZvSjtFQUFBLENBQXRKLENBUkEsQ0FBQTs7QUFBQSxFQVlBLFlBQUEsR0FBZSxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDYixRQUFBLDBCQUFBO0FBQUEsSUFBQSxNQUFNLENBQUMsWUFBUCxDQUFvQixDQUNsQixLQUFNLENBQUEsQ0FBQSxDQURZLEVBRWxCLEtBQU0sQ0FBQSxDQUFBLENBRlksRUFHbEIsQ0FIa0IsRUFJbEIsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BSlMsQ0FBcEIs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/variable-expressions.coffee
