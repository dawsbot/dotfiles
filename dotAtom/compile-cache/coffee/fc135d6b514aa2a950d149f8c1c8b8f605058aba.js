(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9wYXRocy1sb2FkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNULFVBQUEsZ0NBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxFQURWLENBQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxPQUFPLENBQUMsT0FBUixDQUFnQiw0QkFBaEIsQ0FGWCxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FDTCxRQURLLEVBRUwsTUFGSyxFQUdMLFNBQUEsR0FBQTtlQUFHLFFBQUEsQ0FBUztBQUFBLFVBQUMsU0FBQSxPQUFEO0FBQUEsVUFBVSxTQUFBLE9BQVY7U0FBVCxFQUFIO01BQUEsQ0FISyxDQUpQLENBQUE7QUFBQSxNQVVBLElBQUksQ0FBQyxFQUFMLENBQVEsd0JBQVIsRUFBa0MsU0FBQyxLQUFELEdBQUE7ZUFBVyxPQUFPLENBQUMsSUFBUixnQkFBYSxLQUFiLEVBQVg7TUFBQSxDQUFsQyxDQVZBLENBQUE7QUFBQSxNQVdBLElBQUksQ0FBQyxFQUFMLENBQVEsdUJBQVIsRUFBaUMsU0FBQyxLQUFELEdBQUE7ZUFBVyxPQUFPLENBQUMsSUFBUixnQkFBYSxLQUFiLEVBQVg7TUFBQSxDQUFqQyxDQVhBLENBQUE7YUFhQSxLQWRTO0lBQUEsQ0FBWDtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/paths-loader.coffee
