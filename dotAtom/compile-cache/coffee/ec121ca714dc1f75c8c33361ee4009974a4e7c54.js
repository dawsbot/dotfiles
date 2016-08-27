(function() {
  var CodeContextBuilder, CompositeDisposable, GrammarUtils, Runner, Runtime, ScriptOptions, ScriptOptionsView, ScriptProfileRunView, ScriptView, ViewRuntimeObserver;

  CodeContextBuilder = require('./code-context-builder');

  GrammarUtils = require('./grammar-utils');

  Runner = require('./runner');

  Runtime = require('./runtime');

  ScriptOptions = require('./script-options');

  ScriptOptionsView = require('./script-options-view');

  ScriptProfileRunView = require('./script-profile-run-view');

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
      ignoreSelection: {
        title: 'Ignore selection (file-based runs only)',
        type: 'boolean',
        "default": false
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
    scriptProfileRunView: null,
    scriptOptions: null,
    scriptProfiles: [],
    activate: function(state) {
      var codeContextBuilder, observer, profile, runner, so, _i, _len, _ref;
      this.scriptView = new ScriptView(state.scriptViewState);
      this.scriptOptions = new ScriptOptions();
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      this.scriptProfiles = [];
      if (state.profiles) {
        _ref = state.profiles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          profile = _ref[_i];
          so = ScriptOptions.createFromOptions(profile.name, profile);
          this.scriptProfiles.push(so);
        }
      }
      this.scriptProfileRunView = new ScriptProfileRunView(this.scriptProfiles);
      codeContextBuilder = new CodeContextBuilder;
      runner = new Runner(this.scriptOptions);
      observer = new ViewRuntimeObserver(this.scriptView);
      this.runtime = new Runtime(runner, codeContextBuilder, [observer]);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
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
      this.scriptOptionsView.onProfileSave((function(_this) {
        return function(profileData) {
          var codeContext, desc, opts;
          profile = ScriptOptions.createFromOptions(profileData.name, profileData.options);
          codeContext = _this.runtime.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), "Selection Based");
          profile.lang = codeContext.lang;
          opts = profile.toObject();
          desc = "Language: " + codeContext.lang;
          if (opts.cmd) {
            desc += ", Command: " + opts.cmd;
          }
          if (opts.cmdArgs && opts.cmd) {
            desc += " " + (opts.cmdArgs.join(' '));
          }
          profile.description = desc;
          _this.scriptProfiles.push(profile);
          _this.scriptOptionsView.hide();
          _this.scriptProfileRunView.show();
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      this.scriptProfileRunView.onProfileDelete((function(_this) {
        return function(profile) {
          var index;
          index = _this.scriptProfiles.indexOf(profile);
          if (index === -1) {
            return;
          }
          if (index !== -1) {
            _this.scriptProfiles.splice(index, 1);
          }
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      this.scriptProfileRunView.onProfileChange((function(_this) {
        return function(data) {
          var index;
          index = _this.scriptProfiles.indexOf(data.profile);
          if (!(index !== -1 && (_this.scriptProfiles[index][data.key] != null))) {
            return;
          }
          _this.scriptProfiles[index][data.key] = data.value;
          _this.scriptProfileRunView.show();
          return _this.scriptProfileRunView.setProfiles(_this.scriptProfiles);
        };
      })(this));
      return this.scriptProfileRunView.onProfileRun((function(_this) {
        return function(profile) {
          if (!profile) {
            return;
          }
          return _this.runtime.execute('Selection Based', null, profile);
        };
      })(this));
    },
    deactivate: function() {
      this.runtime.destroy();
      this.scriptView.removePanel();
      this.scriptOptionsView.close();
      this.scriptProfileRunView.close();
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
      var profile, serializedProfiles, _i, _len, _ref;
      serializedProfiles = [];
      _ref = this.scriptProfiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        profile = _ref[_i];
        serializedProfiles.push(profile.toObject());
      }
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize(),
        profiles: serializedProfiles
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrSkFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSx3QkFBUixDQUFyQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsdUJBQVIsQ0FMcEIsQ0FBQTs7QUFBQSxFQU1BLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwyQkFBUixDQU52QixDQUFBOztBQUFBLEVBT0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBUGIsQ0FBQTs7QUFBQSxFQVFBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5QkFBUixDQVJ0QixDQUFBOztBQUFBLEVBVUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQVZELENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLCtDQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7T0FERjtBQUFBLE1BSUEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLDRCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script.coffee
