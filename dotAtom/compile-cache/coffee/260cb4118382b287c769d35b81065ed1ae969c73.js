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
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.destroy();
        };
      })(this));
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input) {
      var codeContext, commandContext;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      if (atom.config.get('script.stopOnRerun')) {
        this.stop();
      }
      this.emitter.emit('start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if (codeContext.lang == null) {
        return;
      }
      commandContext = CommandContext.build(this, this.scriptOptions, codeContext);
      if (!commandContext) {
        return;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      this.runner.run(commandContext.command, commandContext.args, codeContext, input);
      return this.emitter.emit('started');
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
