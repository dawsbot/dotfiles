(function() {
  var BufferedProcess, Emitter, Runner, fs, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, BufferedProcess = _ref.BufferedProcess;

  fs = require('fs');

  path = require('path');

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
        try {
          cwd = fs.statSync(paths[0]).isDirectory() ? paths[0] : path.join(paths[0], '..');
        } catch (_error) {}
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

    Runner.prototype.fillVarsInArg = function(arg, codeContext, project_path) {
      if (codeContext.filepath != null) {
        arg = arg.replace(/{FILE_ACTIVE}/g, codeContext.filepath);
        arg = arg.replace(/{FILE_ACTIVE_PATH}/g, path.join(codeContext.filepath, '..'));
      }
      if (codeContext.filename != null) {
        arg = arg.replace(/{FILE_ACTIVE_NAME}/g, codeContext.filename);
        arg = arg.replace(/{FILE_ACTIVE_NAME_BASE}/g, path.join(codeContext.filename, '..'));
      }
      if (project_path != null) {
        arg = arg.replace(/{PROJECT_PATH}/g, project_path);
      }
      return arg;
    };

    Runner.prototype.args = function(codeContext, extraArgs) {
      var arg, args, paths, project_path;
      args = (this.scriptOptions.cmdArgs.concat(extraArgs)).concat(this.scriptOptions.scriptArgs);
      project_path = '';
      paths = atom.project.getPaths();
      if (paths.length > 0) {
        fs.stat(paths[0], function(err, stats) {
          if (!err) {
            return project_path = stats.isDirectory() ? paths[0] : path.join(paths[0], '..');
          }
        });
      }
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = args.length; _i < _len; _i++) {
          arg = args[_i];
          _results.push(this.fillVarsInArg(arg, codeContext, project_path));
        }
        return _results;
      }).call(this);
      if ((this.scriptOptions.cmd == null) || this.scriptOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    };

    return Runner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvcnVubmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnREFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBNkIsT0FBQSxDQUFRLE1BQVIsQ0FBN0IsRUFBQyxlQUFBLE9BQUQsRUFBVSx1QkFBQSxlQUFWLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixxQkFBQSxlQUFBLEdBQWlCLElBQWpCLENBQUE7O0FBTWEsSUFBQSxnQkFBRSxhQUFGLEVBQWtCLE9BQWxCLEdBQUE7QUFBMEMsTUFBekMsSUFBQyxDQUFBLGdCQUFBLGFBQXdDLENBQUE7QUFBQSxNQUF6QixJQUFDLENBQUEsNEJBQUEsVUFBVSxHQUFBLENBQUEsT0FBYyxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEscURBQUEsQ0FBMUM7SUFBQSxDQU5iOztBQUFBLHFCQVFBLEdBQUEsR0FBSyxTQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLFdBQXJCLEVBQWtDLFdBQWxDLEdBQUE7QUFDSCxVQUFBLG1DQUFBOztRQURxQyxjQUFjO09BQ25EO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLElBQUEsQ0FBQSxDQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLElBQUQsQ0FBTSxXQUFOLEVBQW1CLFNBQW5CLENBRlAsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFE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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/runner.coffee
