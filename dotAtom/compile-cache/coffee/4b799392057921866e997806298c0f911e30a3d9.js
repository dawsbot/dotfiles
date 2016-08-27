(function() {
  var CompositeDisposable, ScriptOptionsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top panel options-view',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            _this.table(function() {
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Current Working Directory:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCwd'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Command');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCommand'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Command Arguments:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCommandArgs'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Program Arguments:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputScriptArgs'
                  });
                });
              });
              return _this.tr(function() {
                _this.td(function() {
                  return _this.label('Environment Variables:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputEnv'
                  });
                });
              });
            });
            return _this.div({
              "class": 'block buttons'
            }, function() {
              var css;
              css = 'btn inline-block-tight';
              _this.button({
                "class": "btn " + css + " cancel",
                click: 'close'
              }, function() {
                return _this.span({
                  "class": 'icon icon-x'
                }, 'Cancel');
              });
              return _this.button({
                "class": "btn " + css + " run",
                outlet: 'buttonRun',
                click: 'run'
              }, function() {
                return _this.span({
                  "class": 'icon icon-playback-play'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:close-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:run-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions();
          };
        })(this),
        'script:save-options': (function(_this) {
          return function() {
            return _this.saveOptions();
          };
        })(this)
      }));
      atom.workspace.addTopPanel({
        item: this
      });
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.toggleScriptOptions = function(command) {
      switch (command) {
        case 'show':
          this.scriptOptionsView.show();
          return this.inputCwd.focus();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          this.scriptOptionsView.toggle();
          if (this.scriptOptionsView.is(':visible')) {
            return this.inputCwd.focus();
          }
      }
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var splitArgs;
      splitArgs = function(element) {
        var item, _i, _len, _ref, _results;
        _ref = element.val().split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      };
      this.runOptions.workingDirectory = this.inputCwd.val();
      this.runOptions.cmd = this.inputCommand.val();
      this.runOptions.cmdArgs = splitArgs(this.inputCommandArgs);
      this.runOptions.env = this.inputEnv.val();
      return this.runOptions.scriptArgs = splitArgs(this.inputScriptArgs);
    };

    ScriptOptionsView.prototype.close = function() {
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    ScriptOptionsView.prototype.run = function() {
      this.saveOptions();
      this.toggleScriptOptions('hide');
      return atom.commands.dispatch(this.workspaceView(), 'script:run');
    };

    ScriptOptionsView.prototype.traverseFocus = function(e) {
      var row;
      if (e.keyCode !== 9) {
        return true;
      }
      row = this.find(e.target).parents('tr:first').nextAll('tr:first');
      if (row.length) {
        return row.find('input').focus();
      } else {
        return this.buttonRun.focus();
      }
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxxQ0FBUDtBQUFBLFlBQThDLE1BQUEsRUFBUSxtQkFBdEQ7V0FBTCxFQUFnRixTQUFBLEdBQUE7QUFDOUUsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLHVCQUE3QixDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBQSxHQUFBO0FBQ0wsY0FBQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUEsR0FBQTtBQUNGLGdCQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQSxHQUFBO3lCQUFHLEtBQUMsQ0FBQSxLQUFELENBQU8sNEJBQVAsRUFBSDtnQkFBQSxDQUFKLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUEsR0FBQTt5QkFDRixLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-options-view.coffee
