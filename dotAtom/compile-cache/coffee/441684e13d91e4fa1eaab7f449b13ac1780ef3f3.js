(function() {
  var Color, ColorMarker, ColorMarkerElement, click, path, stylesheet, stylesheetPath;

  path = require('path');

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  ColorMarkerElement = require('../lib/color-marker-element');

  click = require('./helpers/events').click;

  stylesheetPath = path.resolve(__dirname, '..', 'styles', 'pigments.less');

  stylesheet = atom.themes.loadStylesheet(stylesheetPath);

  describe('ColorMarkerElement', function() {
    var colorMarker, colorMarkerElement, editor, jasmineContent, marker, _ref;
    _ref = [], editor = _ref[0], marker = _ref[1], colorMarker = _ref[2], colorMarkerElement = _ref[3], jasmineContent = _ref[4];
    beforeEach(function() {
      var color, styleNode, text;
      jasmineContent = document.body.querySelector('#jasmine-content');
      styleNode = document.createElement('style');
      styleNode.textContent = "" + stylesheet;
      jasmineContent.appendChild(styleNode);
      editor = atom.workspace.buildTextEditor({});
      editor.setText("body {\n  color: #f00;\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [4, 1]], {
        invalidate: 'touch'
      });
      color = new Color('#ff0000');
      text = '#f00';
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: {
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          selectColorMarkerAndOpenPicker: jasmine.createSpy('select-color'),
          ignoredScopes: [],
          findValidColorMarkers: function() {
            return [];
          }
        }
      });
    });
    it('releases itself when the marker is destroyed', function() {
      var eventSpy;
      colorMarkerElement = new ColorMarkerElement;
      colorMarkerElement.setContainer({
        editor: editor,
        useNativeDecorations: function() {
          return false;
        },
        requestMarkerUpdate: function(_arg) {
          var marker;
          marker = _arg[0];
          return marker.render();
        }
      });
      colorMarkerElement.setModel(colorMarker);
      eventSpy = jasmine.createSpy('did-release');
      colorMarkerElement.onDidRelease(eventSpy);
      spyOn(colorMarkerElement, 'release').andCallThrough();
      marker.destroy();
      expect(colorMarkerElement.release).toHaveBeenCalled();
      return expect(eventSpy).toHaveBeenCalled();
    });
    describe('clicking on the decoration', function() {
      beforeEach(function() {
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return click(colorMarkerElement);
      });
      return it('calls selectColorMarkerAndOpenPicker on the buffer', function() {
        return expect(colorMarker.colorBuffer.selectColorMarkerAndOpenPicker).toHaveBeenCalled();
      });
    });
    describe('when the render mode is set to background', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('background');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.background');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('#f00;');
        expect(regions[1].textContent).toEqual('  bar: foo;');
        expect(regions[2].textContent).toEqual('  foo: bar;');
        return expect(regions[3].textContent).toEqual('}');
      });
      it('sets the background of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to outline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('outline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.outline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the drop shadow color of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.borderColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to underline', function() {
      var regions;
      regions = [][0];
      beforeEach(function() {
        ColorMarkerElement.setMarkerType('underline');
        colorMarkerElement = new ColorMarkerElement;
        colorMarkerElement.setContainer({
          editor: editor,
          useNativeDecorations: function() {
            return false;
          },
          requestMarkerUpdate: function(_arg) {
            var marker;
            marker = _arg[0];
            return marker.render();
          }
        });
        colorMarkerElement.setModel(colorMarker);
        return regions = colorMarkerElement.querySelectorAll('.region.underline');
      });
      it('creates a region div for the color', function() {
        return expect(regions.length).toEqual(4);
      });
      it('fills the region with the covered text', function() {
        expect(regions[0].textContent).toEqual('');
        expect(regions[1].textContent).toEqual('');
        expect(regions[2].textContent).toEqual('');
        return expect(regions[3].textContent).toEqual('');
      });
      it('sets the background of the region with the color css value', function() {
        var region, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          _results.push(expect(region.style.backgroundColor).toEqual('rgb(255, 0, 0)'));
        }
        return _results;
      });
      describe('when the marker is modified', function() {
        beforeEach(function() {
          spyOn(colorMarkerElement.renderer, 'render').andCallThrough();
          editor.moveToTop();
          return editor.insertText('\n\n');
        });
        return it('renders again the marker content', function() {
          expect(colorMarkerElement.renderer.render).toHaveBeenCalled();
          return expect(colorMarkerElement.querySelectorAll('.region').length).toEqual(4);
        });
      });
      return describe('when released', function() {
        return it('removes all the previously rendered content', function() {
          colorMarkerElement.release();
          return expect(colorMarkerElement.children.length).toEqual(0);
        });
      });
    });
    describe('when the render mode is set to dot', function() {
      var createMarker, markerElement, markers, markersElements, regions, _ref1;
      _ref1 = [], regions = _ref1[0], markers = _ref1[1], markersElements = _ref1[2], markerElement = _ref1[3];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(_arg) {
              var marker;
              marker = _arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var markersElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
          markersElement = markersElements[_i];
          _results.push(expect(markersElement.classList.contains('dot')).toBeTruthy());
        }
        return _results;
      });
    });
    return describe('when the render mode is set to dot', function() {
      var createMarker, markers, markersElements, regions, _ref1;
      _ref1 = [], regions = _ref1[0], markers = _ref1[1], markersElements = _ref1[2];
      createMarker = function(range, color, text) {
        marker = editor.markBufferRange(range, {
          invalidate: 'touch'
        });
        color = new Color(color);
        text = text;
        return colorMarker = new ColorMarker({
          marker: marker,
          color: color,
          text: text,
          colorBuffer: {
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            project: {
              colorPickerAPI: {
                open: jasmine.createSpy('color-picker.open')
              }
            },
            ignoredScopes: [],
            findValidColorMarkers: function() {
              return [];
            }
          }
        });
      };
      beforeEach(function() {
        var editorElement;
        editor = atom.workspace.buildTextEditor({});
        editor.setText("body {\n  background: red, green, blue;\n}");
        editorElement = atom.views.getView(editor);
        jasmineContent.appendChild(editorElement);
        markers = [createMarker([[1, 13], [1, 16]], '#ff0000', 'red'), createMarker([[1, 18], [1, 23]], '#00ff00', 'green'), createMarker([[1, 25], [1, 29]], '#0000ff', 'blue')];
        ColorMarkerElement.setMarkerType('square-dot');
        return markersElements = markers.map(function(colorMarker) {
          colorMarkerElement = new ColorMarkerElement;
          colorMarkerElement.setContainer({
            editor: editor,
            useNativeDecorations: function() {
              return false;
            },
            requestMarkerUpdate: function(_arg) {
              var marker;
              marker = _arg[0];
              return marker.render();
            }
          });
          colorMarkerElement.setModel(colorMarker);
          jasmineContent.appendChild(colorMarkerElement);
          return colorMarkerElement;
        });
      });
      return it('adds the dot class on the marker', function() {
        var markersElement, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
          markersElement = markersElements[_i];
          expect(markersElement.classList.contains('dot')).toBeTruthy();
          _results.push(expect(markersElement.classList.contains('square')).toBeTruthy());
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItbWFya2VyLWVsZW1lbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0VBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0Esa0JBQUEsR0FBcUIsT0FBQSxDQUFRLDZCQUFSLENBSHJCLENBQUE7O0FBQUEsRUFJQyxRQUFTLE9BQUEsQ0FBUSxrQkFBUixFQUFULEtBSkQsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBQXdDLGVBQXhDLENBTmpCLENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQTJCLGNBQTNCLENBUGIsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxxRUFBQTtBQUFBLElBQUEsT0FBb0UsRUFBcEUsRUFBQyxnQkFBRCxFQUFTLGdCQUFULEVBQWlCLHFCQUFqQixFQUE4Qiw0QkFBOUIsRUFBa0Qsd0JBQWxELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLHNCQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBZCxDQUE0QixrQkFBNUIsQ0FBakIsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLFFBQVEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-marker-element-spec.coffee
