(function() {
  var CommandContext, Emitter, Runtime, _;

  CommandContext = require('./command-context');

  _ = require('underscore');

  Emitter = require('atom').Emitter;

  module.exports = Runtime = (function() {
    Runtime.prototype.observers = [];

    function Runtime(runner, codeContextBuilder, observers, emitter) {
      this.runner = runner;
      this.codeContextBuilder = codeContextBuilder;
      this.observers = observers != null ? observers : [];
      this.emitter = emitter != null ? emitter : new Emitter;
      this.scriptOptions = this.runner.scriptOptions;
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.observe(_this);
        };
      })(this));
    }

    Runtime.prototype.addObserver = function(observer) {
      this.observers.push(observer);
      return observer.observe(this);
    };

    Runtime.prototype.destroy = function() {
      this.stop();
      this.runner.destroy();
      _.each(this.observers, function(observer) {
        return observer.destroy();
      });
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input, options) {
      var codeContext, commandContext, executionOptions;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      if (options == null) {
        options = null;
      }
      if (atom.config.get('script.stopOnRerun')) {
        this.stop();
      }
      this.emitter.emit('start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if (codeContext.lang == null) {
        return;
      }
      executionOptions = options ? options : this.scriptOptions;
      commandContext = CommandContext.build(this, executionOptions, codeContext);
      if (!commandContext) {
        return;
      }
      if (commandContext.workingDirectory != null) {
        executionOptions.workingDirectory = commandContext.workingDirectory;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      this.runner.scriptOptions = executionOptions;
      this.runner.run(commandContext.command, commandContext.args, codeContext, input);
      return this.emitter.emit('started', commandContext);
    };

    Runtime.prototype.stop = function() {
      this.emitter.emit('stop');
      this.runner.stop();
      return this.emitter.emit('stopped');
    };

    Runtime.prototype.onStart = function(callback) {
      return this.emitter.on('start', callback);
    };

    Runtime.prototype.onStarted = function(callback) {
      return this.emitter.on('started', callback);
    };

    Runtime.prototype.onStop = function(callback) {
      return this.emitter.on('stop', callback);
    };

    Runtime.prototype.onStopped = function(callback) {
      return this.emitter.on('stopped', callback);
    };

    Runtime.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportMode = function(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    };

    Runtime.prototype.onDidNotBuildArgs = function(callback) {
      return this.emitter.on('did-not-build-args', callback);
    };

    Runtime.prototype.onDidContextCreate = function(callback) {
      return this.emitter.on('did-context-create', callback);
    };

    Runtime.prototype.onDidWriteToStdout = function(callback) {
      return this.runner.onDidWriteToStdout(callback);
    };

    Runtime.prototype.onDidWriteToStderr = function(callback) {
      return this.runner.onDidWriteToStderr(callback);
    };

    Runtime.prototype.onDidExit = function(callback) {
      return this.runner.onDidExit(callback);
    };

    Runtime.prototype.onDidNotRun = function(callback) {
      return this.runner.onDidNotRun(callback);
    };

    Runtime.prototype.modeNotSupported = function(argType, lang) {
      return this.emitter.emit('did-not-support-mode', {
        argType: argType,
        lang: lang
      });
    };

    Runtime.prototype.didNotBuildArgs = function(error) {
      return this.emitter.emit('did-not-build-args', {
        error: error
      });
    };

    return Runtime;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvcnVudGltZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBRkosQ0FBQTs7QUFBQSxFQUlDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUpELENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0JBQUEsU0FBQSxHQUFXLEVBQVgsQ0FBQTs7QUFLYSxJQUFBLGlCQUFFLE1BQUYsRUFBVyxrQkFBWCxFQUFnQyxTQUFoQyxFQUFpRCxPQUFqRCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEscUJBQUEsa0JBQ3RCLENBQUE7QUFBQSxNQUQwQyxJQUFDLENBQUEsZ0NBQUEsWUFBWSxFQUN2RCxDQUFBO0FBQUEsTUFEMkQsSUFBQyxDQUFBLDRCQUFBLFVBQVUsR0FBQSxDQUFBLE9BQ3RFLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBekIsQ0FBQTtBQUFBLE1BQ0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsU0FBUixFQUFtQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7aUJBQWMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsS0FBakIsRUFBZDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CLENBREEsQ0FEVztJQUFBLENBTGI7O0FBQUEsc0JBZUEsV0FBQSxHQUFh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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/runtime.coffee
