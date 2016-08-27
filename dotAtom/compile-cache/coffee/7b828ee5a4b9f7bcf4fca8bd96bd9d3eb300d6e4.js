(function() {
  var Command, CommandError, CompositeDisposable, Disposable, Emitter, ExState, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  Command = require('./command');

  CommandError = require('./command-error');

  ExState = (function() {
    function ExState(editorElement, globalExState) {
      this.editorElement = editorElement;
      this.globalExState = globalExState;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.editor = this.editorElement.getModel();
      this.opStack = [];
      this.history = [];
      this.registerOperationCommands({
        open: (function(_this) {
          return function(e) {
            return new Command(_this.editor, _this);
          };
        })(this)
      });
    }

    ExState.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    ExState.prototype.getExHistoryItem = function(index) {
      return this.globalExState.commandHistory[index];
    };

    ExState.prototype.pushExHistory = function(command) {
      return this.globalExState.commandHistory.unshift(command);
    };

    ExState.prototype.registerOperationCommands = function(commands) {
      var commandName, fn, _results;
      _results = [];
      for (commandName in commands) {
        fn = commands[commandName];
        _results.push((function(_this) {
          return function(fn) {
            var pushFn;
            pushFn = function(e) {
              return _this.pushOperations(fn(e));
            };
            return _this.subscriptions.add(atom.commands.add(_this.editorElement, "ex-mode:" + commandName, pushFn));
          };
        })(this)(fn));
      }
      return _results;
    };

    ExState.prototype.onDidFailToExecute = function(fn) {
      return this.emitter.on('failed-to-execute', fn);
    };

    ExState.prototype.onDidProcessOpStack = function(fn) {
      return this.emitter.on('processed-op-stack', fn);
    };

    ExState.prototype.pushOperations = function(operations) {
      this.opStack.push(operations);
      if (this.opStack.length === 2) {
        return this.processOpStack();
      }
    };

    ExState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    ExState.prototype.processOpStack = function() {
      var command, e, input, _ref1;
      _ref1 = this.opStack, command = _ref1[0], input = _ref1[1];
      if (input.characters.length > 0) {
        this.history.unshift(command);
        try {
          command.execute(input);
        } catch (_error) {
          e = _error;
          if (e instanceof CommandError) {
            atom.notifications.addError("Command error: " + e.message);
            this.emitter.emit('failed-to-execute');
          } else {
            throw e;
          }
        }
      }
      this.clearOpStack();
      return this.emitter.emit('processed-op-stack');
    };

    ExState.prototype.getSelections = function() {
      var filtered, id, selection, _ref1;
      filtered = {};
      _ref1 = this.editor.getSelections();
      for (id in _ref1) {
        selection = _ref1[id];
        if (!selection.isEmpty()) {
          filtered[id] = selection;
        }
      }
      return filtered;
    };

    return ExState;

  })();

  module.exports = ExState;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LXN0YXRlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4RUFBQTs7QUFBQSxFQUFBLE9BQTZDLE9BQUEsQ0FBUSxXQUFSLENBQTdDLEVBQUMsZUFBQSxPQUFELEVBQVUsa0JBQUEsVUFBVixFQUFzQiwyQkFBQSxtQkFBdEIsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUZWLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUtNO0FBQ1MsSUFBQSxpQkFBRSxhQUFGLEVBQWtCLGFBQWxCLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxnQkFBQSxhQUNiLENBQUE7QUFBQSxNQUQ0QixJQUFDLENBQUEsZ0JBQUEsYUFDN0IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxRQUFmLENBQUEsQ0FGVixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSFgsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxFQUpYLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSx5QkFBRCxDQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLENBQUQsR0FBQTttQkFBVyxJQUFBLE9BQUEsQ0FBUSxLQUFDLENBQUEsTUFBVCxFQUFpQixLQUFqQixFQUFY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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex-state.coffee
