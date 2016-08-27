(function() {
  var BufferedProcess, Emitter, Runner, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, BufferedProcess = _ref.BufferedProcess;

  module.exports = Runner = (function() {
    Runner.prototype.bufferedProcess = null;

    function Runner(scriptOptions, emitter) {
      this.scriptOptions = scriptOptions;
      this.emitter = emitter != null ? emitter : new Emitter;
      this.createOnErrorFunc = __bind(this.createOnErrorFunc, this);
      this.onExit = __bind(this.onExit, this);
      this.stderrFunc = __bind(this.stderrFunc, this);
      this.stdoutFunc = __bind(this.stdoutFunc, this);
    }

    Runner.prototype.run = function(command, extraArgs, codeContext, inputString) {
      var args, exit, options, stderr, stdout;
      if (inputString == null) {
        inputString = null;
      }
      this.startTime = new Date();
      args = this.args(codeContext, extraArgs);
      options = this.options();
      stdout = this.stdoutFunc;
      stderr = this.stderrFunc;
      exit = this.onExit;
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }
      return this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    };

    Runner.prototype.stdoutFunc = function(output) {
      return this.emitter.emit('did-write-to-stdout', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStdout = function(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    };

    Runner.prototype.stderrFunc = function(output) {
      return this.emitter.emit('did-write-to-stderr', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStderr = function(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    };

    Runner.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Runner.prototype.getCwd = function() {
      var cwd, paths, workingDirectoryProvided;
      cwd = this.scriptOptions.workingDirectory;
      workingDirectoryProvided = (cwd != null) && cwd !== '';
      paths = atom.project.getPaths();
      if (!workingDirectoryProvided && (paths != null ? paths.length : void 0) > 0) {
        cwd = paths[0];
      }
      return cwd;
    };

    Runner.prototype.stop = function() {
      if (this.bufferedProcess != null) {
        this.bufferedProcess.kill();
        return this.bufferedProcess = null;
      }
    };

    Runner.prototype.onExit = function(returnCode) {
      var executionTime;
      this.bufferedProcess = null;
      if ((atom.config.get('script.enableExecTime')) === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }
      return this.emitter.emit('did-exit', {
        executionTime: executionTime,
        returnCode: returnCode
      });
    };

    Runner.prototype.onDidExit = function(callback) {
      return this.emitter.on('did-exit', callback);
    };

    Runner.prototype.createOnErrorFunc = function(command) {
      return (function(_this) {
        return function(nodeError) {
          _this.bufferedProcess = null;
          _this.emitter.emit('did-not-run', {
            command: command
          });
          return nodeError.handle();
        };
      })(this);
    };

    Runner.prototype.onDidNotRun = function(callback) {
      return this.emitter.on('did-not-run', callback);
    };

    Runner.prototype.options = function() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    };

    Runner.prototype.args = function(codeContext, extraArgs) {
      var args;
      args = (this.scriptOptions.cmdArgs.concat(extraArgs)).concat(this.scriptOptions.scriptArgs);
      if ((this.scriptOptions.cmd == null) || this.scriptOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    };

    return Runner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBNkIsT0FBQSxDQUFRLE1BQVIsQ0FBN0IsRUFBQyxlQUFBLE9BQUQsRUFBVSx1QkFBQSxlQUFWLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0oscUJBQUEsZUFBQSxHQUFpQixJQUFqQixDQUFBOztBQU1hLElBQUEsZ0JBQUUsYUFBRixFQUFrQixPQUFsQixHQUFBO0FBQTBDLE1BQXpDLElBQUMsQ0FBQSxnQkFBQSxhQUF3QyxDQUFBO0FBQUEsTUFBekIsSUFBQyxDQUFBLDRCQUFBLFVBQVUsR0FBQSxDQUFBLE9BQWMsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQTFDO0lBQUEsQ0FOYjs7QUFBQSxxQkFRQSxHQUFBLEdBQUssU0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixXQUFyQixFQUFrQyxXQUFsQyxHQUFBO0FBQ0gsVUFBQSxtQ0FBQTs7UUFEcUMsY0FBYztPQUNuRDtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxJQUFBLENBQUEsQ0FBakIsQ0FBQTtBQUFBLE1BRUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFELENBQU0sV0FBTixFQUFtQixTQUFuQixDQUZQLENBQUE7QUFBQSxNQUdBLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBRCxDQUFBLENBSFYsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxVQUpWLENBQUE7QUFBQSxNQUtBLE1BQUEsR0FBUyxJQUFDLENBQUEsVUFMVixD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/runner.coffee
