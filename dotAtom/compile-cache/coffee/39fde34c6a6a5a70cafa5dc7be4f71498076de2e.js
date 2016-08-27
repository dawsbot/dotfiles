(function() {
  var CompositeDisposable, Emitter, ScriptInputView, ScriptOptionsView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  View = require('atom-space-pen-views').View;

  ScriptInputView = require('./script-input-view');

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div({
        "class": 'options-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, 'Configure Run Options');
          _this.table(function() {
            _this.tr(function() {
              _this.td({
                "class": 'first'
              }, function() {
                return _this.label('Current Working Directory:');
              });
              return _this.td({
                "class": 'second'
              }, function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCwd'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Command');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCommand'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Command Arguments:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputCommandArgs'
                });
              });
            });
            _this.tr(function() {
              _this.td(function() {
                return _this.label('Program Arguments:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
                  outlet: 'inputScriptArgs'
                });
              });
            });
            return _this.tr(function() {
              _this.td(function() {
                return _this.label('Environment Variables:');
              });
              return _this.td(function() {
                return _this.tag('atom-text-editor', {
                  mini: '',
                  "class": 'editor mini',
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
              outlet: 'buttonCancel',
              click: 'close'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'right-buttons'
            }, function() {
              _this.button({
                "class": "btn " + css + " save-profile",
                outlet: 'buttonSaveProfile',
                click: 'saveProfile'
              }, function() {
                return _this.span({
                  "class": 'icon icon-file-text'
                }, 'Save as profile');
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
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:close-options': (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this),
        'script:run-options': (function(_this) {
          return function() {
            if (_this.panel.isVisible()) {
              return _this.hide();
            } else {
              return _this.show();
            }
          };
        })(this),
        'script:save-options': (function(_this) {
          return function() {
            return _this.saveOptions();
          };
        })(this)
      }));
      this.find('atom-text-editor').on('keydown', (function(_this) {
        return function(e) {
          var row;
          if (!(e.keyCode === 9 || e.keyCode === 13)) {
            return true;
          }
          switch (e.keyCode) {
            case 9:
              e.preventDefault();
              e.stopPropagation();
              row = _this.find(e.target).parents('tr:first').nextAll('tr:first');
              if (row.length) {
                return row.find('atom-text-editor').focus();
              } else {
                return _this.buttonCancel.focus();
              }
              break;
            case 13:
              return _this.run();
          }
        };
      })(this));
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      return this.panel.hide();
    };

    ScriptOptionsView.prototype.splitArgs = function(element) {
      var args, argument, item, match, matches, part, regex, regexps, replacer, replaces, split, _i, _j, _k, _len, _len1, _len2, _results;
      args = element.get(0).getModel().getText().trim();
      if (args.indexOf('"') === -1 && args.indexOf("'") === -1) {
        return (function() {
          var _i, _len, _ref1, _results;
          _ref1 = args.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (item !== '') {
              _results.push(item);
            }
          }
          return _results;
        })();
      }
      replaces = {};
      regexps = [/"[^"]*"/ig, /'[^']*'/ig];
      for (_i = 0, _len = regexps.length; _i < _len; _i++) {
        regex = regexps[_i];
        matches = (matches != null ? matches : []).concat((args.match(regex)) || []);
      }
      for (_j = 0, _len1 = matches.length; _j < _len1; _j++) {
        match = matches[_j];
        replaces['`#match' + (Object.keys(replaces).length + 1) + '`'] = match;
      }
      for (match in replaces) {
        part = replaces[match];
        args = args.replace(new RegExp(part, 'g'), match);
      }
      split = (function() {
        var _k, _len2, _ref1, _results;
        _ref1 = args.split(' ');
        _results = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          item = _ref1[_k];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      })();
      replacer = function(argument) {
        var replacement;
        for (match in replaces) {
          replacement = replaces[match];
          argument = argument.replace(match, replacement);
        }
        return argument;
      };
      _results = [];
      for (_k = 0, _len2 = split.length; _k < _len2; _k++) {
        argument = split[_k];
        _results.push(replacer(argument).replace(/"|'/g, ''));
      }
      return _results;
    };

    ScriptOptionsView.prototype.getOptions = function() {
      return {
        workingDirectory: this.inputCwd.get(0).getModel().getText(),
        cmd: this.inputCommand.get(0).getModel().getText(),
        cmdArgs: this.splitArgs(this.inputCommandArgs),
        env: this.inputEnv.get(0).getModel().getText(),
        scriptArgs: this.splitArgs(this.inputScriptArgs)
      };
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var key, value, _ref1, _results;
      _ref1 = this.getOptions();
      _results = [];
      for (key in _ref1) {
        value = _ref1[key];
        _results.push(this.runOptions[key] = value);
      }
      return _results;
    };

    ScriptOptionsView.prototype.onProfileSave = function(callback) {
      return this.emitter.on('on-profile-save', callback);
    };

    ScriptOptionsView.prototype.saveProfile = function() {
      var inputView, options;
      this.hide();
      options = this.getOptions();
      inputView = new ScriptInputView({
        caption: 'Enter profile name:'
      });
      inputView.onCancel((function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      inputView.onConfirm((function(_this) {
        return function(profileName) {
          var editor, _i, _len, _ref1;
          if (!profileName) {
            return;
          }
          _ref1 = _this.find('atom-text-editor');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            editor = _ref1[_i];
            editor.getModel().setText('');
          }
          _this.saveOptions();
          return _this.emitter.emit('on-profile-save', {
            name: profileName,
            options: options
          });
        };
      })(this));
      return inputView.show();
    };

    ScriptOptionsView.prototype.close = function() {
      return this.hide();
    };

    ScriptOptionsView.prototype.destroy = function() {
      var _ref1;
      return (_ref1 = this.subscriptions) != null ? _ref1.dispose() : void 0;
    };

    ScriptOptionsView.prototype.show = function() {
      this.panel.show();
      return this.inputCwd.focus();
    };

    ScriptOptionsView.prototype.hide = function() {
      this.panel.hide();
      return atom.workspace.getActivePane().activate();
    };

    ScriptOptionsView.prototype.run = function() {
      this.saveOptions();
      this.hide();
      return atom.commands.dispatch(this.workspaceView(), 'script:run');
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUF0QixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxxQkFBUixDQUZsQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO09BQUwsRUFBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMxQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxlQUFQO1dBQUwsRUFBNkIsdUJBQTdCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxTQUFBLEdBQUE7QUFDTCxZQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksU0FBQSxHQUFBO0FBQ0YsY0FBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLE9BQVA7ZUFBSixFQUFvQixTQUFBLEdBQUE7dUJBQUcsS0FBQyxDQUFBLEtBQUQsQ0FBTyw0QkFBUCxFQUFIO2NBQUEsQ0FBcEIsQ0FBQSxDQUFBO3FCQUNBLEtBQUMsQ0FBQSxFQUFE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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-options-view.coffee
