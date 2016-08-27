(function() {
  var Runner, ScriptOptions;

  Runner = require('../lib/runner');

  ScriptOptions = require('../lib/script-options');

  describe('Runner', function() {
    beforeEach(function() {
      this.command = 'node';
      this.runOptions = new ScriptOptions;
      this.runOptions.cmd = this.command;
      return this.runner = new Runner(this.runOptions);
    });
    afterEach(function() {
      return this.runner.destroy();
    });
    return describe('run', function() {
      it('with no input', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'hello\n'
            });
          };
        })(this));
      });
      it('with an input string', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./ioTest.js'], {}, 'hello');
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'TEST: hello\n'
            });
          };
        })(this));
      });
      it('exits', function() {
        runs((function(_this) {
          return function() {
            _this.exited = false;
            _this.runner.onDidExit(function() {
              return _this.exited = true;
            });
            return _this.runner.run(_this.command, ['./outputTest.js'], {});
          };
        })(this));
        return waitsFor((function(_this) {
          return function() {
            return _this.exited;
          };
        })(this), "Should receive exit callback", 500);
      });
      it('notifies about writing to stderr', function() {
        runs((function(_this) {
          return function() {
            _this.failedEvent = null;
            _this.runner.onDidWriteToStderr(function(event) {
              return _this.failedEvent = event;
            });
            return _this.runner.run(_this.command, ['./throw.js'], {});
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.failedEvent;
          };
        })(this), "Should receive failure callback", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.failedEvent.message).toMatch(/kaboom/);
          };
        })(this));
      });
      return it('terminates stdin', function() {
        runs((function(_this) {
          return function() {
            _this.output = null;
            _this.runner.onDidWriteToStdout(function(output) {
              return _this.output = output;
            });
            return _this.runner.run(_this.command, ['./stdinEndTest.js'], {}, 'unused input');
          };
        })(this));
        waitsFor((function(_this) {
          return function() {
            return _this.output !== null;
          };
        })(this), "File should execute", 500);
        return runs((function(_this) {
          return function() {
            return expect(_this.output).toEqual({
              message: 'stdin terminated\n'
            });
          };
        })(this));
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9zcGVjL3J1bm5lci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSx1QkFBUixDQURoQixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLGFBRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLEdBQWtCLElBQUMsQ0FBQSxPQUZuQixDQUFBO2FBR0EsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsVUFBUixFQUpMO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQU1BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxFQURRO0lBQUEsQ0FBVixDQU5BLENBQUE7V0FTQSxRQUFBLENBQVMsS0FBVCxFQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLEVBQUEsQ0FBRyxlQUFILEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLElBQUEsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNILFlBQUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/spec/runner-spec.coffee
