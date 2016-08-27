(function() {
  var ScriptOptions, _;

  _ = require('underscore');

  module.exports = ScriptOptions = (function() {
    function ScriptOptions() {}

    ScriptOptions.prototype.name = '';

    ScriptOptions.prototype.description = '';

    ScriptOptions.prototype.lang = '';

    ScriptOptions.prototype.workingDirectory = null;

    ScriptOptions.prototype.cmd = null;

    ScriptOptions.prototype.cmdArgs = [];

    ScriptOptions.prototype.env = null;

    ScriptOptions.prototype.scriptArgs = [];

    ScriptOptions.createFromOptions = function(name, options) {
      var key, so, value;
      so = new ScriptOptions;
      so.name = name;
      for (key in options) {
        value = options[key];
        so[key] = value;
      }
      return so;
    };

    ScriptOptions.prototype.toObject = function() {
      return {
        name: this.name,
        description: this.description,
        lang: this.lang,
        workingDirectory: this.workingDirectory,
        cmd: this.cmd,
        cmdArgs: this.cmdArgs,
        env: this.env,
        scriptArgs: this.scriptArgs
      };
    };

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007K0JBQ0o7O0FBQUEsNEJBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSw0QkFDQSxXQUFBLEdBQWEsRUFEYixDQUFBOztBQUFBLDRCQUVBLElBQUEsR0FBTSxFQUZOLENBQUE7O0FBQUEsNEJBR0EsZ0JBQUEsR0FBa0IsSUFIbEIsQ0FBQTs7QUFBQSw0QkFJQSxHQUFBLEdBQUssSUFKTCxDQUFBOztBQUFBLDRCQUtBLE9BQUEsR0FBUyxFQUxULENBQUE7O0FBQUEsNEJBTUEsR0FBQSxHQUFLLElBTkwsQ0FBQTs7QUFBQSw0QkFPQSxVQUFBLEdBQVksRUFQWixDQUFBOztBQUFBLElBU0EsYUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsSUFBRCxFQUFPLE9BQVAsR0FBQTtBQUNsQixVQUFBLGNBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxHQUFBLENBQUEsYUFBTCxDQUFBO0FBQUEsTUFDQSxFQUFFLENBQUMsSUFBSCxHQUFVLElBRFYsQ0FBQTtBQUVBLFdBQUEsY0FBQTs2QkFBQTtBQUFBLFFBQUEsRUFBRyxDQUFBLEdBQUEsQ0FBSCxHQUFVLEtBQVYsQ0FBQTtBQUFBLE9BRkE7YUFHQSxHQUprQjtJQUFBLENBVHBCLENBQUE7O0FBQUEsNEJBZUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBQyxDQUFBLElBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxJQUFDLENBQUEsV0FEZDtBQUFBLFFBRUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxJQUZQO0FBQUEsUUFHQSxnQkFBQSxFQUFrQixJQUFDLENBQUEsZ0JBSG5CO0FBQUEsUUFJQSxHQUFBLEVBQUssSUFBQyxDQUFBLEdBSk47QUFBQSxRQUtBLE9BQUEsRUFBUyxJQUFDLENBQUEsT0FMVjtBQUFBLFFBTUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQU5OO0FBQUEsUUFPQSxVQUFBLEVBQVksSUFBQyxDQUFBLFVBUGI7UUFEUTtJQUFBLENBZlYsQ0FBQTs7QUFBQSw0QkE2QkEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsZ0RBQUE7QUFBQSxNQUFBLElBQWlCLGtCQUFKLElBQWEsSUFBQyxDQUFBLEdBQUQsS0FBUSxFQUFsQztBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFBQSxNQUVBLE9BQUEsR0FBVSxFQUZWLENBQUE7QUFJQTtBQUFBLFdBQUEsMkNBQUE7d0JBQUE7QUFDRSxRQUFBLFFBQWUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLENBQWhCLENBQWYsRUFBQyxjQUFELEVBQU0sZ0JBQU4sQ0FBQTtBQUFBLFFBQ0EsT0FBUSxDQUFBLEdBQUEsQ0FBUixHQUFlLENBQUEsRUFBQSxHQUFHLEtBQUgsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsNEJBQW5CLEVBQWlELElBQWpELENBRGYsQ0FBQTtBQUFBLFFBRUEsT0FBUSxDQUFBLEdBQUEsQ0FBUixHQUFlLE9BQVEsQ0FBQSxHQUFBLENBQUksQ0FBQyxPQUFiLENBQXFCLDRCQUFyQixFQUFtRCxJQUFuRCxDQUZmLENBREY7QUFBQSxPQUpBO2FBVUEsUUFYTTtJQUFBLENBN0JSLENBQUE7O0FBQUEsNEJBK0NBLFNBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTtBQUNULFVBQUEsZ0NBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxRQUFiLENBQVosQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLENBQUMsQ0FBQyxNQUFGLENBQVMsU0FBVCxFQUFvQixJQUFDLENBQUEsTUFBRCxDQUFBLENBQXBCLENBRFosQ0FBQTtBQUdBLFdBQUEsZ0JBQUE7K0JBQUE7QUFDRSxRQUFBLFNBQVUsQ0FBQSxHQUFBLENBQVYsR0FBaUIsQ0FBQSxFQUFBLEdBQUcsS0FBSCxDQUFVLENBQUMsT0FBWCxDQUFtQiw0QkFBbkIsRUFBaUQsSUFBakQsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsU0FBVSxDQUFBLEdBQUEsQ0FBVixHQUFpQixTQUFVLENBQUEsR0FBQSxDQUFJLENBQUMsT0FBZixDQUF1Qiw0QkFBdkIsRUFBcUQsSUFBckQsQ0FEakIsQ0FERjtBQUFBLE9BSEE7YUFPQSxVQVJTO0lBQUEsQ0EvQ1gsQ0FBQTs7eUJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-options.coffee
