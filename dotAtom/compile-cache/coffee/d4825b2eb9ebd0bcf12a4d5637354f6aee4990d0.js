(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  ColorContext = require('./color-context');

  ColorExpression = require('./color-expression');

  Color = require('./color');

  registry = require('./color-expressions');

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      this.emitter = new Emitter;
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      this.dependencyGraph = {};
      this.initialize(state != null ? state.content : void 0);
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.onceInitialized = function(callback) {
      var disposable;
      if (callback == null) {
        return;
      }
      if (this.initialized) {
        return callback();
      } else {
        return disposable = this.emitter.on('did-initialize', function() {
          disposable.dispose();
          return callback();
        });
      }
    };

    VariablesCollection.prototype.initialize = function(content) {
      var iteration;
      if (content == null) {
        content = [];
      }
      iteration = (function(_this) {
        return function(cb) {
          var end, start, v;
          start = new Date;
          end = new Date;
          while (content.length > 0 && end - start < 100) {
            v = content.shift();
            _this.restoreVariable(v);
          }
          if (content.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          _this.initialized = true;
          return _this.emitter.emit('did-initialize');
        };
      })(this));
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var _ref;
      return (_ref = this.variablesByPath[path]) != null ? _ref : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var v, _i, _len, _ref;
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var p, res, _i, _len;
      res = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var _ref;
      return (_ref = this.findAll(properties)) != null ? _ref[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, _ref;
          if (((_ref = v[k]) != null ? _ref.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return __indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, path, pathsCollection, pathsToDestroy, remainingPaths, results, updated, v, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      pathsCollection = {};
      remainingPaths = [];
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        if (pathsCollection[_name = v.path] == null) {
          pathsCollection[_name] = [];
        }
        pathsCollection[v.path].push(v);
        if (_ref = v.path, __indexOf.call(remainingPaths, _ref) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        _ref1 = this.updatePathCollection(path, collection, true) || {}, created = _ref1.created, updated = _ref1.updated, destroyed = _ref1.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return __indexOf.call(remainingPaths, p) < 0;
        });
        for (_j = 0, _len1 = pathsToDestroy.length; _j < _len1; _j++) {
          path = pathsToDestroy[_j];
          _ref2 = this.updatePathCollection(path, collection, true) || {}, created = _ref2.created, updated = _ref2.updated, destroyed = _ref2.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((_ref3 = results.created) != null ? _ref3.length : void 0) === 0) {
        delete results.created;
      }
      if (((_ref4 = results.updated) != null ? _ref4.length : void 0) === 0) {
        delete results.updated;
      }
      if (((_ref5 = results.destroyed) != null ? _ref5.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        _ref6 = results.destroyed;
        for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
          v = _ref6[_k];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, pathCollection, results, status, v, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (_i = 0, _len = pathCollection.length; _i < _len; _i++) {
        v = pathCollection[_i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, status, _ref;
      if (batch == null) {
        batch = false;
      }
      _ref = this.getVariableStatus(variable), status = _ref[0], previousVariable = _ref[1];
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var res, results, status, v, variable, _i, _len;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, results, v, variable, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables, callback) {
      var iteration, remainingVariables, updated;
      updated = [];
      remainingVariables = variables.slice();
      iteration = (function(_this) {
        return function(cb) {
          var end, isColor, start, v, wasColor;
          start = new Date;
          end = new Date;
          while (remainingVariables.length > 0 && end - start < 100) {
            v = remainingVariables.shift();
            wasColor = v.isColor;
            _this.evaluateVariableColor(v, wasColor);
            isColor = v.isColor;
            if (isColor !== wasColor) {
              updated.push(v);
              if (isColor) {
                _this.buildDependencyGraph(v);
              }
              end = new Date;
            }
          }
          if (remainingVariables.length > 0) {
            return requestAnimationFrame(function() {
              return iteration(cb);
            });
          } else {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this);
      return iteration((function(_this) {
        return function() {
          if (updated.length > 0) {
            _this.emitChangeEvent(_this.updateDependencies({
              updated: updated
            }));
          }
          return typeof callback === "function" ? callback(updated) : void 0;
        };
      })(this));
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, removed, _ref;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      _ref = this.diffArrays(previousDependencies, newDependencies), removed = _ref.removed, added = _ref.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (__indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var status, v, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, dependencies, dependency, _base, _i, _len, _ref, _results;
      dependencies = this.getVariableDependencies(variable);
      _results = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dependency = dependencies[_i];
        a = (_base = this.dependencyGraph)[dependency] != null ? _base[dependency] : _base[dependency] = [];
        if (_ref = variable.name, __indexOf.call(a, _ref) < 0) {
          _results.push(a.push(variable.name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, v, variables, _i, _len, _ref, _ref1, _ref2;
      dependencies = [];
      if (_ref = variable.value, __indexOf.call(this.variableNames, _ref) >= 0) {
        dependencies.push(variable.value);
      }
      if (((_ref1 = variable.color) != null ? (_ref2 = _ref1.variables) != null ? _ref2.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          v = variables[_i];
          if (__indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var v, variables, _i, _len, _ref, _ref1;
      variables = [];
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (_ref1 = v.name, __indexOf.call(names, _ref1) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            _results.push(delete this.dependencyGraph[v]);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var v, _base, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if ((_base = this.dependencyGraph)[v] == null) {
          _base[v] = [];
        }
        _results.push(this.dependencyGraph[v].push(from));
      }
      return _results;
    };

    VariablesCollection.prototype.updateDependencies = function(_arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, name, updated, variable, variables, _i, _j, _k, _len, _len1, _len2;
      created = _arg.created, updated = _arg.updated, destroyed = _arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (_j = 0, _len1 = dependencies.length; _j < _len1; _j++) {
            name = dependencies[_j];
            if (__indexOf.call(dirtyVariableNames, name) < 0 && __indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (_k = 0, _len2 = dirtyVariables.length; _k < _len2; _k++) {
        variable = dirtyVariables[_k];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(_arg) {
      var created, destroyed, updated;
      created = _arg.created, destroyed = _arg.destroyed, updated = _arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, removed, v, _i, _j, _len, _len1;
      removed = [];
      added = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        v = a[_i];
        if (__indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (_j = 0, _len1 = b.length; _j < _len1; _j++) {
        v = b[_j];
        if (__indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isAlternate) {
            res.isAlternate = true;
          }
          if (v.noNamePrefix) {
            res.noNamePrefix = true;
          }
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi92YXJpYWJsZXMtY29sbGVjdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0ZBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FIUixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxxQkFBUixDQUpYLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsQ0FOVCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsbUJBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFBLG1CQUFBLENBQW9CLEtBQXBCLEVBRFE7SUFBQSxDQUFkLENBQUE7O0FBQUEsSUFHQSxNQUFNLENBQUMsY0FBUCxDQUFzQixtQkFBQyxDQUFBLFNBQXZCLEVBQWtDLFFBQWxDLEVBQTRDO0FBQUEsTUFDMUMsR0FBQSxFQUFLLFNBQUEsR0FBQTtlQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBZDtNQUFBLENBRHFDO0FBQUEsTUFFMUMsVUFBQSxFQUFZLElBRjhCO0tBQTVDLENBSEEsQ0FBQTs7QUFRYSxJQUFBLDZCQUFDLEtBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/variables-collection.coffee
