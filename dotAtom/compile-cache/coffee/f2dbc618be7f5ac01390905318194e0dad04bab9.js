(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(paths, registry, callback) {
      var results, taskPath;
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, [paths, registry.serialize()], (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var _ref;
      return (_ref = this.task) != null ? _ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYXRocy1zY2FubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLFFBQWxCLEdBQUE7QUFDVCxVQUFBLGlCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFDQSxRQUFBLEdBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCLENBRFgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUNOLFFBRE0sRUFFTixDQUFDLEtBQUQsRUFBUSxRQUFRLENBQUMsU0FBVCxDQUFBLENBQVIsQ0FGTSxFQUdOLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDRSxVQUFBLEtBQUMsQ0FBQSxJQUFELEdBQVEsSUFBUixDQUFBO2lCQUNBLFFBQUEsQ0FBUyxPQUFULEVBRkY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhNLENBSFIsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLElBQUksQ0FBQyxFQUFOLENBQVMseUJBQVQsRUFBb0MsU0FBQyxNQUFELEdBQUE7ZUFDbEMsT0FBQSxHQUFVLE9BQU8sQ0FBQyxNQUFSLENBQWUsTUFBZixFQUR3QjtNQUFBLENBQXBDLENBWEEsQ0FBQTthQWNBLElBQUMsQ0FBQSxLQWZRO0lBQUEsQ0FBWDtBQUFBLElBaUJBLG9CQUFBLEVBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLElBQUE7OENBQUssQ0FBRSxTQUFQLENBQUEsV0FEb0I7SUFBQSxDQWpCdEI7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/paths-scanner.coffee
