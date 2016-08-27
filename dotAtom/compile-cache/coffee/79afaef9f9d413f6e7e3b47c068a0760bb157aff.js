(function() {
  var CodeContextBuilder, CompositeDisposable, GrammarUtils, Runner, Runtime, ScriptOptions, ScriptOptionsView, ScriptView, ViewRuntimeObserver;

  CodeContextBuilder = require('./code-context-builder');

  GrammarUtils = require('./grammar-utils');

  Runner = require('./runner');

  Runtime = require('./runtime');

  ScriptOptions = require('./script-options');

  ScriptOptionsView = require('./script-options-view');

  ScriptView = require('./script-view');

  ViewRuntimeObserver = require('./view-runtime-observer');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enableExecTime: {
        title: 'Output the time it took to execute the script',
        type: 'boolean',
        "default": true
      },
      escapeConsoleOutput: {
        title: 'HTML escape console output',
        type: 'boolean',
        "default": true
      },
      scrollWithOutput: {
        title: 'Scroll with output',
        type: 'boolean',
        "default": true
      },
      stopOnRerun: {
        title: 'Stop running process on rerun',
        type: 'boolean',
        "default": false
      }
    },
    scriptView: null,
    scriptOptionsView: null,
    scriptOptions: null,
    activate: function(state) {
      var codeContextBuilder, observer, runner;
      this.scriptView = new ScriptView(state.scriptViewState);
      this.scriptOptions = new ScriptOptions();
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      runner = new Runner(this.scriptOptions);
      observer = new ViewRuntimeObserver(this.scriptView);
      this.runtime = new Runtime(runner, codeContextBuilder, [observer]);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:close-view': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:copy-run-results': (function(_this) {
          return function() {
            return _this.scriptView.copyResults();
          };
        })(this),
        'script:kill-process': (function(_this) {
          return function() {
            return _this.runtime.stop();
          };
        })(this),
        'script:run-by-line-number': (function(_this) {
          return function() {
            return _this.runtime.execute('Line Number Based');
          };
        })(this),
        'script:run': (function(_this) {
          return function() {
            return _this.runtime.execute('Selection Based');
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.runtime.destroy();
      this.scriptView.removePanel();
      this.scriptOptionsView.close();
      this.subscriptions.dispose();
      return GrammarUtils.deleteTempFiles();
    },
    closeScriptViewAndStopRunner: function() {
      this.runtime.stop();
      return this.scriptView.removePanel();
    },
    provideDefaultRuntime: function() {
      return this.runtime;
    },
    provideBlankRuntime: function() {
      var codeContextBuilder, runner;
      runner = new Runner(new ScriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      return new Runtime(runner, codeContextBuilder, []);
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx5SUFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUFyQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FMcEIsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQU5iLENBQUE7O0FBQUEsRUFPQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FQdEIsQ0FBQTs7QUFBQSxFQVNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFURCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTywrQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUZUO09BREY7QUFBQSxNQUlBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyw0QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxJQUZUO09BTEY7QUFBQSxNQVFBLGdCQUFBLEVBQ0U7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script.coffee
