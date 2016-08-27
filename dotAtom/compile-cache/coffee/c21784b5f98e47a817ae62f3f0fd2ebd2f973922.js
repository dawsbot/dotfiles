(function() {
  var CompositeDisposable, PigmentsProvider, Range, variablesRegExp, _, _ref;

  _ = require('underscore-plus');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  variablesRegExp = require('./regexes').variables;

  module.exports = PigmentsProvider = (function() {
    function PigmentsProvider(pigments) {
      this.pigments = pigments;
      this.subscriptions = new CompositeDisposable;
      this.selector = atom.config.get('pigments.autocompleteScopes').join(',');
      this.subscriptions.add(atom.config.observe('pigments.autocompleteScopes', (function(_this) {
        return function(scopes) {
          return _this.selector = scopes.join(',');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToVariables', (function(_this) {
        return function(extendAutocompleteToVariables) {
          _this.extendAutocompleteToVariables = extendAutocompleteToVariables;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToColorValue', (function(_this) {
        return function(extendAutocompleteToColorValue) {
          _this.extendAutocompleteToColorValue = extendAutocompleteToColorValue;
        };
      })(this)));
    }

    PigmentsProvider.prototype.dispose = function() {
      this.disposed = true;
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      if (this.disposed) {
        return;
      }
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      if (this.disposed) {
        return;
      }
      prefix = this.getPrefix(editor, bufferPosition);
      project = this.getProject();
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      if (project == null) {
        return;
      }
      if (this.extendAutocompleteToVariables) {
        variables = project.getVariables();
      } else {
        variables = project.getColorVariables();
      }
      suggestions = this.findSuggestionsForPrefix(variables, prefix);
      return suggestions;
    };

    PigmentsProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(new RegExp(variablesRegExp + '$'))) != null ? _ref1[0] : void 0) || '';
    };

    PigmentsProvider.prototype.findSuggestionsForPrefix = function(variables, prefix) {
      var matchedVariables, suggestions;
      if (variables == null) {
        return [];
      }
      suggestions = [];
      matchedVariables = variables.filter(function(v) {
        return !v.isAlternate && RegExp("^" + (_.escapeRegExp(prefix))).test(v.name);
      });
      matchedVariables.forEach((function(_this) {
        return function(v) {
          var color, rightLabelHTML;
          if (v.isColor) {
            color = v.color.alpha === 1 ? '#' + v.color.hex : v.color.toCSS();
            rightLabelHTML = "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>";
            if (_this.extendAutocompleteToColorValue) {
              rightLabelHTML = "" + color + " " + rightLabelHTML;
            }
            return suggestions.push({
              text: v.name,
              rightLabelHTML: rightLabelHTML,
              replacementPrefix: prefix,
              className: 'color-suggestion'
            });
          } else {
            return suggestions.push({
              text: v.name,
              rightLabel: v.value,
              replacementPrefix: prefix,
              className: 'pigments-suggestion'
            });
          }
        };
      })(this));
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9waWdtZW50cy1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWdDLE9BQUEsQ0FBUSxNQUFSLENBQWhDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsYUFBQSxLQUR0QixDQUFBOztBQUFBLEVBRVksa0JBQW1CLE9BQUEsQ0FBUSxXQUFSLEVBQTlCLFNBRkQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDBCQUFFLFFBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUE4QyxDQUFDLElBQS9DLENBQW9ELEdBQXBELENBRFosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQiw2QkFBcEIsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNwRSxLQUFDLENBQUEsUUFBRCxHQUFZLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixFQUR3RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxH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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/pigments-provider.coffee
