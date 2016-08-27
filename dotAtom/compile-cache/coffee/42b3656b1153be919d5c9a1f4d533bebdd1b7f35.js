(function() {
  var Color, ColorMarker;

  Color = require('../lib/color');

  ColorMarker = require('../lib/color-marker');

  describe('ColorMarker', function() {
    var colorMarker, colorMarkerElement, editor, jasmineContent, marker, _ref;
    _ref = [], editor = _ref[0], marker = _ref[1], colorMarker = _ref[2], colorMarkerElement = _ref[3], jasmineContent = _ref[4];
    beforeEach(function() {
      var color, colorBuffer, text;
      editor = atom.workspace.buildTextEditor({});
      editor.setText("body {\n  color: hsva(0, 100%, 100%, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      marker = editor.markBufferRange([[1, 9], [1, 33]]);
      color = new Color(255, 0, 0, 0.5);
      text = 'hsva(0, 100%, 100%, 0.5)';
      colorBuffer = {
        editor: editor
      };
      return colorMarker = new ColorMarker({
        marker: marker,
        color: color,
        text: text,
        colorBuffer: colorBuffer
      });
    });
    describe('::copyContentAsHex', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHex();
      });
      return it('write the hexadecimal version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("#ff0000");
      });
    });
    describe('::copyContentAsRGB', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsRGB();
      });
      return it('write the rgb version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("rgb(255, 0, 0)");
      });
    });
    describe('::copyContentAsRGBA', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsRGBA();
      });
      return it('write the rgba version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("rgba(255, 0, 0, 0.5)");
      });
    });
    describe('::copyContentAsHSL', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHSL();
      });
      return it('write the hsl version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("hsl(0, 100%, 50%)");
      });
    });
    describe('::copyContentAsHSLA', function() {
      beforeEach(function() {
        return colorMarker.copyContentAsHSLA();
      });
      return it('write the hsla version in the clipboard', function() {
        return expect(atom.clipboard.read()).toEqual("hsla(0, 100%, 50%, 0.5)");
      });
    });
    describe('::convertContentToHex', function() {
      beforeEach(function() {
        return colorMarker.convertContentToHex();
      });
      return it('replaces the text in the editor by the hexadecimal version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: #ff0000;\n  bar: foo;\n  foo: bar;\n}");
      });
    });
    describe('::convertContentToRGBA', function() {
      beforeEach(function() {
        return colorMarker.convertContentToRGBA();
      });
      it('replaces the text in the editor by the rgba version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: rgba(255, 0, 0, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is 1', function() {
        beforeEach(function() {
          colorMarker.color.alpha = 1;
          return colorMarker.convertContentToRGBA();
        });
        return it('replaces the text in the editor by the rgba version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: rgba(255, 0, 0, 1);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    describe('::convertContentToRGB', function() {
      beforeEach(function() {
        colorMarker.color.alpha = 1;
        return colorMarker.convertContentToRGB();
      });
      it('replaces the text in the editor by the rgb version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: rgb(255, 0, 0);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is not 1', function() {
        beforeEach(function() {
          return colorMarker.convertContentToRGB();
        });
        return it('replaces the text in the editor by the rgb version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: rgb(255, 0, 0);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    describe('::convertContentToHSLA', function() {
      beforeEach(function() {
        return colorMarker.convertContentToHSLA();
      });
      it('replaces the text in the editor by the hsla version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: hsla(0, 100%, 50%, 0.5);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is 1', function() {
        beforeEach(function() {
          colorMarker.color.alpha = 1;
          return colorMarker.convertContentToHSLA();
        });
        return it('replaces the text in the editor by the hsla version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: hsla(0, 100%, 50%, 1);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
    return describe('::convertContentToHSL', function() {
      beforeEach(function() {
        colorMarker.color.alpha = 1;
        return colorMarker.convertContentToHSL();
      });
      it('replaces the text in the editor by the hsl version', function() {
        return expect(editor.getText()).toEqual("body {\n  color: hsl(0, 100%, 50%);\n  bar: foo;\n  foo: bar;\n}");
      });
      return describe('when the color alpha is not 1', function() {
        beforeEach(function() {
          return colorMarker.convertContentToHSL();
        });
        return it('replaces the text in the editor by the hsl version', function() {
          return expect(editor.getText()).toEqual("body {\n  color: hsl(0, 100%, 50%);\n  bar: foo;\n  foo: bar;\n}");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItbWFya2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEscUVBQUE7QUFBQSxJQUFBLE9BQW9FLEVBQXBFLEVBQUMsZ0JBQUQsRUFBUyxnQkFBVCxFQUFpQixxQkFBakIsRUFBOEIsNEJBQTlCLEVBQWtELHdCQUFsRCxDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSx3QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixFQUEvQixDQUFULENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxPQUFQLENBQWUseUVBQWYsQ0FEQSxDQUFBO0FBQUEsTUFRQSxNQUFBLEdBQVMsTUFBTSxDQUFDLGVBQVAsQ0FBdUIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxFQUFILENBQVAsQ0FBdkIsQ0FSVCxDQUFBO0FBQUEsTUFTQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLEdBQWpCLENBVFosQ0FBQTtBQUFBLE1BVUEsSUFBQSxHQUFPLDBCQVZQLENBQUE7QUFBQSxNQVdBLFdBQUEsR0FBYztBQUFBLFFBQUMsUUFBQSxNQUFEO09BWGQsQ0FBQTthQWFBLFdBQUEsR0FBa0Is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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-marker-spec.coffee
