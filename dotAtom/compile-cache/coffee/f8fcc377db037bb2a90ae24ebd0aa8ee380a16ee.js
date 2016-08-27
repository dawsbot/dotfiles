(function() {
  var CompositeDisposable, Task, Transpiler, fs, languagebabelSchema, path, pathIsInside, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable;

  fs = require('fs-plus');

  path = require('path');

  pathIsInside = require('../node_modules/path-is-inside');

  languagebabelSchema = {
    type: 'object',
    properties: {
      babelMapsPath: {
        type: 'string'
      },
      babelMapsAddUrl: {
        type: 'boolean'
      },
      babelSourcePath: {
        type: 'string'
      },
      babelTranspilePath: {
        type: 'string'
      },
      createMap: {
        type: 'boolean'
      },
      createTargetDirectories: {
        type: 'boolean'
      },
      createTranspiledCode: {
        type: 'boolean'
      },
      disableWhenNoBabelrcFileInPath: {
        type: 'boolean'
      },
      projectRoot: {
        type: 'boolean'
      },
      suppressSourcePathMessages: {
        type: 'boolean'
      },
      suppressTranspileOnSaveMessages: {
        type: 'boolean'
      },
      transpileOnSave: {
        type: 'boolean'
      }
    },
    additionalProperties: false
  };

  Transpiler = (function() {
    Transpiler.prototype.fromGrammarName = 'Babel ES6 JavaScript';

    Transpiler.prototype.fromScopeName = 'source.js.jsx';

    Transpiler.prototype.toScopeName = 'source.js.jsx';

    function Transpiler() {
      this.commandTranspileDirectories = __bind(this.commandTranspileDirectories, this);
      this.commandTranspileDirectory = __bind(this.commandTranspileDirectory, this);
      this.reqId = 0;
      this.babelTranspilerTasks = {};
      this.babelTransformerPath = require.resolve('./transpiler-task');
      this.transpileErrorNotifications = {};
      this.deprecateConfig();
      this.disposables = new CompositeDisposable();
      if (this.getConfig().transpileOnSave || this.getConfig().allowLocalOverride) {
        this.disposables.add(atom.contextMenu.add({
          '.tree-view .directory > .header > .name': [
            {
              label: 'Language-Babel',
              submenu: [
                {
                  label: 'Transpile Directory ',
                  command: 'language-babel:transpile-directory'
                }, {
                  label: 'Transpile Directories',
                  command: 'language-babel:transpile-directories'
                }
              ]
            }, {
              'type': 'separator'
            }
          ]
        }));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directory', this.commandTranspileDirectory));
        this.disposables.add(atom.commands.add('.tree-view .directory > .header > .name', 'language-babel:transpile-directories', this.commandTranspileDirectories));
      }
    }

    Transpiler.prototype.transform = function(code, _arg) {
      var babelOptions, config, filePath, msgObject, pathTo, reqId, sourceMap;
      filePath = _arg.filePath, sourceMap = _arg.sourceMap;
      config = this.getConfig();
      pathTo = this.getPaths(filePath, config);
      this.createTask(pathTo.projectPath);
      babelOptions = {
        filename: filePath,
        ast: false
      };
      if (sourceMap) {
        babelOptions.sourceMaps = sourceMap;
      }
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpileCode',
          pathTo: pathTo,
          code: code,
          babelOptions: babelOptions
        };
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var err;
          try {
            _this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
          } catch (_error) {
            err = _error;
            delete _this.babelTranspilerTasks[pathTo.projectPath];
            reject("Error " + err + " sending to transpile task with PID " + _this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          }
          return _this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, function(msgRet) {
            if (msgRet.err != null) {
              return reject("Babel v" + msgRet.babelVersion + "\n" + msgRet.err.message + "\n" + msgRet.babelCoreUsed);
            } else {
              msgRet.sourceMap = msgRet.map;
              return resolve(msgRet);
            }
          });
        };
      })(this));
    };

    Transpiler.prototype.commandTranspileDirectory = function(_arg) {
      var target;
      target = _arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path
      });
    };

    Transpiler.prototype.commandTranspileDirectories = function(_arg) {
      var target;
      target = _arg.target;
      return this.transpileDirectory({
        directory: target.dataset.path,
        recursive: true
      });
    };

    Transpiler.prototype.transpileDirectory = function(options) {
      var directory, recursive;
      directory = options.directory;
      recursive = options.recursive || false;
      return fs.readdir(directory, (function(_this) {
        return function(err, files) {
          if (err == null) {
            return files.map(function(file) {
              var fqFileName;
              fqFileName = path.join(directory, file);
              return fs.stat(fqFileName, function(err, stats) {
                if (err == null) {
                  if (stats.isFile()) {
                    if (/\.min\.[a-z]+$/.test(fqFileName)) {
                      return;
                    }
                    if (/\.(js|jsx|es|es6|babel)$/.test(fqFileName)) {
                      return _this.transpile(file, null, _this.getConfigAndPathTo(fqFileName));
                    }
                  } else if (recursive && stats.isDirectory()) {
                    return _this.transpileDirectory({
                      directory: fqFileName,
                      recursive: true
                    });
                  }
                }
              });
            });
          }
        };
      })(this));
    };

    Transpiler.prototype.transpile = function(sourceFile, textEditor, configAndPathTo) {
      var babelOptions, config, err, msgObject, pathTo, reqId, _ref1;
      if (configAndPathTo != null) {
        config = configAndPathTo.config, pathTo = configAndPathTo.pathTo;
      } else {
        _ref1 = this.getConfigAndPathTo(sourceFile), config = _ref1.config, pathTo = _ref1.pathTo;
      }
      if (config.transpileOnSave !== true) {
        return;
      }
      if (config.disableWhenNoBabelrcFileInPath) {
        if (!this.isBabelrcInPath(pathTo.sourceFileDir)) {
          return;
        }
      }
      if (!pathIsInside(pathTo.sourceFile, pathTo.sourceRoot)) {
        if (!config.suppressSourcePathMessages) {
          atom.notifications.addWarning('LB: Babel file is not inside the "Babel Source Path" directory.', {
            dismissable: false,
            detail: "No transpiled code output for file \n" + pathTo.sourceFile + " \n\nTo suppress these 'invalid source path' messages use language-babel package settings"
          });
        }
        return;
      }
      babelOptions = this.getBabelOptions(config);
      this.cleanNotifications(pathTo);
      this.createTask(pathTo.projectPath);
      if (this.babelTranspilerTasks[pathTo.projectPath]) {
        reqId = this.reqId++;
        msgObject = {
          reqId: reqId,
          command: 'transpile',
          pathTo: pathTo,
          babelOptions: babelOptions
        };
        try {
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        } catch (_error) {
          err = _error;
          console.log("Error " + err + " sending to transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          delete this.babelTranspilerTasks[pathTo.projectPath];
          this.createTask(pathTo.projectPath);
          console.log("Restarted transpile task with PID " + this.babelTranspilerTasks[pathTo.projectPath].childProcess.pid);
          this.babelTranspilerTasks[pathTo.projectPath].send(msgObject);
        }
        return this.babelTranspilerTasks[pathTo.projectPath].once("transpile:" + reqId, (function(_this) {
          return function(msgRet) {
            var mapJson, xssiProtection, _ref2, _ref3, _ref4;
            if ((_ref2 = msgRet.result) != null ? _ref2.ignored : void 0) {
              return;
            }
            if (msgRet.err) {
              if (msgRet.err.stack) {
                return _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.stack
                });
              } else {
                _this.transpileErrorNotifications[pathTo.sourceFile] = atom.notifications.addError("LB: Babel v" + msgRet.babelVersion + " Transpiler Error", {
                  dismissable: true,
                  detail: "" + msgRet.err.message + "\n \n" + msgRet.babelCoreUsed + "\n \n" + msgRet.err.codeFrame
                });
                if ((((_ref3 = msgRet.err.loc) != null ? _ref3.line : void 0) != null) && (textEditor != null ? textEditor.alive : void 0)) {
                  return textEditor.setCursorBufferPosition([msgRet.err.loc.line - 1, msgRet.err.loc.column]);
                }
              }
            } else {
              if (!config.suppressTranspileOnSaveMessages) {
                atom.notifications.addInfo("LB: Babel v" + msgRet.babelVersion + " Transpiler Success", {
                  detail: "" + pathTo.sourceFile + "\n \n" + msgRet.babelCoreUsed
                });
              }
              if (!config.createTranspiledCode) {
                if (!config.suppressTranspileOnSaveMessages) {
                  atom.notifications.addInfo('LB: No transpiled output configured');
                }
                return;
              }
              if (pathTo.sourceFile === pathTo.transpiledFile) {
                atom.notifications.addWarning('LB: Transpiled file would overwrite source file. Aborted!', {
                  dismissable: true,
                  detail: pathTo.sourceFile
                });
                return;
              }
              if (config.createTargetDirectories) {
                fs.makeTreeSync(path.parse(pathTo.transpiledFile).dir);
              }
              if (config.babelMapsAddUrl) {
                msgRet.result.code = msgRet.result.code + '\n' + '//# sourceMappingURL=' + pathTo.mapFile;
              }
              fs.writeFileSync(pathTo.transpiledFile, msgRet.result.code);
              if (config.createMap && ((_ref4 = msgRet.result.map) != null ? _ref4.version : void 0)) {
                if (config.createTargetDirectories) {
                  fs.makeTreeSync(path.parse(pathTo.mapFile).dir);
                }
                mapJson = {
                  version: msgRet.result.map.version,
                  sources: pathTo.sourceFile,
                  file: pathTo.transpiledFile,
                  sourceRoot: '',
                  names: msgRet.result.map.names,
                  mappings: msgRet.result.map.mappings
                };
                xssiProtection = ')]}\n';
                return fs.writeFileSync(pathTo.mapFile, xssiProtection + JSON.stringify(mapJson, null, ' '));
              }
            }
          };
        })(this));
      }
    };

    Transpiler.prototype.cleanNotifications = function(pathTo) {
      var i, n, sf, _ref1, _results;
      if (this.transpileErrorNotifications[pathTo.sourceFile] != null) {
        this.transpileErrorNotifications[pathTo.sourceFile].dismiss();
        delete this.transpileErrorNotifications[pathTo.sourceFile];
      }
      _ref1 = this.transpileErrorNotifications;
      for (sf in _ref1) {
        n = _ref1[sf];
        if (n.dismissed) {
          delete this.transpileErrorNotifications[sf];
        }
      }
      i = atom.notifications.notifications.length - 1;
      _results = [];
      while (i >= 0) {
        if (atom.notifications.notifications[i].dismissed && atom.notifications.notifications[i].message.substring(0, 3) === "LB:") {
          atom.notifications.notifications.splice(i, 1);
        }
        _results.push(i--);
      }
      return _results;
    };

    Transpiler.prototype.createTask = function(projectPath) {
      var _base;
      return (_base = this.babelTranspilerTasks)[projectPath] != null ? _base[projectPath] : _base[projectPath] = Task.once(this.babelTransformerPath, projectPath, (function(_this) {
        return function() {
          return delete _this.babelTranspilerTasks[projectPath];
        };
      })(this));
    };

    Transpiler.prototype.deprecateConfig = function() {
      if (atom.config.get('language-babel.supressTranspileOnSaveMessages') != null) {
        atom.config.set('language-babel.suppressTranspileOnSaveMessages', atom.config.get('language-babel.supressTranspileOnSaveMessages'));
      }
      if (atom.config.get('language-babel.supressSourcePathMessages') != null) {
        atom.config.set('language-babel.suppressSourcePathMessages', atom.config.get('language-babel.supressSourcePathMessages'));
      }
      atom.config.unset('language-babel.supressTranspileOnSaveMessages');
      atom.config.unset('language-babel.supressSourcePathMessages');
      atom.config.unset('language-babel.useInternalScanner');
      atom.config.unset('language-babel.stopAtProjectDirectory');
      atom.config.unset('language-babel.babelStage');
      atom.config.unset('language-babel.externalHelpers');
      atom.config.unset('language-babel.moduleLoader');
      atom.config.unset('language-babel.blacklistTransformers');
      atom.config.unset('language-babel.whitelistTransformers');
      atom.config.unset('language-babel.looseTransformers');
      atom.config.unset('language-babel.optionalTransformers');
      atom.config.unset('language-babel.plugins');
      atom.config.unset('language-babel.presets');
      return atom.config.unset('language-babel.formatJSX');
    };

    Transpiler.prototype.getBabelOptions = function(config) {
      var babelOptions;
      babelOptions = {
        code: true
      };
      if (config.createMap) {
        babelOptions.sourceMaps = config.createMap;
      }
      return babelOptions;
    };

    Transpiler.prototype.getConfigAndPathTo = function(sourceFile) {
      var config, localConfig, pathTo;
      config = this.getConfig();
      pathTo = this.getPaths(sourceFile, config);
      if (config.allowLocalOverride) {
        if (this.jsonSchema == null) {
          this.jsonSchema = (require('../node_modules/jjv'))();
          this.jsonSchema.addSchema('localConfig', languagebabelSchema);
        }
        localConfig = this.getLocalConfig(pathTo.sourceFileDir, pathTo.projectPath, {});
        this.merge(config, localConfig);
        pathTo = this.getPaths(sourceFile, config);
      }
      return {
        config: config,
        pathTo: pathTo
      };
    };

    Transpiler.prototype.getConfig = function() {
      return atom.config.get('language-babel');
    };

    Transpiler.prototype.getLocalConfig = function(fromDir, toDir, localConfig) {
      var err, fileContent, isProjectRoot, jsonContent, languageBabelCfgFile, localConfigFile, schemaErrors;
      localConfigFile = '.languagebabel';
      languageBabelCfgFile = path.join(fromDir, localConfigFile);
      if (fs.existsSync(languageBabelCfgFile)) {
        fileContent = fs.readFileSync(languageBabelCfgFile, 'utf8');
        try {
          jsonContent = JSON.parse(fileContent);
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: " + localConfigFile + " " + err.message, {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
          return;
        }
        schemaErrors = this.jsonSchema.validate('localConfig', jsonContent);
        if (schemaErrors) {
          atom.notifications.addError("LB: " + localConfigFile + " configuration error", {
            dismissable: true,
            detail: "File = " + languageBabelCfgFile + "\n\n" + fileContent
          });
        } else {
          isProjectRoot = jsonContent.projectRoot;
          this.merge(jsonContent, localConfig);
          if (isProjectRoot) {
            jsonContent.projectRootDir = fromDir;
          }
          localConfig = jsonContent;
        }
      }
      if (fromDir !== toDir) {
        if (fromDir === path.dirname(fromDir)) {
          return localConfig;
        }
        if (isProjectRoot) {
          return localConfig;
        }
        return this.getLocalConfig(path.dirname(fromDir), toDir, localConfig);
      } else {
        return localConfig;
      }
    };

    Transpiler.prototype.getPaths = function(sourceFile, config) {
      var absMapFile, absMapsRoot, absProjectPath, absSourceRoot, absTranspileRoot, absTranspiledFile, parsedSourceFile, projectContainingSource, relMapsPath, relSourcePath, relSourceRootToSourceFile, relTranspilePath, sourceFileInProject;
      projectContainingSource = atom.project.relativizePath(sourceFile);
      if (projectContainingSource[0] === null) {
        sourceFileInProject = false;
      } else {
        sourceFileInProject = true;
      }
      if (config.projectRootDir != null) {
        absProjectPath = path.normalize(config.projectRootDir);
      } else if (projectContainingSource[0] === null) {
        absProjectPath = path.parse(sourceFile).root;
      } else {
        absProjectPath = path.normalize(path.join(projectContainingSource[0], '.'));
      }
      relSourcePath = path.normalize(config.babelSourcePath);
      relTranspilePath = path.normalize(config.babelTranspilePath);
      relMapsPath = path.normalize(config.babelMapsPath);
      absSourceRoot = path.join(absProjectPath, relSourcePath);
      absTranspileRoot = path.join(absProjectPath, relTranspilePath);
      absMapsRoot = path.join(absProjectPath, relMapsPath);
      parsedSourceFile = path.parse(sourceFile);
      relSourceRootToSourceFile = path.relative(absSourceRoot, parsedSourceFile.dir);
      absTranspiledFile = path.join(absTranspileRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js');
      absMapFile = path.join(absMapsRoot, relSourceRootToSourceFile, parsedSourceFile.name + '.js.map');
      return {
        sourceFileInProject: sourceFileInProject,
        sourceFile: sourceFile,
        sourceFileDir: parsedSourceFile.dir,
        mapFile: absMapFile,
        transpiledFile: absTranspiledFile,
        sourceRoot: absSourceRoot,
        projectPath: absProjectPath
      };
    };

    Transpiler.prototype.isBabelrcInPath = function(fromDir) {
      var babelrc, babelrcFile;
      babelrc = '.babelrc';
      babelrcFile = path.join(fromDir, babelrc);
      if (fs.existsSync(babelrcFile)) {
        return true;
      }
      if (fromDir !== path.dirname(fromDir)) {
        return this.isBabelrcInPath(path.dirname(fromDir));
      } else {
        return false;
      }
    };

    Transpiler.prototype.merge = function(targetObj, sourceObj) {
      var prop, val, _results;
      _results = [];
      for (prop in sourceObj) {
        val = sourceObj[prop];
        _results.push(targetObj[prop] = val);
      }
      return _results;
    };

    Transpiler.prototype.stopTranspilerTask = function(projectPath) {
      var msgObject;
      msgObject = {
        command: 'stop'
      };
      return this.babelTranspilerTasks[projectPath].send(msgObject);
    };

    Transpiler.prototype.stopAllTranspilerTask = function() {
      var projectPath, v, _ref1, _results;
      _ref1 = this.babelTranspilerTasks;
      _results = [];
      for (projectPath in _ref1) {
        v = _ref1[projectPath];
        _results.push(this.stopTranspilerTask(projectPath));
      }
      return _results;
    };

    Transpiler.prototype.stopUnusedTasks = function() {
      var atomProjectPath, atomProjectPaths, isTaskInCurrentProject, projectTaskPath, v, _i, _len, _ref1, _results;
      atomProjectPaths = atom.project.getPaths();
      _ref1 = this.babelTranspilerTasks;
      _results = [];
      for (projectTaskPath in _ref1) {
        v = _ref1[projectTaskPath];
        isTaskInCurrentProject = false;
        for (_i = 0, _len = atomProjectPaths.length; _i < _len; _i++) {
          atomProjectPath = atomProjectPaths[_i];
          if (pathIsInside(projectTaskPath, atomProjectPath)) {
            isTaskInCurrentProject = true;
            break;
          }
        }
        if (!isTaskInCurrentProject) {
          _results.push(this.stopTranspilerTask(projectTaskPath));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Transpiler;

  })();

  module.exports = Transpiler;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi90cmFuc3BpbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsT0FBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQyxZQUFBLElBQUQsRUFBTywyQkFBQSxtQkFBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdDQUFSLENBSGYsQ0FBQTs7QUFBQSxFQU1BLG1CQUFBLEdBQXNCO0FBQUEsSUFDcEIsSUFBQSxFQUFNLFFBRGM7QUFBQSxJQUVwQixVQUFBLEVBQVk7QUFBQSxNQUNWLGFBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxRQUFSO09BRHhCO0FBQUEsTUFFVixlQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQUZ4QjtBQUFBLE1BR1YsZUFBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFFBQVI7T0FIeEI7QUFBQSxNQUlWLGtCQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sUUFBUjtPQUp4QjtBQUFBLE1BS1YsU0FBQSxFQUFrQztBQUFBLFFBQUUsSUFBQSxFQUFNLFNBQVI7T0FMeEI7QUFBQSxNQU1WLHVCQUFBLEVBQWtDO0FBQUEsUUFBRSxJQUFBLEVBQU0sU0FBUjtPQU54QjtBQUFBLE1BT1Ysb0JBQUEsRUFBa0M7QUFBQSxRQUFFLElBQUEsRUFBTSxTQUFSO09BUHhCO0FBQUEsTUFRViw4QkFBQSxFQUFrQztBQUFBLFFBQUUsSUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/lib/transpiler.coffee
