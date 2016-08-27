(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, k, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes, v, _ref;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  _ref = atom.config.get('emmet.stylus');
  for (k in _ref) {
    v = _ref[k];
    emmet.preferences.set('stylus.' + k, v);
  }

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (!atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref1, _results;
    _ref1 = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      name = _ref1[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref1;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref1 = emmetActions.getList();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          action = _ref1[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2VtbWV0L2xpYi9lbW1ldC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNFJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBSUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBSlIsQ0FBQTs7QUFBQSxFQUtBLFlBQUEsR0FBZSxPQUFBLENBQVEsdUJBQVIsQ0FMZixDQUFBOztBQUFBLEVBTUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSw0QkFBUixDQU5aLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSLENBUmYsQ0FBQTs7QUFBQSxFQVdBLHNCQUFBLEdBQXlCLENBQ3ZCLGlCQUR1QixFQUNKLGlCQURJLEVBQ2UsYUFEZixFQUV2QixtQkFGdUIsRUFFRixrQkFGRSxFQUVrQixzQkFGbEIsRUFHdkIsd0JBSHVCLEVBR0csWUFISCxDQVh6QixDQUFBOztBQUFBLEVBaUJBLHFCQUFBLEdBQXdCLENBQUMsTUFBRCxFQUFTLEtBQVQsRUFBZ0IsTUFBaEIsRUFBd0IsTUFBeEIsQ0FqQnhCLENBQUE7O0FBbUJBO0FBQUEsT0FBQSxTQUFBO2dCQUFBO0FBQ0ksSUFBQSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQWxCLENBQXNCLFNBQUEsR0FBWSxDQUFsQyxFQUFxQyxDQUFyQyxDQUFBLENBREo7QUFBQSxHQW5CQTs7QUFBQSxFQXNCQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osSUFBQSxJQUFHLE9BQU8sQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/emmet/lib/emmet.coffee
