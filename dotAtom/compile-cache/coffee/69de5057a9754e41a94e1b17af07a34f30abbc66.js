(function() {
  var Disposable, Pigments, PigmentsAPI, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, registry, _ref;

  Disposable = require('atom').Disposable;

  Pigments = require('../lib/pigments');

  PigmentsAPI = require('../lib/pigments-api');

  registry = require('../lib/variable-expressions');

  _ref = require('../lib/versions'), SERIALIZE_VERSION = _ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref.SERIALIZE_MARKERS_VERSION;

  describe("Pigments", function() {
    var pigments, project, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], pigments = _ref1[1], project = _ref1[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.ignoredScopes', []);
      atom.config.set('pigments.autocompleteScopes', []);
      registry.createExpression('pigments:txt_vars', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n\\r;]*);?$', ['txt']);
      return waitsForPromise({
        label: 'pigments activation'
      }, function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      registry.removeExpression('pigments:txt_vars');
      return project != null ? project.destroy() : void 0;
    });
    it('instanciates a ColorProject instance', function() {
      return expect(pigments.getProject()).toBeDefined();
    });
    it('serializes the project', function() {
      var date;
      date = new Date;
      spyOn(pigments.getProject(), 'getTimestamp').andCallFake(function() {
        return date;
      });
      return expect(pigments.serialize()).toEqual({
        project: {
          deserializer: 'ColorProject',
          timestamp: date,
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION,
          globalSourceNames: ['**/*.sass', '**/*.styl'],
          globalIgnoredNames: [],
          buffers: {}
        }
      });
    });
    describe('when deactivated', function() {
      var colorBuffer, editor, editorElement, _ref2;
      _ref2 = [], editor = _ref2[0], editorElement = _ref2[1], colorBuffer = _ref2[2];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        waitsFor('pigments markers appended to the DOM', function() {
          return editorElement.shadowRoot.querySelector('pigments-markers');
        });
        return runs(function() {
          spyOn(project, 'destroy').andCallThrough();
          spyOn(colorBuffer, 'destroy').andCallThrough();
          return pigments.deactivate();
        });
      });
      it('destroys the pigments project', function() {
        return expect(project.destroy).toHaveBeenCalled();
      });
      it('destroys all the color buffers that were created', function() {
        expect(project.colorBufferForEditor(editor)).toBeUndefined();
        expect(project.colorBuffersByEditorId).toBeNull();
        return expect(colorBuffer.destroy).toHaveBeenCalled();
      });
      return it('destroys the color buffer element that were added to the DOM', function() {
        return expect(editorElement.shadowRoot.querySelector('pigments-markers')).not.toExist();
      });
    });
    describe('pigments:project-settings', function() {
      var item;
      item = null;
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:project-settings');
        return waitsFor('active pane item', function() {
          item = atom.workspace.getActivePaneItem();
          return item != null;
        });
      });
      return it('opens a settings view in the active pane', function() {
        return item.matches('pigments-color-project');
      });
    });
    describe('API provider', function() {
      var buffer, editor, editorElement, service, _ref2;
      _ref2 = [], service = _ref2[0], editor = _ref2[1], editorElement = _ref2[2], buffer = _ref2[3];
      beforeEach(function() {
        waitsForPromise({
          label: 'text-editor opened'
        }, function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return buffer = project.colorBufferForEditor(editor);
          });
        });
        runs(function() {
          return service = pigments.provideAPI();
        });
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      it('returns an object conforming to the API', function() {
        expect(service instanceof PigmentsAPI).toBeTruthy();
        expect(service.getProject()).toBe(project);
        expect(service.getPalette()).toEqual(project.getPalette());
        expect(service.getPalette()).not.toBe(project.getPalette());
        expect(service.getVariables()).toEqual(project.getVariables());
        return expect(service.getColorVariables()).toEqual(project.getColorVariables());
      });
      return describe('::observeColorBuffers', function() {
        var spy;
        spy = [][0];
        beforeEach(function() {
          spy = jasmine.createSpy('did-create-color-buffer');
          return service.observeColorBuffers(spy);
        });
        it('calls the callback for every existing color buffer', function() {
          expect(spy).toHaveBeenCalled();
          return expect(spy.calls.length).toEqual(1);
        });
        return it('calls the callback on every new buffer creation', function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('buttons.styl');
          });
          return runs(function() {
            return expect(spy.calls.length).toEqual(2);
          });
        });
      });
    });
    describe('color expression consumer', function() {
      var colorBuffer, colorBufferElement, colorProvider, consumerDisposable, editor, editorElement, otherConsumerDisposable, _ref2;
      _ref2 = [], colorProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5], otherConsumerDisposable = _ref2[6];
      beforeEach(function() {
        return colorProvider = {
          name: 'todo',
          regexpString: 'TODO',
          scopes: ['*'],
          priority: 0,
          handle: function(match, expression, context) {
            return this.red = 255;
          }
        };
      });
      afterEach(function() {
        if (consumerDisposable != null) {
          consumerDisposable.dispose();
        }
        return otherConsumerDisposable != null ? otherConsumerDisposable.dispose() : void 0;
      });
      describe('when consumed before opening a text editor', function() {
        beforeEach(function() {
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('parses the new expression and renders a color', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(1);
        });
        it('returns a Disposable instance', function() {
          return expect(consumerDisposable instanceof Disposable).toBeTruthy();
        });
        return describe('the returned disposable', function() {
          it('removes the provided expression from the registry', function() {
            consumerDisposable.dispose();
            return expect(project.getColorExpressionsRegistry().getExpression('todo')).toBeUndefined();
          });
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable.dispose();
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      describe('when consumed after opening a text editor', function() {
        beforeEach(function() {
          waitsForPromise({
            label: 'text-editor opened'
          }, function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise({
            label: 'color buffer initialized'
          }, function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise({
            label: 'color buffer variables available'
          }, function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('triggers an update in the opened editors', function() {
          var updateSpy;
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 0;
          });
          runs(function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(1);
            return consumerDisposable.dispose();
          });
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 1;
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        return describe('when an array of expressions is passed', function() {
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable = pigments.consumeColorExpressions({
              expressions: [colorProvider]
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            runs(function() {
              expect(colorBuffer.getColorMarkers().length).toEqual(1);
              return consumerDisposable.dispose();
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 1;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      return describe('when the expression matches a variable value', function() {
        beforeEach(function() {
          return waitsForPromise({
            label: 'project initialized'
          }, function() {
            return project.initialize();
          });
        });
        it('detects the new variable as a color variable', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            return consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          });
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 2;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(5);
          });
        });
        return describe('and there was an expression that could not be resolved before', function() {
          return it('updates the invalid color as a now valid color', function() {
            var variableSpy;
            variableSpy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(variableSpy);
            atom.config.set('pigments.sourceNames', ['**/*.txt']);
            waitsFor('variables updated', function() {
              return variableSpy.callCount > 1;
            });
            return runs(function() {
              otherConsumerDisposable = pigments.consumeColorExpressions({
                name: 'bar',
                regexpString: 'baz\\s+(\\w+)',
                handle: function(match, expression, context) {
                  var color, expr, _;
                  _ = match[0], expr = match[1];
                  color = context.readColor(expr);
                  if (context.isInvalid(color)) {
                    return this.invalid = true;
                  }
                  return this.rgba = color.rgba;
                }
              });
              consumerDisposable = pigments.consumeColorExpressions(colorProvider);
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 2;
              });
              runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(6);
                expect(project.getVariableByName('bar').color.invalid).toBeFalsy();
                return consumerDisposable.dispose();
              });
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 3;
              });
              return runs(function() {
                expect(project.getVariables().length).toEqual(6);
                expect(project.getColorVariables().length).toEqual(5);
                return expect(project.getVariableByName('bar').color.invalid).toBeTruthy();
              });
            });
          });
        });
      });
    });
    return describe('variable expression consumer', function() {
      var colorBuffer, colorBufferElement, consumerDisposable, editor, editorElement, variableProvider, _ref2;
      _ref2 = [], variableProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5];
      beforeEach(function() {
        variableProvider = {
          name: 'todo',
          regexpString: '(TODO):\\s*([^;\\n]+)'
        };
        return waitsForPromise({
          label: 'project initialized'
        }, function() {
          return project.initialize();
        });
      });
      afterEach(function() {
        return consumerDisposable != null ? consumerDisposable.dispose() : void 0;
      });
      it('updates the project variables when consumed', function() {
        var variableSpy;
        variableSpy = jasmine.createSpy('did-update-variables');
        project.onDidUpdateVariables(variableSpy);
        atom.config.set('pigments.sourceNames', ['**/*.txt']);
        waitsFor('variables updated', function() {
          return variableSpy.callCount > 1;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(6);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable = pigments.consumeVariableExpressions(variableProvider);
        });
        waitsFor('variables updated after service consumed', function() {
          return variableSpy.callCount > 2;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(7);
          expect(project.getColorVariables().length).toEqual(4);
          return consumerDisposable.dispose();
        });
        waitsFor('variables updated after service disposed', function() {
          return variableSpy.callCount > 3;
        });
        return runs(function() {
          expect(project.getVariables().length).toEqual(6);
          return expect(project.getColorVariables().length).toEqual(4);
        });
      });
      return describe('when an array of expressions is passed', function() {
        return it('updates the project variables when consumed', function() {
          var previousVariablesCount;
          previousVariablesCount = null;
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables initialized', function() {
            return project.getVariables().length === 45;
          });
          runs(function() {
            return previousVariablesCount = project.getVariables().length;
          });
          waitsFor('variables updated', function() {
            return project.getVariables().length === 6;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(6);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable = pigments.consumeVariableExpressions({
              expressions: [variableProvider]
            });
          });
          waitsFor('variables updated after service consumed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(7);
            expect(project.getColorVariables().length).toEqual(4);
            previousVariablesCount = project.getVariables().length;
            return consumerDisposable.dispose();
          });
          waitsFor('variables updated after service disposed', function() {
            return project.getVariables().length !== previousVariablesCount;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(6);
            return expect(project.getColorVariables().length).toEqual(4);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvYWN0aXZhdGlvbi1hbmQtYXBpLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtGQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUtBLE9BQWlELE9BQUEsQ0FBUSxpQkFBUixDQUFqRCxFQUFDLHlCQUFBLGlCQUFELEVBQW9CLGlDQUFBLHlCQUxwQixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFFBQUEsMENBQUE7QUFBQSxJQUFBLFFBQXdDLEVBQXhDLEVBQUMsMkJBQUQsRUFBbUIsbUJBQW5CLEVBQTZCLGtCQUE3QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQixDQURBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsQ0FBQyxXQUFELEVBQWMsV0FBZCxDQUF4QyxDQUhBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/activation-and-api-spec.coffee
