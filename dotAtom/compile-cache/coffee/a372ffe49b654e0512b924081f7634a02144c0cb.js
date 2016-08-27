(function() {
  var ScriptOptions, _;

  _ = require('underscore');

  module.exports = ScriptOptions = (function() {
    function ScriptOptions() {}

    ScriptOptions.prototype.workingDirectory = null;

    ScriptOptions.prototype.cmd = null;

    ScriptOptions.prototype.cmdArgs = [];

    ScriptOptions.prototype.env = null;

    ScriptOptions.prototype.scriptArgs = [];

    ScriptOptions.prototype.getEnv = function() {
      var key, mapping, pair, value, _i, _len, _ref, _ref1;
      if ((this.env == null) || this.env === '') {
        return {};
      }
      mapping = {};
      _ref = this.env.trim().split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        _ref1 = pair.split('=', 2), key = _ref1[0], value = _ref1[1];
        mapping[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mapping[key] = mapping[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mapping;
    };

    ScriptOptions.prototype.mergedEnv = function(otherEnv) {
      var key, mergedEnv, otherCopy, value;
      otherCopy = _.extend({}, otherEnv);
      mergedEnv = _.extend(otherCopy, this.getEnv());
      for (key in mergedEnv) {
        value = mergedEnv[key];
        mergedEnv[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mergedEnv[key] = mergedEnv[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mergedEnv;
    };

    return ScriptOptions;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007K0JBQ0o7O0FBQUEsNEJBQUEsZ0JBQUEsR0FBa0IsSUFBbEIsQ0FBQTs7QUFBQSw0QkFDQSxHQUFBLEdBQUssSUFETCxDQUFBOztBQUFBLDRCQUVBLE9BQUEsR0FBUyxFQUZULENBQUE7O0FBQUEsNEJBR0EsR0FBQSxHQUFLLElBSEwsQ0FBQTs7QUFBQSw0QkFJQSxVQUFBLEdBQVksRUFKWixDQUFBOztBQUFBLDRCQVVBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLGdEQUFBO0FBQUEsTUFBQSxJQUFpQixrQkFBSixJQUFhLElBQUMsQ0FBQSxHQUFELEtBQVEsRUFBbEM7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsRUFGVixDQUFBO0FBSUE7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQ0UsUUFBQSxRQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFmLEVBQUMsY0FBRCxFQUFNLGdCQUFOLENBQUE7QUFBQSxRQUNBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxDQUFBLEVBQUEsR0FBRyxLQUFILENBQVUsQ0FBQyxPQUFYLENBQW1CLDRCQUFuQixFQUFpRCxJQUFqRCxDQURmLENBQUE7QUFBQSxRQUVBLE9BQVEsQ0FBQSxHQUFBLENBQVIsR0FBZSxPQUFRLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBYixDQUFxQiw0QkFBckIsRUFBbUQsSUFBbkQsQ0FGZixDQURGO0FBQUEsT0FKQTthQVVBLFFBWE07SUFBQSxDQVZSLENBQUE7O0FBQUEsNEJBNEJBLFNBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTtBQUNULFVBQUEsZ0NBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxRQUFiLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsU0FBVCxFQUFvQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQXBCLENBRFosQ0FBQTtBQUdBLFdBQUEsZ0JBQUE7K0JBQUE7QUFDRSxRQUFBLFNBQVUsQ0FBQSxHQUFBLENBQVYsR0FBaUIsQ0FBQSxFQUFBLEdBQUcsS0FBSCxDQUFVLENBQUMsT0FBWCxDQUFtQiw0QkFBbkIsRUFBaUQsSUFBakQsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsU0FBVSxDQUFBLEdBQUEsQ0FBVixHQUFpQixTQUFVLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBZixDQUF1Qiw0QkFBdkIsRUFBcUQsSUFBckQsQ0FEakIsQ0FERjtBQUFBLE9BSEE7YUFPQSxVQVJTO0lBQUEsQ0E1QlgsQ0FBQTs7eUJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-options.coffee
