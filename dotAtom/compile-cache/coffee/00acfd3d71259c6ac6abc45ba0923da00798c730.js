(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorContext, ColorMarkerElement, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, scopeFromFileName, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  minimatch = require('minimatch');

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  _ref1 = require('./versions'), SERIALIZE_VERSION = _ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref1.SERIALIZE_MARKERS_VERSION;

  THEME_VARIABLES = require('./uris').THEME_VARIABLES;

  scopeFromFileName = require('./scope-from-file-name');

  ColorBuffer = require('./color-buffer');

  ColorContext = require('./color-context');

  ColorSearch = require('./color-search');

  Palette = require('./palette');

  PathsLoader = require('./paths-loader');

  PathsScanner = require('./paths-scanner');

  ColorMarkerElement = require('./color-marker-element');

  VariablesCollection = require('./variables-collection');

  ATOM_VARIABLES = ['text-color', 'text-color-subtle', 'text-color-highlight', 'text-color-selected', 'text-color-info', 'text-color-success', 'text-color-warning', 'text-color-error', 'background-color-info', 'background-color-success', 'background-color-warning', 'background-color-error', 'background-color-highlight', 'background-color-selected', 'app-background-color', 'base-background-color', 'base-border-color', 'pane-item-background-color', 'pane-item-border-color', 'input-background-color', 'input-border-color', 'tool-panel-background-color', 'tool-panel-border-color', 'inset-panel-background-color', 'inset-panel-border-color', 'panel-heading-background-color', 'panel-heading-border-color', 'overlay-background-color', 'overlay-border-color', 'button-background-color', 'button-background-color-hover', 'button-background-color-selected', 'button-border-color', 'tab-bar-background-color', 'tab-bar-border-color', 'tab-background-color', 'tab-background-color-active', 'tab-border-color', 'tree-view-background-color', 'tree-view-border-color', 'ui-site-color-1', 'ui-site-color-2', 'ui-site-color-3', 'ui-site-color-4', 'ui-site-color-5', 'syntax-text-color', 'syntax-cursor-color', 'syntax-selection-color', 'syntax-background-color', 'syntax-wrap-guide-color', 'syntax-indent-guide-color', 'syntax-invisible-character-color', 'syntax-result-marker-color', 'syntax-result-marker-color-selected', 'syntax-gutter-text-color', 'syntax-gutter-text-color-selected', 'syntax-gutter-background-color', 'syntax-gutter-background-color-selected', 'syntax-color-renamed', 'syntax-color-added', 'syntax-color-modified', 'syntax-color-removed'];

  compareArray = function(a, b) {
    var i, v, _i, _len;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion;
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if (atom.inDevMode() && atom.project.getPaths().some(function(p) {
        return p.match(/\/pigments$/);
      })) {
        markersVersion += '-dev';
      }
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, svgColorExpression, timestamp, variables;
      if (state == null) {
        state = {};
      }
      this.includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.bufferStates = buffers != null ? buffers : {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredBufferNames', (function(_this) {
        return function(ignoredBufferNames) {
          _this.ignoredBufferNames = ignoredBufferNames;
          return _this.updateColorBuffers();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', function(type) {
        if (type != null) {
          return ColorMarkerElement.setMarkerType(type);
        }
      }));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sassShadeAndTintImplementation', (function(_this) {
        return function() {
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      svgColorExpression = this.colorExpressionsRegistry.getExpression('pigments:named_colors');
      this.subscriptions.add(atom.config.observe('pigments.filetypesForColorWords', (function(_this) {
        return function(scopes) {
          svgColorExpression.scopes = scopes != null ? scopes : [];
          return _this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
            name: svgColorExpression.name,
            registry: _this.colorExpressionsRegistry
          });
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(_arg) {
          var name;
          name = _arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          return _this.variables.evaluateVariables(_this.variables.getVariables(), function() {
            var colorBuffer, id, _ref2, _results;
            _ref2 = _this.colorBuffersByEditorId;
            _results = [];
            for (id in _ref2) {
              colorBuffer = _ref2[id];
              _results.push(colorBuffer.update());
            }
            return _results;
          });
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      this.updateIgnoredFiletypes();
      if (this.paths != null) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = new Promise((function(_this) {
        return function(resolve) {
          return _this.variables.onceInitialized(resolve);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)).then((function(_this) {
        return function() {
          if (_this.includeThemes) {
            return _this.includeThemesVariables();
          }
        };
      })(this)).then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, _ref2;
      if (this.destroyed) {
        return;
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        buffer = _ref2[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, path, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return __indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
              path = dirtied[_i];
              if (__indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        project: this,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.setColorPickerAPI = function(colorPickerAPI) {
      this.colorPickerAPI = colorPickerAPI;
    };

    ColorProject.prototype.initializeBuffers = function() {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement, editorPath;
          editorPath = editor.getPath();
          if ((editorPath == null) || _this.isBufferIgnored(editorPath)) {
            return;
          }
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.hasColorBufferForEditor = function(editor) {
      if (this.destroyed || (editor == null)) {
        return false;
      }
      return this.colorBuffersByEditorId[editor.id] != null;
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.updateColorBuffers = function() {
      var buffer, bufferElement, e, editor, id, _i, _len, _ref2, _ref3, _results;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        buffer = _ref2[id];
        if (this.isBufferIgnored(buffer.editor.getPath())) {
          buffer.destroy();
          delete this.colorBuffersByEditorId[id];
        }
      }
      try {
        if (this.colorBuffersByEditorId != null) {
          _ref3 = atom.workspace.getTextEditors();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            editor = _ref3[_i];
            if (this.hasColorBufferForEditor(editor) || this.isBufferIgnored(editor.getPath())) {
              continue;
            }
            buffer = this.colorBufferForEditor(editor);
            if (buffer != null) {
              bufferElement = atom.views.getView(buffer);
              _results.push(bufferElement.attach());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };

    ColorProject.prototype.isBufferIgnored = function(path) {
      var source, sources, _i, _len, _ref2;
      path = atom.project.relativize(path);
      sources = (_ref2 = this.ignoredBufferNames) != null ? _ref2 : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
      return false;
    };

    ColorProject.prototype.getPaths = function() {
      var _ref2;
      return (_ref2 = this.paths) != null ? _ref2.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.hasPath = function(path) {
      var _ref2;
      return __indexOf.call((_ref2 = this.paths) != null ? _ref2 : [], path) >= 0;
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, rootPaths, _ref2;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (_ref2 = _this.paths) != null ? _ref2 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, p, _i, _len;
            for (_i = 0, _len = knownPaths.length; _i < _len; _i++) {
              p = knownPaths[_i];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, p, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return __indexOf.call(removed, p) < 0;
          });
          for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
            p = dirtied[_i];
            if (__indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var source, sources, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.scopeFromFileName = function(path) {
      var scope;
      scope = scopeFromFileName(path);
      if (scope === 'sass' || scope === 'scss') {
        scope = [scope, this.getSassScopeSuffix()].join(':');
      }
      return scope;
    };

    ColorProject.prototype.getPalette = function() {
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange;
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return __indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        return PathsScanner.startTask(paths.map((function(_this) {
          return function(p) {
            return [p, _this.scopeFromFileName(p)];
          };
        })(this)), this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSassScopeSuffix = function() {
      var _ref2, _ref3;
      return (_ref2 = (_ref3 = this.sassShadeAndTintImplementation) != null ? _ref3 : atom.config.get('pigments.sassShadeAndTintImplementation')) != null ? _ref2 : 'compass';
    };

    ColorProject.prototype.setSassShadeAndTintImplementation = function(sassShadeAndTintImplementation) {
      this.sassShadeAndTintImplementation = sassShadeAndTintImplementation;
      return this.colorExpressionsRegistry.emitter.emit('did-update-expressions', {
        registry: this.colorExpressionsRegistry
      });
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, _ref2, _ref3;
      names = ['.pigments'];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((_ref3 = atom.config.get('pigments.sourceNames')) != null ? _ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, _ref2, _ref3, _ref4, _ref5;
      names = [];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      names = names.concat((_ref3 = this.searchNames) != null ? _ref3 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((_ref4 = atom.config.get('pigments.sourceNames')) != null ? _ref4 : []);
        names = names.concat((_ref5 = atom.config.get('pigments.extendedSearchNames')) != null ? _ref5 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, _ref2, _ref3, _ref4;
      names = (_ref2 = this.ignoredNames) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((_ref3 = this.getGlobalIgnoredNames()) != null ? _ref3 : []);
        names = names.concat((_ref4 = atom.config.get('core.ignoredNames')) != null ? _ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var _ref2;
      return (_ref2 = atom.config.get('pigments.ignoredNames')) != null ? _ref2.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames) {
      this.ignoredNames = ignoredNames != null ? ignoredNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return Promise.reject('Project is not initialized yet');
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var scopes, _ref2, _ref3;
      scopes = (_ref2 = this.ignoredScopes) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((_ref3 = atom.config.get('pigments.ignoredScopes')) != null ? _ref3 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, scopes, _ref2, _ref3;
      filetypes = (_ref2 = this.supportedFiletypes) != null ? _ref2 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((_ref3 = atom.config.get('pigments.supportedFiletypes')) != null ? _ref3 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var _ref4;
        return (_ref4 = atom.grammars.selectGrammar("file." + ext)) != null ? _ref4.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        return this.includeThemesVariables();
      } else {
        return this.disposeThemesVariables();
      }
    };

    ColorProject.prototype.includeThemesVariables = function() {
      this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          var variables;
          if (!_this.includeThemes) {
            return;
          }
          variables = _this.loadThemesVariables();
          return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
        };
      })(this));
      this.subscriptions.add(this.themesSubscription);
      return this.variables.addMany(this.loadThemesVariables());
    };

    ColorProject.prototype.disposeThemesVariables = function() {
      this.subscriptions.remove(this.themesSubscription);
      this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
      return this.themesSubscription.dispose();
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data;
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, _ref2;
      out = {};
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9jb2xvci1wcm9qZWN0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4U0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLE9BQXdDLE9BQUEsQ0FBUSxNQUFSLENBQXhDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsRUFBK0IsYUFBQSxLQUQvQixDQUFBOztBQUFBLEVBR0EsUUFBaUQsT0FBQSxDQUFRLFlBQVIsQ0FBakQsRUFBQywwQkFBQSxpQkFBRCxFQUFvQixrQ0FBQSx5QkFIcEIsQ0FBQTs7QUFBQSxFQUlDLGtCQUFtQixPQUFBLENBQVEsUUFBUixFQUFuQixlQUpELENBQUE7O0FBQUEsRUFLQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVIsQ0FMcEIsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FOZCxDQUFBOztBQUFBLEVBT0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQVBmLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUmQsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQVRWLENBQUE7O0FBQUEsRUFVQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBVmQsQ0FBQTs7QUFBQSxFQVdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FYZixDQUFBOztBQUFBLEVBWUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBWnJCLENBQUE7O0FBQUEsRUFhQSxtQkFBQSxHQUFzQixPQUFBLENBQVEsd0JBQVIsQ0Fi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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/color-project.coffee
