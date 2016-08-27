(function() {
  var ColorBuffer, ColorProject, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, TOTAL_COLORS_VARIABLES_IN_PROJECT, TOTAL_VARIABLES_IN_PROJECT, click, fs, jsonFixture, os, path, temp, _ref;

  os = require('os');

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp');

  _ref = require('../lib/versions'), SERIALIZE_VERSION = _ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref.SERIALIZE_MARKERS_VERSION;

  ColorProject = require('../lib/color-project');

  ColorBuffer = require('../lib/color-buffer');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  click = require('./helpers/events').click;

  TOTAL_VARIABLES_IN_PROJECT = 12;

  TOTAL_COLORS_VARIABLES_IN_PROJECT = 10;

  describe('ColorProject', function() {
    var eventSpy, paths, project, promise, rootPath, _ref1;
    _ref1 = [], project = _ref1[0], promise = _ref1[1], rootPath = _ref1[2], paths = _ref1[3], eventSpy = _ref1[4];
    beforeEach(function() {
      var fixturesPath;
      atom.config.set('pigments.sourceNames', ['*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.filetypesForColorWords', ['*']);
      fixturesPath = atom.project.getPaths()[0];
      rootPath = "" + fixturesPath + "/project";
      atom.project.setPaths([rootPath]);
      return project = new ColorProject({
        ignoredNames: ['vendor/*'],
        sourceNames: ['*.less'],
        ignoredScopes: ['\\.comment']
      });
    });
    afterEach(function() {
      return project.destroy();
    });
    describe('.deserialize', function() {
      return it('restores the project in its previous state', function() {
        var data, json;
        data = {
          root: rootPath,
          timestamp: new Date().toJSON(),
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION
        };
        json = jsonFixture('base-project.json', data);
        project = ColorProject.deserialize(json);
        expect(project).toBeDefined();
        expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('::initialize', function() {
      beforeEach(function() {
        eventSpy = jasmine.createSpy('did-initialize');
        project.onDidInitialize(eventSpy);
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('loads the paths to scan in the project', function() {
        return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
      });
      it('scans the loaded paths to retrieve the variables', function() {
        expect(project.getVariables()).toBeDefined();
        return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
      });
      return it('dispatches a did-initialize event', function() {
        return expect(eventSpy).toHaveBeenCalled();
      });
    });
    describe('::findAllColors', function() {
      return it('returns all the colors in the legibles files of the project', function() {
        var search;
        search = project.findAllColors();
        return expect(search).toBeDefined();
      });
    });
    describe('when the variables have not been loaded yet', function() {
      describe('::serialize', function() {
        return it('returns an object without paths nor variables', function() {
          var date, expected;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          expected = {
            deserializer: 'ColorProject',
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            buffers: {}
          };
          return expect(project.serialize()).toEqual(expected);
        });
      });
      describe('::getVariablesForPath', function() {
        return it('returns undefined', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getVariableByName', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableByName("foo")).toBeUndefined();
        });
      });
      describe('::getVariableById', function() {
        return it('returns undefined', function() {
          return expect(project.getVariableById(0)).toBeUndefined();
        });
      });
      describe('::getContext', function() {
        return it('returns an empty context', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(0);
        });
      });
      describe('::getPalette', function() {
        return it('returns an empty palette', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(0);
        });
      });
      describe('::reloadVariablesForPath', function() {
        beforeEach(function() {
          spyOn(project, 'initialize').andCallThrough();
          return waitsForPromise(function() {
            return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
          });
        });
        return it('returns a promise hooked on the initialize promise', function() {
          return expect(project.initialize).toHaveBeenCalled();
        });
      });
      describe('::setIgnoredNames', function() {
        beforeEach(function() {
          project.setIgnoredNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(32);
        });
      });
      return describe('::setSourceNames', function() {
        beforeEach(function() {
          project.setSourceNames([]);
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('initializes the project with the new paths', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
    });
    describe('when the project has no variables source files', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "-no-sources";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths()).toEqual([]);
      });
      return it('initializes the variables with an empty array', function() {
        return expect(project.getVariables()).toEqual([]);
      });
    });
    describe('when the project has custom source names defined', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        project = new ColorProject({
          sourceNames: ['*.styl']
        });
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('initializes the paths with an empty array', function() {
        return expect(project.getPaths().length).toEqual(2);
      });
      return it('initializes the variables with an empty array', function() {
        expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        return expect(project.getColorVariables().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
      });
    });
    describe('when the project has looping variable definition', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "-with-recursion";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('ignores the looping definition', function() {
        expect(project.getVariables().length).toEqual(5);
        return expect(project.getColorVariables().length).toEqual(5);
      });
    });
    describe('when the variables have been loaded', function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      describe('::serialize', function() {
        return it('returns an object with project properties', function() {
          var date;
          date = new Date;
          spyOn(project, 'getTimestamp').andCallFake(function() {
            return date;
          });
          return expect(project.serialize()).toEqual({
            deserializer: 'ColorProject',
            ignoredNames: ['vendor/*'],
            sourceNames: ['*.less'],
            ignoredScopes: ['\\.comment'],
            timestamp: date,
            version: SERIALIZE_VERSION,
            markersVersion: SERIALIZE_MARKERS_VERSION,
            paths: ["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"],
            globalSourceNames: ['*.styl'],
            globalIgnoredNames: [],
            buffers: {},
            variables: project.variables.serialize()
          });
        });
      });
      describe('::getVariablesForPath', function() {
        it('returns the variables defined in the file', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl").length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
        return describe('for a file that was ignored in the scanning process', function() {
          return it('returns undefined', function() {
            return expect(project.getVariablesForPath("" + rootPath + "/vendor/css/variables.less")).toEqual([]);
          });
        });
      });
      describe('::deleteVariablesForPath', function() {
        return it('removes all the variables coming from the specified file', function() {
          project.deleteVariablesForPath("" + rootPath + "/styles/variables.styl");
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl")).toEqual([]);
        });
      });
      describe('::getContext', function() {
        return it('returns a context with the project variables', function() {
          expect(project.getContext()).toBeDefined();
          return expect(project.getContext().getVariablesCount()).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('::getPalette', function() {
        return it('returns a palette with the colors from the project', function() {
          expect(project.getPalette()).toBeDefined();
          return expect(project.getPalette().getColorsCount()).toEqual(10);
        });
      });
      describe('::showVariableInFile', function() {
        return it('opens the file where is located the variable', function() {
          var spy;
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          project.showVariableInFile(project.getVariables()[0]);
          waitsFor(function() {
            return spy.callCount > 0;
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            return expect(editor.getSelectedBufferRange()).toEqual([[1, 2], [1, 14]]);
          });
        });
      });
      describe('::reloadVariablesForPath', function() {
        return describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPath("" + rootPath + "/styles/variables.styl");
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPath("" + rootPath + "/styles/variables.styl");
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
      });
      describe('::reloadVariablesForPaths', function() {
        describe('for a file that is part of the loaded paths', function() {
          describe('where the reload finds new variables', function() {
            beforeEach(function() {
              project.deleteVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              });
            });
            it('scans again the file to find variables', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('dispatches a did-update-variables event', function() {
              return expect(eventSpy).toHaveBeenCalled();
            });
          });
          return describe('where the reload finds nothing new', function() {
            beforeEach(function() {
              eventSpy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(eventSpy);
              return waitsForPromise(function() {
                return project.reloadVariablesForPaths(["" + rootPath + "/styles/variables.styl", "" + rootPath + "/styles/buttons.styl"]);
              });
            });
            it('leaves the file variables intact', function() {
              return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            });
            return it('does not dispatch a did-update-variables event', function() {
              return expect(eventSpy).not.toHaveBeenCalled();
            });
          });
        });
        return describe('for a file that is not part of the loaded paths', function() {
          beforeEach(function() {
            spyOn(project, 'loadVariablesForPath').andCallThrough();
            return waitsForPromise(function() {
              return project.reloadVariablesForPath("" + rootPath + "/vendor/css/variables.less");
            });
          });
          return it('does nothing', function() {
            return expect(project.loadVariablesForPath).not.toHaveBeenCalled();
          });
        });
      });
      describe('when a buffer with variables is open', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          eventSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(eventSpy);
          waitsForPromise(function() {
            return atom.workspace.open('styles/variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            colorBuffer = project.colorBufferForEditor(editor);
            return spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('updates the project variable with the buffer ranges', function() {
          var variable, _i, _len, _ref3, _results;
          _ref3 = project.getVariables();
          _results = [];
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            variable = _ref3[_i];
            _results.push(expect(variable.bufferRange).toBeDefined());
          }
          return _results;
        });
        describe('when a color is modified that does not affect other variables ranges', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            variablesTextRanges = {};
            project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
              return variablesTextRanges[variable.name] = variable.range;
            });
            editor.setSelectedBufferRange([[1, 7], [1, 14]]);
            editor.insertText('#336');
            editor.getBuffer().emitter.emit('did-stop-changing');
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed).toBeUndefined();
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated.length).toEqual(1);
          });
          it('updates the text range of the other variables', function() {
            return project.getVariablesForPath("" + rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] - 3);
                return expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] - 3);
              }
            });
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        describe('when a text is inserted that affects other variables ranges', function() {
          var variablesBufferRanges, variablesTextRanges, _ref3;
          _ref3 = [], variablesTextRanges = _ref3[0], variablesBufferRanges = _ref3[1];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              variablesBufferRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                variablesTextRanges[variable.name] = variable.range;
                return variablesBufferRanges[variable.name] = variable.bufferRange;
              });
              spyOn(project.variables, 'addMany').andCallThrough();
              editor.setSelectedBufferRange([[0, 0], [0, 0]]);
              editor.insertText('\n\n');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return project.variables.addMany.callCount > 0;
            });
          });
          it('does not trigger a change event', function() {
            return expect(eventSpy.callCount).toEqual(0);
          });
          return it('updates the range of the updated variables', function() {
            return project.getVariablesForPath("" + rootPath + "/styles/variables.styl").forEach(function(variable) {
              if (variable.name !== 'colors.red') {
                expect(variable.range[0]).toEqual(variablesTextRanges[variable.name][0] + 2);
                expect(variable.range[1]).toEqual(variablesTextRanges[variable.name][1] + 2);
                return expect(variable.bufferRange.isEqual(variablesBufferRanges[variable.name])).toBeFalsy();
              }
            });
          });
        });
        describe('when a color is removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[1, 0], [2, 0]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('reloads the variables with the buffer instead of the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT - 1);
          });
          it('uses the buffer ranges to detect which variables were really changed', function() {
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
        return describe('when all the colors are removed', function() {
          var variablesTextRanges;
          variablesTextRanges = [][0];
          beforeEach(function() {
            runs(function() {
              variablesTextRanges = {};
              project.getVariablesForPath(editor.getPath()).forEach(function(variable) {
                return variablesTextRanges[variable.name] = variable.range;
              });
              editor.setSelectedBufferRange([[0, 0], [Infinity, Infinity]]);
              editor.insertText('');
              return editor.getBuffer().emitter.emit('did-stop-changing');
            });
            return waitsFor(function() {
              return eventSpy.callCount > 0;
            });
          });
          it('removes every variable from the file', function() {
            expect(colorBuffer.scanBufferForVariables).toHaveBeenCalled();
            expect(project.getVariables().length).toEqual(0);
            expect(eventSpy.argsForCall[0][0].destroyed.length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
            expect(eventSpy.argsForCall[0][0].created).toBeUndefined();
            return expect(eventSpy.argsForCall[0][0].updated).toBeUndefined();
          });
          it('can no longer be found in the project variables', function() {
            expect(project.getVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
            return expect(project.getColorVariables().some(function(v) {
              return v.name === 'colors.red';
            })).toBeFalsy();
          });
          return it('dispatches a did-update-variables event', function() {
            return expect(eventSpy).toHaveBeenCalled();
          });
        });
      });
      describe('::setIgnoredNames', function() {
        describe('with an empty array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            project.setIgnoredNames([]);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('reloads the variables from the new paths', function() {
            return expect(project.getVariables().length).toEqual(32);
          });
        });
        return describe('with a more restrictive array', function() {
          beforeEach(function() {
            var spy;
            expect(project.getVariables().length).toEqual(12);
            spy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(spy);
            return waitsForPromise(function() {
              return project.setIgnoredNames(['vendor/*', '**/*.styl']);
            });
          });
          return it('clears all the paths as there is no legible paths', function() {
            return expect(project.getPaths().length).toEqual(0);
          });
        });
      });
      describe('when the project has multiple root directory', function() {
        beforeEach(function() {
          var fixturesPath;
          atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
          fixturesPath = atom.project.getPaths()[0];
          atom.project.setPaths(["" + fixturesPath, "" + fixturesPath + "-with-recursion"]);
          project = new ColorProject({});
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('finds the variables from the two directories', function() {
          return expect(project.getVariables().length).toEqual(17);
        });
      });
      describe('when the project has VCS ignored files', function() {
        var projectPath;
        projectPath = [][0];
        beforeEach(function() {
          var dotGit, dotGitFixture, fixture;
          atom.config.set('pigments.sourceNames', ['*.sass']);
          fixture = path.join(__dirname, 'fixtures', 'project-with-gitignore');
          projectPath = temp.mkdirSync('pigments-project');
          dotGitFixture = path.join(fixture, 'git.git');
          dotGit = path.join(projectPath, '.git');
          fs.copySync(dotGitFixture, dotGit);
          fs.writeFileSync(path.join(projectPath, '.gitignore'), fs.readFileSync(path.join(fixture, 'git.gitignore')));
          fs.writeFileSync(path.join(projectPath, 'base.sass'), fs.readFileSync(path.join(fixture, 'base.sass')));
          fs.writeFileSync(path.join(projectPath, 'ignored.sass'), fs.readFileSync(path.join(fixture, 'ignored.sass')));
          fs.mkdirSync(path.join(projectPath, 'bower_components'));
          fs.writeFileSync(path.join(projectPath, 'bower_components', 'some-ignored-file.sass'), fs.readFileSync(path.join(fixture, 'bower_components', 'some-ignored-file.sass')));
          return atom.project.setPaths([projectPath]);
        });
        describe('when the ignoreVcsIgnoredPaths setting is enabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(3);
            return expect(project.getPaths().length).toEqual(1);
          });
          return describe('and then disabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(3);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(10);
            });
          });
        });
        return describe('when the ignoreVcsIgnoredPaths setting is disabled', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoreVcsIgnoredPaths', false);
            project = new ColorProject({});
            return waitsForPromise(function() {
              return project.initialize();
            });
          });
          it('finds the variables from the three files', function() {
            expect(project.getVariables().length).toEqual(10);
            return expect(project.getPaths().length).toEqual(3);
          });
          return describe('and then enabled', function() {
            beforeEach(function() {
              var spy;
              spy = jasmine.createSpy('did-update-variables');
              project.onDidUpdateVariables(spy);
              atom.config.set('pigments.ignoreVcsIgnoredPaths', true);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            it('reloads the paths', function() {
              return expect(project.getPaths().length).toEqual(1);
            });
            return it('reloads the variables', function() {
              return expect(project.getVariables().length).toEqual(3);
            });
          });
        });
      });
      describe('when the sourceNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.sourceNames', []);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the variables using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.sourceNames', ['**/*.styl']);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the ignoredNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          var originalPaths;
          originalPaths = project.getPaths();
          atom.config.set('pigments.ignoredNames', ['**/*.styl']);
          return waitsFor(function() {
            return project.getPaths().join(',') !== originalPaths.join(',');
          });
        });
        it('updates the found using the new pattern', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
        return describe('so that new paths are found', function() {
          beforeEach(function() {
            var originalPaths;
            updateSpy = jasmine.createSpy('did-update-variables');
            originalPaths = project.getPaths();
            project.onDidUpdateVariables(updateSpy);
            atom.config.set('pigments.ignoredNames', []);
            waitsFor(function() {
              return project.getPaths().join(',') !== originalPaths.join(',');
            });
            return waitsFor(function() {
              return updateSpy.callCount > 0;
            });
          });
          return it('loads the variables from these new paths', function() {
            return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
          });
        });
      });
      describe('when the extendedSearchNames setting is changed', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          return project.setSearchNames(['*.foo']);
        });
        it('updates the search names', function() {
          return expect(project.getSearchNames().length).toEqual(3);
        });
        return it('serializes the setting', function() {
          return expect(project.serialize().searchNames).toEqual(['*.foo']);
        });
      });
      describe('when the ignore global config settings are enabled', function() {
        describe('for the sourceNames field', function() {
          beforeEach(function() {
            project.sourceNames = ['*.foo'];
            return waitsForPromise(function() {
              return project.setIgnoreGlobalSourceNames(true);
            });
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSourceNames()).toEqual(['.pigments', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSourceNames).toBeTruthy();
          });
        });
        describe('for the ignoredNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredNames', ['*.foo']);
            project.ignoredNames = ['*.bar'];
            return project.setIgnoreGlobalIgnoredNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredNames()).toEqual(['*.bar']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredNames).toBeTruthy();
          });
        });
        describe('for the ignoredScopes field', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.comment']);
            project.ignoredScopes = ['\\.source'];
            return project.setIgnoreGlobalIgnoredScopes(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getIgnoredScopes()).toEqual(['\\.source']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalIgnoredScopes).toBeTruthy();
          });
        });
        return describe('for the searchNames field', function() {
          beforeEach(function() {
            atom.config.set('pigments.extendedSearchNames', ['*.css']);
            project.searchNames = ['*.foo'];
            return project.setIgnoreGlobalSearchNames(true);
          });
          it('ignores the content of the global config', function() {
            return expect(project.getSearchNames()).toEqual(['*.less', '*.foo']);
          });
          return it('serializes the project setting', function() {
            return expect(project.serialize().ignoreGlobalSearchNames).toBeTruthy();
          });
        });
      });
      describe('::loadThemesVariables', function() {
        beforeEach(function() {
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        return it('returns an array of 62 variables', function() {
          var themeVariables;
          themeVariables = project.loadThemesVariables();
          return expect(themeVariables.length).toEqual(62);
        });
      });
      return describe('when the includeThemes setting is enabled', function() {
        var spy, _ref2;
        _ref2 = [], paths = _ref2[0], spy = _ref2[1];
        beforeEach(function() {
          paths = project.getPaths();
          expect(project.getColorVariables().length).toEqual(10);
          atom.packages.activatePackage('atom-light-ui');
          atom.packages.activatePackage('atom-light-syntax');
          atom.packages.activatePackage('atom-dark-ui');
          atom.packages.activatePackage('atom-dark-syntax');
          atom.config.set('core.themes', ['atom-light-ui', 'atom-light-syntax']);
          waitsForPromise(function() {
            return atom.themes.activateThemes();
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('pigments');
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            spy = jasmine.createSpy('did-change-active-themes');
            atom.themes.onDidChangeActiveThemes(spy);
            return project.setIncludeThemes(true);
          });
        });
        afterEach(function() {
          atom.themes.deactivateThemes();
          return atom.themes.unwatchUserStylesheet();
        });
        it('includes the variables set for ui and syntax themes in the palette', function() {
          return expect(project.getColorVariables().length).toEqual(72);
        });
        it('still includes the paths from the project', function() {
          var p, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = paths.length; _i < _len; _i++) {
            p = paths[_i];
            _results.push(expect(project.getPaths().indexOf(p)).not.toEqual(-1));
          }
          return _results;
        });
        it('serializes the setting with the project', function() {
          var serialized;
          serialized = project.serialize();
          return expect(serialized.includeThemes).toEqual(true);
        });
        describe('and then disabled', function() {
          beforeEach(function() {
            return project.setIncludeThemes(false);
          });
          it('removes all the paths to the themes stylesheets', function() {
            return expect(project.getColorVariables().length).toEqual(10);
          });
          return describe('when the core.themes setting is modified', function() {
            beforeEach(function() {
              spyOn(project, 'loadThemesVariables').andCallThrough();
              atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
              return waitsFor(function() {
                return spy.callCount > 0;
              });
            });
            return it('does not trigger a paths update', function() {
              return expect(project.loadThemesVariables).not.toHaveBeenCalled();
            });
          });
        });
        return describe('when the core.themes setting is modified', function() {
          beforeEach(function() {
            spyOn(project, 'loadThemesVariables').andCallThrough();
            atom.config.set('core.themes', ['atom-dark-ui', 'atom-dark-syntax']);
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          return it('triggers a paths update', function() {
            return expect(project.loadThemesVariables).toHaveBeenCalled();
          });
        });
      });
    });
    return describe('when restored', function() {
      var createProject;
      createProject = function(params) {
        var stateFixture;
        if (params == null) {
          params = {};
        }
        stateFixture = params.stateFixture;
        delete params.stateFixture;
        if (params.root == null) {
          params.root = rootPath;
        }
        if (params.timestamp == null) {
          params.timestamp = new Date().toJSON();
        }
        if (params.variableMarkers == null) {
          params.variableMarkers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
        if (params.colorMarkers == null) {
          params.colorMarkers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        }
        if (params.version == null) {
          params.version = SERIALIZE_VERSION;
        }
        if (params.markersVersion == null) {
          params.markersVersion = SERIALIZE_MARKERS_VERSION;
        }
        return ColorProject.deserialize(jsonFixture(stateFixture, params));
      };
      describe('with a timestamp more recent than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('does not rescans the files', function() {
          return expect(project.getVariables().length).toEqual(1);
        });
      });
      describe('with a version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            version: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with a serialized path that no longer exist', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "rename-file-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('drops drops the non-existing and reload the paths', function() {
          return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        });
        it('drops the variables from the removed paths', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/foo.styl").length).toEqual(0);
        });
        return it('loads the variables from the new file', function() {
          return expect(project.getVariablesForPath("" + rootPath + "/styles/variables.styl").length).toEqual(12);
        });
      });
      describe('with a sourceNames setting value different than when serialized', function() {
        beforeEach(function() {
          atom.config.set('pigments.sourceNames', []);
          project = createProject({
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('drops the whole serialized state and rescans all the project', function() {
          return expect(project.getVariables().length).toEqual(0);
        });
      });
      describe('with a markers version different that the current one', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "empty-project.json",
            markersVersion: "0.0.0"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('keeps the project related data', function() {
          expect(project.ignoredNames).toEqual(['vendor/*']);
          return expect(project.getPaths()).toEqual(["" + rootPath + "/styles/buttons.styl", "" + rootPath + "/styles/variables.styl"]);
        });
        return it('drops the variables and buffers data', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with a timestamp older than the files last modification date', function() {
        beforeEach(function() {
          project = createProject({
            timestamp: new Date(0).toJSON(),
            stateFixture: "empty-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('scans again all the files that have a more recent modification date', function() {
          return expect(project.getVariables().length).toEqual(TOTAL_VARIABLES_IN_PROJECT);
        });
      });
      describe('with some files not saved in the project state', function() {
        beforeEach(function() {
          project = createProject({
            stateFixture: "partial-project.json"
          });
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        return it('detects the new files and scans them', function() {
          return expect(project.getVariables().length).toEqual(12);
        });
      });
      describe('with an open editor and the corresponding buffer state', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            project = createProject({
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
            return spyOn(ColorBuffer.prototype, 'variablesAvailable').andCallThrough();
          });
          return runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
        });
        it('restores the color buffer in its previous state', function() {
          expect(colorBuffer).toBeDefined();
          return expect(colorBuffer.getColorMarkers().length).toEqual(TOTAL_COLORS_VARIABLES_IN_PROJECT);
        });
        return it('does not wait for the project variables', function() {
          return expect(colorBuffer.variablesAvailable).not.toHaveBeenCalled();
        });
      });
      return describe('with an open editor, the corresponding buffer state and a old timestamp', function() {
        var colorBuffer, editor, _ref2;
        _ref2 = [], editor = _ref2[0], colorBuffer = _ref2[1];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('variables.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            spyOn(ColorBuffer.prototype, 'updateVariableRanges').andCallThrough();
            return project = createProject({
              timestamp: new Date(0).toJSON(),
              stateFixture: "open-buffer-project.json",
              id: editor.id
            });
          });
          runs(function() {
            return colorBuffer = project.colorBuffersByEditorId[editor.id];
          });
          return waitsFor(function() {
            return colorBuffer.updateVariableRanges.callCount > 0;
          });
        });
        return it('invalidates the color buffer markers as soon as the dirty paths have been determined', function() {
          return expect(colorBuffer.updateVariableRanges).toHaveBeenCalled();
        });
      });
    });
  });

  describe('ColorProject', function() {
    var project, rootPath, _ref1;
    _ref1 = [], project = _ref1[0], rootPath = _ref1[1];
    return describe('when the project has a pigments defaults file', function() {
      beforeEach(function() {
        var fixturesPath;
        atom.config.set('pigments.sourceNames', ['*.sass']);
        fixturesPath = atom.project.getPaths()[0];
        rootPath = "" + fixturesPath + "/project-with-defaults";
        atom.project.setPaths([rootPath]);
        project = new ColorProject({});
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      return it('loads the defaults file content', function() {
        return expect(project.getColorVariables().length).toEqual(12);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItcHJvamVjdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvTEFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxPQUFpRCxPQUFBLENBQVEsaUJBQVIsQ0FBakQsRUFBQyx5QkFBQSxpQkFBRCxFQUFvQixpQ0FBQSx5QkFMcEIsQ0FBQTs7QUFBQSxFQU1BLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FOZixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQVBkLENBQUE7O0FBQUEsRUFRQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSLENBQTZCLENBQUMsV0FBOUIsQ0FBMEMsU0FBMUMsRUFBcUQsVUFBckQsQ0FSZCxDQUFBOztBQUFBLEVBU0MsUUFBUyxPQUFBLENBQVEsa0JBQVIsRUFBVCxLQVRELENBQUE7O0FBQUEsRUFXQSwwQkFBQSxHQUE2QixFQVg3QixDQUFBOztBQUFBLEVBWUEsaUNBQUEsR0FBb0MsRUFacEMsQ0FBQTs7QUFBQSxFQWNBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLGtEQUFBO0FBQUEsSUFBQSxRQUFnRCxFQUFoRCxFQUFDLGtCQUFELEVBQVUsa0JBQVYsRUFBbUIsbUJBQW5CLEVBQTZCLGdCQUE3QixFQUFv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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-project-spec.coffee
