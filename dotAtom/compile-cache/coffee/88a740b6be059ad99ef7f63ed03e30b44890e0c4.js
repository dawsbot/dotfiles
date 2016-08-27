(function() {
  var ColorContext, ColorParser, ColorSearch, Emitter, Minimatch, registry;

  Emitter = require('atom').Emitter;

  Minimatch = require('minimatch').Minimatch;

  registry = require('./color-expressions');

  ColorParser = require('./color-parser');

  ColorContext = require('./color-context');

  module.exports = ColorSearch = (function() {
    ColorSearch.deserialize = function(state) {
      return new ColorSearch(state.options);
    };

    function ColorSearch(options) {
      var error, ignore, ignoredNames, _i, _len, _ref;
      this.options = options != null ? options : {};
      _ref = this.options, this.sourceNames = _ref.sourceNames, ignoredNames = _ref.ignoredNames, this.context = _ref.context, this.project = _ref.project;
      this.emitter = new Emitter;
      if (this.context == null) {
        this.context = new ColorContext({
          registry: registry
        });
      }
      this.parser = this.context.parser;
      this.variables = this.context.getVariables();
      if (this.sourceNames == null) {
        this.sourceNames = [];
      }
      if (ignoredNames == null) {
        ignoredNames = [];
      }
      this.ignoredNames = [];
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (ignore != null) {
          try {
            this.ignoredNames.push(new Minimatch(ignore, {
              matchBase: true,
              dot: true
            }));
          } catch (_error) {
            error = _error;
            console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
          }
        }
      }
    }

    ColorSearch.prototype.getTitle = function() {
      return 'Pigments Find Results';
    };

    ColorSearch.prototype.getURI = function() {
      return 'pigments://search';
    };

    ColorSearch.prototype.getIconName = function() {
      return "pigments";
    };

    ColorSearch.prototype.onDidFindMatches = function(callback) {
      return this.emitter.on('did-find-matches', callback);
    };

    ColorSearch.prototype.onDidCompleteSearch = function(callback) {
      return this.emitter.on('did-complete-search', callback);
    };

    ColorSearch.prototype.search = function() {
      var promise, re, results;
      re = new RegExp(registry.getRegExp());
      results = [];
      promise = atom.workspace.scan(re, {
        paths: this.sourceNames
      }, (function(_this) {
        return function(m) {
          var newMatches, relativePath, result, scope, _i, _len, _ref, _ref1;
          relativePath = atom.project.relativize(m.filePath);
          scope = _this.project.scopeFromFileName(relativePath);
          if (_this.isIgnored(relativePath)) {
            return;
          }
          newMatches = [];
          _ref = m.matches;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            result = _ref[_i];
            result.color = _this.parser.parse(result.matchText, scope);
            if (!((_ref1 = result.color) != null ? _ref1.isValid() : void 0)) {
              continue;
            }
            if (result.range[0] == null) {
              console.warn("Color search returned a result with an invalid range", result);
              continue;
            }
            result.range[0][1] += result.matchText.indexOf(result.color.colorExpression);
            result.matchText = result.color.colorExpression;
            results.push(result);
            newMatches.push(result);
          }
          m.matches = newMatches;
          if (m.matches.length > 0) {
            return _this.emitter.emit('did-find-matches', m);
          }
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          _this.results = results;
          return _this.emitter.emit('did-complete-search', results);
        };
      })(this));
    };

    ColorSearch.prototype.isIgnored = function(relativePath) {
      var ignoredName, _i, _len, _ref;
      _ref = this.ignoredNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ignoredName = _ref[_i];
        if (ignoredName.match(relativePath)) {
          return true;
        }
      }
    };

    ColorSearch.prototype.serialize = function() {
      return {
        deserializer: 'ColorSearch',
        options: this.options
      };
    };

    return ColorSearch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1zZWFyY2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQURELENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHFCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FIZCxDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUpmLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxXQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRCxHQUFBO2FBQWUsSUFBQSxXQUFBLENBQVksS0FBSyxDQUFDLE9BQWxCLEVBQWY7SUFBQSxDQUFkLENBQUE7O0FBRWEsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxVQUFBLDJDQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsNEJBQUEsVUFBUSxFQUNyQixDQUFBO0FBQUEsTUFBQSxPQUFtRCxJQUFDLENBQUEsT0FBcEQsRUFBQyxJQUFDLENBQUEsbUJBQUEsV0FBRixFQUFlLG9CQUFBLFlBQWYsRUFBNkIsSUFBQyxDQUFBLGVBQUEsT0FBOUIsRUFBdUMsSUFBQyxDQUFBLGVBQUEsT0FBeEMsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FEWCxDQUFBOztRQUVBLElBQUMsQ0FBQSxVQUFlLElBQUEsWUFBQSxDQUFhO0FBQUEsVUFBQyxVQUFBLFFBQUQ7U0FBYjtPQUZoQjtB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-search.coffee
