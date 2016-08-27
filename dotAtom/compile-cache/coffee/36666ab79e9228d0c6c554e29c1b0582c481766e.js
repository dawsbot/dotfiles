(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry, scope;
      this.buffer = config.buffer, registry = config.registry, scope = config.scope;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry,
        scope: scope
      });
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi90YXNrcy9zY2FuLWJ1ZmZlci12YXJpYWJsZXMtaGFuZGxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0hBQUE7O0FBQUEsRUFBQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUFsQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FGckIsQ0FBQTs7QUFBQSxFQUdBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQUh0QixDQUFBOztBQUFBLEVBS0Esa0JBQUEsR0FBcUIsR0FMckIsQ0FBQTs7QUFBQSxFQU9NO0FBQ1MsSUFBQSxnQ0FBQyxNQUFELEdBQUE7QUFDWCxVQUFBLGVBQUE7QUFBQSxNQUFDLElBQUMsQ0FBQSxnQkFBQSxNQUFGLEVBQVUsa0JBQUEsUUFBVixFQUFvQixlQUFBLEtBQXBCLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxtQkFBbUIsQ0FBQyxXQUFwQixDQUFnQyxRQUFoQyxFQUEwQyxrQkFBMUMsQ0FEWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsZUFBQSxDQUFnQjtBQUFBLFFBQUMsVUFBQSxRQUFEO0FBQUEsUUFBVyxPQUFBLEtBQVg7T0FBaEIsQ0FGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSFgsQ0FEVztJQUFBLENBQWI7O0FBQUEscUNBTUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsa0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFaLENBQUE7QUFDQSxhQUFNLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLFNBQXpCLENBQWhCLEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLE9BQWhCLENBQVgsQ0FBQTtBQUVBLFFBQUEsSUFBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLGtCQUF4QztBQUFBLFVBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFBLENBQUE7U0FGQTtBQUFBLFFBR0MsWUFBYSxRQUFiLFNBSEQsQ0FERjtNQUFBLENBREE7YUFPQSxJQUFDLENBQUEsY0FBRCxDQUFBLEVBUkk7SUFBQSxDQU5OLENBQUE7O0FBQUEscUNBZ0JBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsTUFBQSxJQUFBLENBQUssNkJBQUwsRUFBb0MsSUFBQyxDQUFBLE9BQXJDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FGRztJQUFBLENBaEJoQixDQUFBOztrQ0FBQTs7TUFSRixDQUFBOztBQUFBLEVBNEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsTUFBRCxHQUFBO1dBQ1gsSUFBQSxzQkFBQSxDQUF1QixNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQUEsRUFEVztFQUFBLENBNUJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/tasks/scan-buffer-variables-handler.coffee
