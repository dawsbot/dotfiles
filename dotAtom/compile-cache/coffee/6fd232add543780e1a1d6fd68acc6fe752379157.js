(function() {
  var AutoIndent, CompositeDisposable, INTERFILESAVETIME, LB, autoCompleteJSX;

  CompositeDisposable = require('atom').CompositeDisposable;

  autoCompleteJSX = require('./auto-complete-jsx');

  AutoIndent = require('./auto-indent');

  INTERFILESAVETIME = 1000;

  LB = 'language-babel';

  module.exports = {
    config: require('./config'),
    activate: function(state) {
      if (this.transpiler == null) {
        this.transpiler = new (require('./transpiler'));
      }
      this.disposable = new CompositeDisposable;
      this.textEditors = {};
      this.fileSaveTimes = {};
      this.disposable.add(atom.packages.onDidActivatePackage(this.isPackageCompatible));
      this.disposable.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.transpiler.stopUnusedTasks();
        };
      })(this)));
      return this.disposable.add(atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          _this.textEditors[textEditor.id] = new CompositeDisposable;
          _this.textEditors[textEditor.id].add(textEditor.observeGrammar(function(grammar) {
            var _ref, _ref1, _ref2;
            if (textEditor.getGrammar().packageName === LB) {
              return _this.textEditors[textEditor.id].autoIndent = new AutoIndent(textEditor);
            } else {
              if ((_ref = _this.textEditors[textEditor.id]) != null) {
                if ((_ref1 = _ref.autoIndent) != null) {
                  _ref1.destroy();
                }
              }
              return delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
            }
          }));
          _this.textEditors[textEditor.id].add(textEditor.onDidSave(function(event) {
            var filePath, lastSaveTime, _ref;
            if (textEditor.getGrammar().packageName === LB) {
              filePath = textEditor.getPath();
              lastSaveTime = (_ref = _this.fileSaveTimes[filePath]) != null ? _ref : 0;
              _this.fileSaveTimes[filePath] = Date.now();
              if (lastSaveTime < (_this.fileSaveTimes[filePath] - INTERFILESAVETIME)) {
                return _this.transpiler.transpile(filePath, textEditor);
              }
            }
          }));
          return _this.textEditors[textEditor.id].add(textEditor.onDidDestroy(function() {
            var filePath, _ref, _ref1, _ref2;
            if ((_ref = _this.textEditors[textEditor.id]) != null) {
              if ((_ref1 = _ref.autoIndent) != null) {
                _ref1.destroy();
              }
            }
            delete (((_ref2 = _this.textEditors[textEditor.id]) != null ? _ref2.autoIndent : void 0) != null);
            filePath = textEditor.getPath();
            if (_this.fileSaveTimes[filePath] != null) {
              delete _this.fileSaveTimes[filePath];
            }
            _this.textEditors[textEditor.id].dispose();
            return delete _this.textEditors[textEditor.id];
          }));
        };
      })(this)));
    },
    deactivate: function() {
      var disposeable, id, _ref;
      this.disposable.dispose();
      _ref = this.textEditors;
      for (id in _ref) {
        disposeable = _ref[id];
        if (this.textEditors[id].autoIndent != null) {
          this.textEditors[id].autoIndent.destroy();
          delete this.textEditors[id].autoIndent;
        }
        disposeable.dispose();
      }
      this.transpiler.stopAllTranspilerTask();
      return this.transpiler.disposables.dispose();
    },
    isPackageCompatible: function(activatedPackage) {
      var incompatiblePackage, incompatiblePackages, reason, _results;
      incompatiblePackages = {
        'source-preview-babel': "Both vie to preview the same file.",
        'source-preview-react': "Both vie to preview the same file.",
        'react': "The Atom community package 'react' (not to be confused \nwith Facebook React) monkey patches the atom methods \nthat provide autoindent features for JSX. \nAs it detects JSX scopes without regard to the grammar being used, \nit tries to auto indent JSX that is highlighted by language-babel. \nAs language-babel also attempts to do auto indentation using \nstandard atom API's, this creates a potential conflict."
      };
      _results = [];
      for (incompatiblePackage in incompatiblePackages) {
        reason = incompatiblePackages[incompatiblePackage];
        if (activatedPackage.name === incompatiblePackage) {
          _results.push(atom.notifications.addInfo('Incompatible Package Detected', {
            dismissable: true,
            detail: "language-babel has detected the presence of an incompatible Atom package named '" + activatedPackage.name + "'. \n \nIt is recommended that you disable either '" + activatedPackage.name + "' or language-babel \n \nReason:\n \n" + reason
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    JSXCompleteProvider: function() {
      return autoCompleteJSX;
    },
    provide: function() {
      return this.transpiler;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1RUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUZiLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixJQUpwQixDQUFBOztBQUFBLEVBS0EsRUFBQSxHQUFLLGdCQUxMLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsT0FBQSxDQUFRLFVBQVIsQ0FBUjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBOztRQUNSLElBQUMsQ0FBQSxhQUFjLEdBQUEsQ0FBQSxDQUFLLE9BQUEsQ0FBUSxjQUFSLENBQUQ7T0FBbkI7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELEdBQWMsR0FBQSxDQUFBLG1CQUZkLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFIZixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQUpqQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsVUFBVSxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBZCxDQUFtQyxJQUFDLENBQUEsbUJBQXBDLENBQWhCLENBTkEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxHQUFaLENBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/main.coffee
