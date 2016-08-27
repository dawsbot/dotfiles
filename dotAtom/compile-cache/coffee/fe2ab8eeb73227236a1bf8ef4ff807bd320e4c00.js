(function() {
  var __slice = [].slice;

  module.exports = {
    setConfig: function(keyPath, value) {
      var _base;
      if (this.originalConfigs == null) {
        this.originalConfigs = {};
      }
      if ((_base = this.originalConfigs)[keyPath] == null) {
        _base[keyPath] = atom.config.isDefault(keyPath) ? null : atom.config.get(keyPath);
      }
      return atom.config.set(keyPath, value);
    },
    restoreConfigs: function() {
      var keyPath, value, _ref, _results;
      if (this.originalConfigs) {
        _ref = this.originalConfigs;
        _results = [];
        for (keyPath in _ref) {
          value = _ref[keyPath];
          _results.push(atom.config.set(keyPath, value));
        }
        return _results;
      }
    },
    callAsync: function(timeout, async, next) {
      var done, nextArgs, _ref;
      if (typeof timeout === 'function') {
        _ref = [timeout, async], async = _ref[0], next = _ref[1];
        timeout = 5000;
      }
      done = false;
      nextArgs = null;
      runs(function() {
        return async(function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          done = true;
          return nextArgs = args;
        });
      });
      waitsFor(function() {
        return done;
      }, null, timeout);
      if (next != null) {
        return runs(function() {
          return next.apply(this, nextArgs);
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3Mvc3BlYy9zcGVjLWhlbHBlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUNULFVBQUEsS0FBQTs7UUFBQSxJQUFDLENBQUEsa0JBQW1CO09BQXBCOzthQUNpQixDQUFBLE9BQUEsSUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVosQ0FBc0IsT0FBdEIsQ0FBSCxHQUFzQyxJQUF0QyxHQUFnRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEI7T0FEN0U7YUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsT0FBaEIsRUFBeUIsS0FBekIsRUFIUztJQUFBLENBQVg7QUFBQSxJQUtBLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSw4QkFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsZUFBSjtBQUNFO0FBQUE7YUFBQSxlQUFBO2dDQUFBO0FBQ0Usd0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLE9BQWhCLEVBQXlCLEtBQXpCLEVBQUEsQ0FERjtBQUFBO3dCQURGO09BRGM7SUFBQSxDQUxoQjtBQUFBLElBVUEsU0FBQSxFQUFXLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsSUFBakIsR0FBQTtBQUNULFVBQUEsb0JBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLE9BQUEsS0FBa0IsVUFBckI7QUFDRSxRQUFBLE9BQWdCLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBaEIsRUFBQyxlQUFELEVBQVEsY0FBUixDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsSUFEVixDQURGO09BQUE7QUFBQSxNQUdBLElBQUEsR0FBTyxLQUhQLENBQUE7QUFBQSxNQUlBLFFBQUEsR0FBVyxJQUpYLENBQUE7QUFBQSxNQU1BLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxLQUFBLENBQU0sU0FBQSxHQUFBO0FBQ0osY0FBQSxJQUFBO0FBQUEsVUFESyw4REFDTCxDQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO2lCQUNBLFFBQUEsR0FBVyxLQUZQO1FBQUEsQ0FBTixFQURHO01BQUEsQ0FBTCxDQU5BLENBQUE7QUFBQSxNQVlBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7ZUFDUCxLQURPO01BQUEsQ0FBVCxFQUVFLElBRkYsRUFFUSxPQUZSLENBWkEsQ0FBQTtBQWdCQSxNQUFBLElBQUcsWUFBSDtlQUNFLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQ0gsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBQWlCLFFBQWpCLEVBREc7UUFBQSxDQUFMLEVBREY7T0FqQlM7SUFBQSxDQVZYO0dBREYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/spec/spec-helpers.coffee
