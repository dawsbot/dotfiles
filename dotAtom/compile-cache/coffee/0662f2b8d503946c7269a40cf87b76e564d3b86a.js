(function() {
  var CommandContext, grammarMap;

  grammarMap = require('./grammars');

  module.exports = CommandContext = (function() {
    function CommandContext() {}

    CommandContext.prototype.command = null;

    CommandContext.prototype.workingDirectory = null;

    CommandContext.prototype.args = [];

    CommandContext.prototype.options = {};

    CommandContext.build = function(runtime, runOptions, codeContext) {
      var buildArgsArray, commandContext, error, errorSendByArgs;
      commandContext = new CommandContext;
      commandContext.options = runOptions;
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
      if ((runOptions.workingDirectory == null) || runOptions.workingDirectory === '') {
        commandContext.workingDirectory = grammarMap[codeContext.lang][codeContext.argType].workingDirectory || '';
      } else {
        commandContext.workingDirectory = runOptions.workingDirectory;
      }
      return commandContext;
    };

    CommandContext.prototype.quoteArguments = function(args) {
      var arg, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        _results.push(arg.trim().indexOf(' ') === -1 ? arg.trim() : "'" + arg + "'");
      }
      return _results;
    };

    CommandContext.prototype.getRepresentation = function() {
      var args, commandArgs, scriptArgs;
      if (!this.command || !this.args.length) {
        return '';
      }
      commandArgs = this.options.cmdArgs != null ? this.quoteArguments(this.options.cmdArgs).join(' ') : '';
      args = this.args.length ? this.quoteArguments(this.args).join(' ') : '';
      scriptArgs = this.options.scriptArgs != null ? this.quoteArguments(this.options.scriptArgs).join(' ') : '';
      return this.command.trim() + (commandArgs ? ' ' + commandArgs : '') + (args ? ' ' + args : '') + (scriptArgs ? ' ' + scriptArgs : '');
    };

    return CommandContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvY29tbWFuZC1jb250ZXh0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUFiLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO2dDQUNKOztBQUFBLDZCQUFBLE9BQUEsR0FBUyxJQUFULENBQUE7O0FBQUEsNkJBQ0EsZ0JBQUEsR0FBa0IsSUFEbEIsQ0FBQTs7QUFBQSw2QkFFQSxJQUFBLEdBQU0sRUFGTixDQUFBOztBQUFBLDZCQUdBLE9BQUEsR0FBUyxFQUhULENBQUE7O0FBQUEsSUFLQSxjQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsV0FBdEIsR0FBQTtBQUNOLFVBQUEsc0RBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGNBQWpCLENBQUE7QUFBQSxNQUNBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFVBRHpCLENBQUE7QUFHQTtBQUNFLFFBQUEsSUFBTyx3QkFBSixJQUF1QixVQUFVLENBQUMsR0FBWCxLQUFrQixFQUE1QztBQUVFLFVBQUEsY0FBYyxDQUFDLE9BQWYsR0FBeUIsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFBLElBQWdDLFVBQVcsQ0FBQSxXQUFXLENBQUMsSUFBWixDQUFrQixDQUFBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLENBQUMsT0FBM0csQ0FGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFVBQVUsQ0FBQyxHQUFwQyxDQUpGO1NBQUE7QUFBQSxRQU1BLGNBQUEsR0FBaUIsVUFBVyxDQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWtCLENBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/command-context.coffee
