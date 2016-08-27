(function() {
  var CommandContext, grammarMap;

  grammarMap = require('./grammars');

  module.exports = CommandContext = (function() {
    function CommandContext() {}

    CommandContext.prototype.command = null;

    CommandContext.prototype.args = [];

    CommandContext.build = function(runtime, runOptions, codeContext) {
      var buildArgsArray, commandContext, error, errorSendByArgs;
      commandContext = new CommandContext;
      try {
        if ((runOptions.cmd == null) || runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }
      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (_error) {
        errorSendByArgs = _error;
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }
      return commandContext;
    };

    return CommandContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29tbWFuZC1jb250ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUFiLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLE9BQUEsR0FBUyxJQUFULENBQUE7O0FBQUEsNkJBQ0EsSUFBQSxHQUFNLEVBRE4sQ0FBQTs7QUFBQSxJQUdBLGNBQUMsQ0FBQSxLQUFELEdBQVEsU0FBQyxPQUFELEVBQVUsVUFBVixFQUFzQixXQUF0QixHQUFBO0FBQ04sVUFBQSxzREFBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixHQUFBLENBQUEsY0FBakIsQ0FBQTtBQUVBO0FBQ0UsUUFBQSxJQUFPLHdCQUFKLElBQXVCLFVBQVUsQ0FBQyxHQUFYLEtBQWtCLEVBQTVDO0FBRUUsVUFBQSxjQUFjLENBQUMsT0FBZixHQUF5QixXQUFXLENBQUMsY0FBWixDQUFBLENBQUEsSUFBZ0MsVUFBVyxDQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWtCLENBQUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxPQUEzRyxDQUZGO1NBQUEsTUFBQTtBQUlFLFVBQUEsY0FBYyxDQUFDLE9BQWYsR0FBeUIsVUFBVSxDQUFDLEdBQXBDLENBSkY7U0FBQTtBQUFBLFFBTUEsY0FBQSxHQUFpQixVQUFXLENBQUEsV0FBVyxDQUFDLElBQVosQ0FBa0IsQ0FBQSxXQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLElBTm5FLENBREY7T0FBQSxjQUFBO0FBVUUsUUFESSxjQUNKLENBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixXQUFXLENBQUMsT0FBckMsRUFBOEMsV0FBVyxDQUFDLElBQTFELENBQUEsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQVhGO09BRkE7QUFlQTtBQUNFLFFBQUEsY0FBYyxDQUFDLElBQWYsR0FBc0IsY0FBQSxDQUFlLFdBQWYsQ0FBdEIsQ0FERjtPQUFBLGNBQUE7QUFHRSxRQURJLHdCQUNKLENBQUE7QUFBQSxRQUFBLE9BQU8sQ0FBQyxlQUFSLENBQXdCLGVBQXhCLENBQUEsQ0FBQTtBQUNBLGVBQU8sS0FBUCxDQUpGO09BZkE7YUFzQkEsZUF2Qk07SUFBQSxDQUhSLENBQUE7OzBCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/command-context.coffee
