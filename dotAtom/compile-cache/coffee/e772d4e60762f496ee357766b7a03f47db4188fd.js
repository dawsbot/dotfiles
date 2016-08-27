(function() {
  var ColorBuffer, jsonFixture, path, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  ColorBuffer = require('../lib/color-buffer');

  registry = require('../lib/color-expressions');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  describe('ColorBuffer', function() {
    var colorBuffer, editBuffer, editor, pigments, project, sleep, _ref;
    _ref = [], editor = _ref[0], colorBuffer = _ref[1], pigments = _ref[2], project = _ref[3];
    sleep = function(ms) {
      var start;
      start = new Date;
      return function() {
        return new Date - start >= ms;
      };
    };
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return advanceClock(500);
      }
    };
    beforeEach(function() {
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.ignoredBufferNames', []);
      atom.config.set('pigments.filetypesForColorWords', ['*']);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          return editor = o;
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        })["catch"](function(err) {
          return console.error(err);
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    it('creates a color buffer for each editor in the workspace', function() {
      return expect(project.colorBuffersByEditorId[editor.id]).toBeDefined();
    });
    describe('when the file path matches an entry in ignoredBufferNames', function() {
      beforeEach(function() {
        expect(project.hasColorBufferForEditor(editor)).toBeTruthy();
        return atom.config.set('pigments.ignoredBufferNames', ['**/*.styl']);
      });
      it('destroys the color buffer for this file', function() {
        return expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
      });
      it('recreates the color buffer when the settings no longer ignore the file', function() {
        expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
        atom.config.set('pigments.ignoredBufferNames', []);
        return expect(project.hasColorBufferForEditor(editor)).toBeTruthy();
      });
      return it('prevents the creation of a new color buffer', function() {
        waitsForPromise(function() {
          return atom.workspace.open('variables.styl').then(function(o) {
            return editor = o;
          });
        });
        return runs(function() {
          return expect(project.hasColorBufferForEditor(editor)).toBeFalsy();
        });
      });
    });
    describe('when an editor with a path is not in the project paths is opened', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return project.getPaths() != null;
        });
      });
      describe('when the file is already saved on disk', function() {
        var pathToOpen;
        pathToOpen = null;
        beforeEach(function() {
          return pathToOpen = project.paths.shift();
        });
        return it('adds the path to the project immediately', function() {
          spyOn(project, 'appendPath');
          waitsForPromise(function() {
            return atom.workspace.open(pathToOpen).then(function(o) {
              editor = o;
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          return runs(function() {
            return expect(project.appendPath).toHaveBeenCalledWith(pathToOpen);
          });
        });
      });
      return describe('when the file is not yet saved on disk', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('foo-de-fafa.styl').then(function(o) {
              editor = o;
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('does not fails when updating the colorBuffer', function() {
          return expect(function() {
            return colorBuffer.update();
          }).not.toThrow();
        });
        return it('adds the path to the project paths on save', function() {
          spyOn(colorBuffer, 'update').andCallThrough();
          spyOn(project, 'appendPath');
          editor.getBuffer().emitter.emit('did-save', {
            path: editor.getPath()
          });
          waitsFor(function() {
            return colorBuffer.update.callCount > 0;
          });
          return runs(function() {
            return expect(project.appendPath).toHaveBeenCalledWith(editor.getPath());
          });
        });
      });
    });
    describe('when an editor without path is opened', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open().then(function(o) {
            editor = o;
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('does not fails when updating the colorBuffer', function() {
        return expect(function() {
          return colorBuffer.update();
        }).not.toThrow();
      });
      return describe('when the file is saved and aquires a path', function() {
        describe('that is legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('adds the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeTruthy();
          });
        });
        describe('that is not legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.sass');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
        return describe('that is ignored', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('project/vendor/new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
      });
    });
    describe('with rapid changes that triggers a rescan', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        waitsFor(function() {
          return colorBuffer.initialized && colorBuffer.variableInitialized;
        });
        runs(function() {
          spyOn(colorBuffer, 'terminateRunningTask').andCallThrough();
          spyOn(colorBuffer, 'updateColorMarkers').andCallThrough();
          spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          editor.moveToBottom();
          editor.insertText('#fff\n');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
        waitsFor(function() {
          return colorBuffer.scanBufferForVariables.callCount > 0;
        });
        return runs(function() {
          return editor.insertText(' ');
        });
      });
      return it('terminates the currently running task', function() {
        return expect(colorBuffer.terminateRunningTask).toHaveBeenCalled();
      });
    });
    describe('when created without a previous state', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it('scans the buffer for colors without waiting for the project variables', function() {
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        return expect(colorBuffer.getValidColorMarkers().length).toEqual(3);
      });
      it('creates the corresponding markers in the text editor', function() {
        return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
      });
      it('knows that it is legible as a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      describe('when the editor is destroyed', function() {
        return it('destroys the color buffer at the same time', function() {
          editor.destroy();
          return expect(project.colorBuffersByEditorId[editor.id]).toBeUndefined();
        });
      });
      describe('::getColorMarkerAtBufferPosition', function() {
        describe('when the buffer position is contained in a marker range', function() {
          return it('returns the corresponding color marker', function() {
            var colorMarker;
            colorMarker = colorBuffer.getColorMarkerAtBufferPosition([2, 15]);
            return expect(colorMarker).toEqual(colorBuffer.colorMarkers[1]);
          });
        });
        return describe('when the buffer position is not contained in a marker range', function() {
          return it('returns undefined', function() {
            return expect(colorBuffer.getColorMarkerAtBufferPosition([1, 15])).toBeUndefined();
          });
        });
      });
      describe('when the project variables becomes available', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('replaces the invalid markers that are now valid', function() {
          expect(colorBuffer.getValidColorMarkers().length).toEqual(4);
          expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          return expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
        });
        describe('when a variable is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            return editBuffer('#336699', {
              start: [0, 13],
              end: [0, 17]
            });
          });
          return it('updates the modified colors', function() {
            waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
            return runs(function() {
              expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(2);
              return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(2);
            });
          });
        });
        describe('when a new variable is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              updateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(updateSpy);
              editor.moveToBottom();
              editBuffer('\nfoo = base-color');
              return waitsFor(function() {
                return updateSpy.callCount > 0;
              });
            });
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a variable is removed', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            editBuffer('', {
              start: [0, 0],
              end: [0, 17]
            });
            return waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
          });
          return it('invalidates colors that were relying on the deleted variables', function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(3);
            return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
          });
        });
        return describe('::serialize', function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
          });
          return it('returns the whole buffer data', function() {
            var expected;
            expected = jsonFixture("four-variables-buffer.json", {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: colorBuffer.getColorMarkers().map(function(m) {
                return m.marker.id;
              })
            });
            return expect(colorBuffer.serialize()).toEqual(expected);
          });
        });
      });
      describe('with a buffer with only colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('buttons.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(3);
          });
        });
        describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#336699', {
                start: [1, 13],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            return expect(marker.color).toBeColor('#336699');
          });
          return it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when new lines changes the markers range', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#fff\n\n', {
                start: [0, 0],
                end: [0, 0]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          return it('does not destroys the previous markers', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a new color is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editor.moveToBottom();
              editBuffer('\n#336699');
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('adds a marker for the new color', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            expect(markers.length).toEqual(4);
            expect(marker.color).toBeColor('#336699');
            return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        return describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('', {
                start: [1, 2],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(2);
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(0);
          });
          return it('removes the previous editor markers', function() {
            return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(2);
          });
        });
      });
      describe('with a buffer whose scope is not one of source files', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('project/lib/main.coffee').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('does not renders colors from variables', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
      });
      return describe('with a buffer in crlf mode', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('crlf.styl').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('creates a marker for each colors', function() {
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
        });
      });
    });
    describe('with a buffer part of the global ignored files', function() {
      beforeEach(function() {
        project.setIgnoredNames([]);
        atom.config.set('pigments.ignoredNames', ['project/vendor/*']);
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      return it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
    });
    describe('with a buffer part of the project ignored files', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color: @base0;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        return it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(21);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(21);
        });
      });
    });
    describe('with a buffer not being a variable source', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/lib/main.coffee').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is not part of the source files', function() {
        return expect(colorBuffer.isVariablesSource()).toBeFalsy();
      });
      it('knows that it is not part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeFalsy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(4);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          spyOn(project, 'reloadVariablesForPath').andCallThrough();
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color = red;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(5);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(5);
        });
        return it('does not ask the project to reload the variables', function() {
          return expect(project.reloadVariablesForPath.mostRecentCall.args[0]).not.toEqual(colorBuffer.editor.getPath());
        });
      });
    });
    return describe('when created with a previous state', function() {
      describe('with variables and colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            project.colorBufferForEditor(editor).destroy();
            state = jsonFixture('four-variables-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1, -2, -3, -4]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        it('creates markers from the state object', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
        it('restores the markers properties', function() {
          var colorMarker;
          colorMarker = colorBuffer.getColorMarkers()[3];
          expect(colorMarker.color).toBeColor(255, 255, 255, 0.5);
          return expect(colorMarker.color.variables).toEqual(['base-color']);
        });
        it('restores the editor markers', function() {
          return expect(colorBuffer.getMarkerLayer().findMarkers().length).toEqual(4);
        });
        return it('restores the ability to fetch markers', function() {
          var marker, _i, _len, _ref1, _results;
          expect(colorBuffer.findColorMarkers().length).toEqual(4);
          _ref1 = colorBuffer.findColorMarkers();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            marker = _ref1[_i];
            _results.push(expect(marker).toBeDefined());
          }
          return _results;
        });
      });
      return describe('with an invalid color', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('invalid-color.styl').then(function(o) {
              return editor = o;
            });
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            state = jsonFixture('invalid-color-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        return it('creates markers from the state object', function() {
          expect(colorBuffer.getColorMarkers().length).toEqual(1);
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItYnVmZmVyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVIsQ0FBNkIsQ0FBQyxXQUE5QixDQUEwQyxTQUExQyxFQUFxRCxVQUFyRCxDQUhkLENBQUE7O0FBQUEsRUFNQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSwrREFBQTtBQUFBLElBQUEsT0FBMkMsRUFBM0MsRUFBQyxnQkFBRCxFQUFTLHFCQUFULEVBQXNCLGtCQUF0QixFQUFnQyxpQkFBaEMsQ0FBQTtBQUFBLElBRUEsS0FBQSxHQUFRLFNBQUMsRUFBRCxHQUFBO0FBQ04sVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBQSxDQUFBLElBQVIsQ0FBQTthQUNBLFNBQUEsR0FBQTtlQUFHLEdBQUEsQ0FBQSxJQUFBLEdBQVcsS0FBWCxJQUFvQixHQUF2QjtNQUFBLEVBRk07SUFBQSxDQUZSLENBQUE7QUFBQSxJQU1BLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxPQUFQLEdBQUE7QUFDWCxVQUFBLEtBQUE7O1FBRGtCLFVBQVE7T0FDMUI7QUFBQSxNQUFBLElBQUcscUJBQUg7QUFDRSxRQUFBLElBQUcsbUJBQUg7QUFDRSxVQUFBLEtBQUEsR0FBUSxDQUFDLE9BQU8s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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-buffer-spec.coffee
