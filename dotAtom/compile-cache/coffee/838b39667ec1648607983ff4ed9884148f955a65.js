(function() {
  var ColorBufferElement, ColorMarkerElement, mousedown, path, sleep;

  path = require('path');

  require('./helpers/spec-helper');

  mousedown = require('./helpers/events').mousedown;

  ColorBufferElement = require('../lib/color-buffer-element');

  ColorMarkerElement = require('../lib/color-marker-element');

  sleep = function(duration) {
    var t;
    t = new Date();
    return waitsFor(function() {
      return new Date() - t > duration;
    });
  };

  describe('ColorBufferElement', function() {
    var colorBuffer, colorBufferElement, editBuffer, editor, editorElement, isVisible, jasmineContent, jsonFixture, pigments, project, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], colorBuffer = _ref[2], pigments = _ref[3], project = _ref[4], colorBufferElement = _ref[5], jasmineContent = _ref[6];
    isVisible = function(node) {
      return !node.classList.contains('hidden');
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
    jsonFixture = function(fixture, data) {
      var json, jsonPath;
      jsonPath = path.resolve(__dirname, 'fixtures', fixture);
      json = fs.readFileSync(jsonPath).toString();
      json = json.replace(/#\{(\w+)\}/g, function(m, w) {
        return data[w];
      });
      return JSON.parse(json);
    };
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmineContent = document.body.querySelector('#jasmine-content');
      jasmineContent.appendChild(workspaceElement);
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 40);
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          editor = o;
          return editorElement = atom.views.getView(editor);
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    return describe('when an editor is opened', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        colorBufferElement = atom.views.getView(colorBuffer);
        return colorBufferElement.attach();
      });
      it('is associated to the ColorBuffer model', function() {
        expect(colorBufferElement).toBeDefined();
        return expect(colorBufferElement.getModel()).toBe(colorBuffer);
      });
      it('attaches itself in the target text editor element', function() {
        expect(colorBufferElement.parentNode).toExist();
        return expect(editorElement.shadowRoot.querySelector('.lines pigments-markers')).toExist();
      });
      describe('when the editor shadow dom setting is not enabled', function() {
        beforeEach(function() {
          editor.destroy();
          atom.config.set('editor.useShadowDOM', false);
          waitsForPromise(function() {
            return atom.workspace.open('four-variables.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            editorElement = atom.views.getView(editor);
            colorBuffer = project.colorBufferForEditor(editor);
            colorBufferElement = atom.views.getView(colorBuffer);
            return colorBufferElement.attach();
          });
        });
        return it('attaches itself in the target text editor element', function() {
          return expect(colorBufferElement.parentNode).toExist();
        });
      });
      describe('when the color buffer is initialized', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        it('creates markers views for every visible buffer marker', function() {
          var marker, markersElements, _i, _len, _results;
          markersElements = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
          expect(markersElements.length).toEqual(3);
          _results = [];
          for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
            marker = markersElements[_i];
            _results.push(expect(marker.getModel()).toBeDefined());
          }
          return _results;
        });
        describe('when the project variables are initialized', function() {
          return it('creates markers for the new valid colors', function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(4);
            });
          });
        });
        describe('when a selection intersects a marker range', function() {
          beforeEach(function() {
            return spyOn(colorBufferElement, 'updateSelections').andCallThrough();
          });
          describe('after the markers views was created', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              runs(function() {
                return editor.setSelectedBufferRange([[2, 12], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            return it('hides the intersected marker', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeTruthy();
              expect(isVisible(markers[1])).toBeTruthy();
              expect(isVisible(markers[2])).toBeTruthy();
              return expect(isVisible(markers[3])).toBeFalsy();
            });
          });
          return describe('before all the markers views was created', function() {
            beforeEach(function() {
              runs(function() {
                return editor.setSelectedBufferRange([[0, 0], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            it('hides the existing markers', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeFalsy();
              expect(isVisible(markers[1])).toBeTruthy();
              return expect(isVisible(markers[2])).toBeTruthy();
            });
            return describe('and the markers are updated', function() {
              beforeEach(function() {
                waitsForPromise('colors available', function() {
                  return colorBuffer.variablesAvailable();
                });
                return waitsFor('last marker visible', function() {
                  var markers;
                  markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
                  return isVisible(markers[3]);
                });
              });
              return it('hides the created markers', function() {
                var markers;
                markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
                expect(isVisible(markers[0])).toBeFalsy();
                expect(isVisible(markers[1])).toBeTruthy();
                expect(isVisible(markers[2])).toBeTruthy();
                return expect(isVisible(markers[3])).toBeTruthy();
              });
            });
          });
        });
        describe('when a line is edited and gets wrapped', function() {
          var marker;
          marker = null;
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            runs(function() {
              marker = colorBufferElement.usedMarkers[colorBufferElement.usedMarkers.length - 1];
              spyOn(marker, 'render').andCallThrough();
              return editBuffer(new Array(20).join("foo "), {
                start: [1, 0],
                end: [1, 0]
              });
            });
            return waitsFor(function() {
              return marker.render.callCount > 0;
            });
          });
          return it('updates the markers whose screen range have changed', function() {
            return expect(marker.render).toHaveBeenCalled();
          });
        });
        describe('when some markers are destroyed', function() {
          var spy;
          spy = [][0];
          beforeEach(function() {
            var el, _i, _len, _ref1;
            _ref1 = colorBufferElement.usedMarkers;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              spyOn(el, 'release').andCallThrough();
            }
            spy = jasmine.createSpy('did-update');
            colorBufferElement.onDidUpdate(spy);
            editBuffer('', {
              start: [4, 0],
              end: [8, 0]
            });
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          it('releases the unused markers', function() {
            var marker, _i, _len, _ref1, _results;
            expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            expect(colorBufferElement.usedMarkers.length).toEqual(2);
            expect(colorBufferElement.unusedMarkers.length).toEqual(1);
            _ref1 = colorBufferElement.unusedMarkers;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              marker = _ref1[_i];
              _results.push(expect(marker.release).toHaveBeenCalled());
            }
            return _results;
          });
          return describe('and then a new marker is created', function() {
            beforeEach(function() {
              editor.moveToBottom();
              editBuffer('\nfoo = #123456\n');
              return waitsFor(function() {
                return colorBufferElement.unusedMarkers.length === 0;
              });
            });
            return it('reuses the previously released marker element', function() {
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              expect(colorBufferElement.usedMarkers.length).toEqual(3);
              return expect(colorBufferElement.unusedMarkers.length).toEqual(0);
            });
          });
        });
        describe('when the current pane is splitted to the right', function() {
          beforeEach(function() {
            var version;
            version = parseFloat(atom.getVersion().split('.').slice(1, 2).join('.'));
            if (version > 5) {
              atom.commands.dispatch(editorElement, 'pane:split-right-and-copy-active-item');
            } else {
              atom.commands.dispatch(editorElement, 'pane:split-right');
            }
            waitsFor('text editor', function() {
              return editor = atom.workspace.getTextEditors()[1];
            });
            waitsFor('color buffer element', function() {
              return colorBufferElement = atom.views.getView(project.colorBufferForEditor(editor));
            });
            return waitsFor('color buffer element markers', function() {
              return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length;
            });
          });
          return it('should keep all the buffer elements attached', function() {
            var editors;
            editors = atom.workspace.getTextEditors();
            return editors.forEach(function(editor) {
              editorElement = atom.views.getView(editor);
              colorBufferElement = editorElement.shadowRoot.querySelector('pigments-markers');
              expect(colorBufferElement).toExist();
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
            });
          });
        });
        return describe('when the marker type is set to gutter', function() {
          var gutter;
          gutter = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.initialize();
            });
            return runs(function() {
              atom.config.set('pigments.markerType', 'gutter');
              return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments-gutter"]');
            });
          });
          it('removes the markers', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(0);
          });
          it('adds a custom gutter to the text editor', function() {
            return expect(gutter).toExist();
          });
          it('sets the size of the gutter based on the number of markers in the same row', function() {
            return expect(gutter.style.minWidth).toEqual('14px');
          });
          it('adds a gutter decoration for each color marker', function() {
            var decorations;
            decorations = editor.getDecorations().filter(function(d) {
              return d.properties.type === 'gutter';
            });
            return expect(decorations.length).toEqual(3);
          });
          describe('when the variables become available', function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
            });
            it('creates decorations for the new valid colors', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(4);
            });
            return describe('when many markers are added on the same line', function() {
              beforeEach(function() {
                var updateSpy;
                updateSpy = jasmine.createSpy('did-update');
                colorBufferElement.onDidUpdate(updateSpy);
                editor.moveToBottom();
                editBuffer('\nlist = #123456, #987654, #abcdef\n');
                return waitsFor(function() {
                  return updateSpy.callCount > 0;
                });
              });
              it('adds the new decorations to the gutter', function() {
                var decorations;
                decorations = editor.getDecorations().filter(function(d) {
                  return d.properties.type === 'gutter';
                });
                return expect(decorations.length).toEqual(7);
              });
              it('sets the size of the gutter based on the number of markers in the same row', function() {
                return expect(gutter.style.minWidth).toEqual('42px');
              });
              return describe('clicking on a gutter decoration', function() {
                beforeEach(function() {
                  var decoration;
                  project.colorPickerAPI = {
                    open: jasmine.createSpy('color-picker.open')
                  };
                  decoration = editorElement.shadowRoot.querySelector('.pigments-gutter-marker span');
                  return mousedown(decoration);
                });
                it('selects the text in the editor', function() {
                  return expect(editor.getSelectedScreenRange()).toEqual([[0, 13], [0, 17]]);
                });
                return it('opens the color picker', function() {
                  return expect(project.colorPickerAPI.open).toHaveBeenCalled();
                });
              });
            });
          });
          describe('when the marker is changed again', function() {
            beforeEach(function() {
              return atom.config.set('pigments.markerType', 'background');
            });
            it('removes the gutter', function() {
              return expect(editorElement.shadowRoot.querySelector('[gutter-name="pigments-gutter"]')).not.toExist();
            });
            return it('recreates the markers', function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            });
          });
          return describe('when a new buffer is opened', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return atom.workspace.open('project/styles/variables.styl').then(function(e) {
                  editor = e;
                  editorElement = atom.views.getView(editor);
                  colorBuffer = project.colorBufferForEditor(editor);
                  return colorBufferElement = atom.views.getView(colorBuffer);
                });
              });
              waitsForPromise(function() {
                return colorBuffer.initialize();
              });
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              return runs(function() {
                return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments-gutter"]');
              });
            });
            return it('creates the decorations in the new buffer gutter', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(10);
            });
          });
        });
      });
      describe('when the editor is moved to another pane', function() {
        var newPane, pane, _ref1;
        _ref1 = [], pane = _ref1[0], newPane = _ref1[1];
        beforeEach(function() {
          pane = atom.workspace.getActivePane();
          newPane = pane.splitDown({
            copyActiveItem: false
          });
          colorBuffer = project.colorBufferForEditor(editor);
          colorBufferElement = atom.views.getView(colorBuffer);
          expect(atom.workspace.getPanes().length).toEqual(2);
          pane.moveItemToPane(editor, newPane, 0);
          return waitsFor(function() {
            return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length;
          });
        });
        return it('moves the editor with the buffer to the new pane', function() {
          expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
          return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
        });
      });
      describe('when pigments.supportedFiletypes settings is defined', function() {
        var loadBuffer;
        loadBuffer = function(filePath) {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        };
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('language-less');
          });
        });
        describe('with the default wildcard', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['*']);
          });
          return it('supports every filetype', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
          });
        });
        describe('with a filetype', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['coffee']);
          });
          return it('supports the specified file type', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
        });
        return describe('with many filetypes', function() {
          beforeEach(function() {
            atom.config.set('pigments.supportedFiletypes', ['coffee']);
            return project.setSupportedFiletypes(['less']);
          });
          it('supports the specified file types', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
            loadBuffer('four-variables.styl');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
          return describe('with global file types ignored', function() {
            beforeEach(function() {
              atom.config.set('pigments.supportedFiletypes', ['coffee']);
              project.setIgnoreGlobalSupportedFiletypes(true);
              return project.setSupportedFiletypes(['less']);
            });
            return it('supports the specified file types', function() {
              loadBuffer('scope-filter.coffee');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
              loadBuffer('project/vendor/css/variables.less');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
              });
              loadBuffer('four-variables.styl');
              return runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
            });
          });
        });
      });
      describe('when pigments.ignoredScopes settings is defined', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          waitsForPromise(function() {
            return atom.workspace.open('scope-filter.coffee').then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        describe('with one filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(1);
          });
        });
        describe('with two filters', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.string', '\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
        describe('with an invalid filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\']);
          });
          return it('ignores the filter', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
          });
        });
        return describe('when the project ignoredScopes is defined', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.string']);
            return project.setIgnoredScopes(['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
      });
      return describe('when a text editor settings is modified', function() {
        var originalMarkers;
        originalMarkers = [][0];
        beforeEach(function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            originalMarkers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)');
            spyOn(colorBufferElement, 'updateMarkers').andCallThrough();
            return spyOn(ColorMarkerElement.prototype, 'render').andCallThrough();
          });
        });
        describe('editor.fontSize', function() {
          beforeEach(function() {
            return atom.config.set('editor.fontSize', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
        return describe('editor.lineHeight', function() {
          beforeEach(function() {
            return atom.config.set('editor.lineHeight', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItYnVmZmVyLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsOERBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBQSxDQUFRLHVCQUFSLENBREEsQ0FBQTs7QUFBQSxFQUVDLFlBQWEsT0FBQSxDQUFRLGtCQUFSLEVBQWIsU0FGRCxDQUFBOztBQUFBLEVBSUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBSnJCLENBQUE7O0FBQUEsRUFLQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVIsQ0FMckIsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUSxTQUFDLFFBQUQsR0FBQTtBQUNOLFFBQUEsQ0FBQTtBQUFBLElBQUEsQ0FBQSxHQUFRLElBQUEsSUFBQSxDQUFBLENBQVIsQ0FBQTtXQUNBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7YUFBTyxJQUFBLElBQUEsQ0FBQSxDQUFKLEdBQWEsQ0FBYixHQUFpQixTQUFwQjtJQUFBLENBQVQsRUFGTTtFQUFBLENBUFIsQ0FBQTs7QUFBQSxFQVdBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxtSUFBQTtBQUFBLElBQUEsT0FBOEYsRUFBOUYsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLHFCQUF4QixFQUFxQyxrQkFBckMsRUFBK0MsaUJBQS9DLEVBQXdELDRCQUF4RCxFQUE0RSx3QkFBNUUsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO2FBQVUsQ0FBQSxJQUFRLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBd0IsUUFBeEIsRUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-buffer-element-spec.coffee
