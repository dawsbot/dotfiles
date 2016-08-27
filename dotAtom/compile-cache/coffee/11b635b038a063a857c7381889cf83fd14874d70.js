(function() {
  var ColorContext, ColorParser, registry,
    __slice = [].slice;

  ColorContext = require('../lib/color-context');

  ColorParser = require('../lib/color-parser');

  registry = require('../lib/color-expressions');

  describe('ColorContext', function() {
    var context, itParses, parser, _ref;
    _ref = [], context = _ref[0], parser = _ref[1];
    itParses = function(expression) {
      return {
        asUndefined: function() {
          return it("parses '" + expression + "' as undefined", function() {
            return expect(context.getValue(expression)).toBeUndefined();
          });
        },
        asUndefinedColor: function() {
          return it("parses '" + expression + "' as undefined color", function() {
            return expect(context.readColor(expression)).toBeUndefined();
          });
        },
        asInt: function(expected) {
          return it("parses '" + expression + "' as an integer with value of " + expected, function() {
            return expect(context.readInt(expression)).toEqual(expected);
          });
        },
        asFloat: function(expected) {
          return it("parses '" + expression + "' as a float with value of " + expected, function() {
            return expect(context.readFloat(expression)).toEqual(expected);
          });
        },
        asIntOrPercent: function(expected) {
          return it("parses '" + expression + "' as an integer or a percentage with value of " + expected, function() {
            return expect(context.readIntOrPercent(expression)).toEqual(expected);
          });
        },
        asFloatOrPercent: function(expected) {
          return it("parses '" + expression + "' as a float or a percentage with value of " + expected, function() {
            return expect(context.readFloatOrPercent(expression)).toEqual(expected);
          });
        },
        asColorExpression: function(expected) {
          return it("parses '" + expression + "' as a color expression", function() {
            return expect(context.readColorExpression(expression)).toEqual(expected);
          });
        },
        asColor: function() {
          var expected;
          expected = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return it("parses '" + expression + "' as a color with value of " + (jasmine.pp(expected)), function() {
            var _ref1;
            return (_ref1 = expect(context.readColor(expression))).toBeColor.apply(_ref1, expected);
          });
        },
        asInvalidColor: function() {
          var expected;
          expected = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return it("parses '" + expression + "' as an invalid color", function() {
            return expect(context.readColor(expression)).not.toBeValid();
          });
        }
      };
    };
    describe('created without any variables', function() {
      beforeEach(function() {
        return context = new ColorContext({
          registry: registry
        });
      });
      itParses('10').asInt(10);
      itParses('10').asFloat(10);
      itParses('0.5').asFloat(0.5);
      itParses('.5').asFloat(0.5);
      itParses('10').asIntOrPercent(10);
      itParses('10%').asIntOrPercent(26);
      itParses('0.1').asFloatOrPercent(0.1);
      itParses('10%').asFloatOrPercent(0.1);
      itParses('red').asColorExpression('red');
      itParses('red').asColor(255, 0, 0);
      itParses('#ff0000').asColor(255, 0, 0);
      return itParses('rgb(255,127,0)').asColor(255, 127, 0);
    });
    describe('with a variables array', function() {
      var createColorVar, createVar;
      createVar = function(name, value, path) {
        return {
          value: value,
          name: name,
          path: path != null ? path : '/path/to/file.coffee'
        };
      };
      createColorVar = function(name, value, path) {
        var v;
        v = createVar(name, value, path);
        v.isColor = true;
        return v;
      };
      describe('that contains valid variables', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createVar('x', '10'), createVar('y', '0.1'), createVar('z', '10%'), createColorVar('c', 'rgb(255,127,0)')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('x').asInt(10);
        itParses('y').asFloat(0.1);
        itParses('z').asIntOrPercent(26);
        itParses('z').asFloatOrPercent(0.1);
        itParses('c').asColorExpression('rgb(255,127,0)');
        return itParses('c').asColor(255, 127, 0);
      });
      describe('that contains alias for named colors', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('$text-color', 'white', '/path/to/file.css.sass'), createColorVar('$background-color', 'black', '/path/to/file.css.sass')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('$text-color').asColor(255, 255, 255);
        return itParses('$background-color').asColor(0, 0, 0);
      });
      describe('that contains invalid colors', function() {
        beforeEach(function() {
          var variables;
          variables = [createVar('@text-height', '@scale-b-xxl * 1rem'), createVar('@component-line-height', '@text-height'), createVar('@list-item-height', '@component-line-height')];
          return context = new ColorContext({
            variables: variables,
            registry: registry
          });
        });
        return itParses('@list-item-height').asUndefinedColor();
      });
      describe('that contains circular references', function() {
        beforeEach(function() {
          var variables;
          variables = [createVar('@foo', '@bar'), createVar('@bar', '@baz'), createVar('@baz', '@foo'), createVar('@taz', '@taz')];
          return context = new ColorContext({
            variables: variables,
            registry: registry
          });
        });
        itParses('@foo').asUndefined();
        return itParses('@taz').asUndefined();
      });
      describe('that contains circular references', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('@foo', '@bar'), createColorVar('@bar', '@baz'), createColorVar('@baz', '@foo'), createColorVar('@taz', '@taz')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        itParses('@foo').asInvalidColor();
        itParses('@foo').asUndefined();
        return itParses('@taz').asUndefined();
      });
      return describe('that contains circular references nested in operations', function() {
        beforeEach(function() {
          var colorVariables, variables;
          variables = [createColorVar('@foo', 'complement(@bar)'), createColorVar('@bar', 'transparentize(@baz, 0.5)'), createColorVar('@baz', 'darken(@foo, 10%)')];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            variables: variables,
            colorVariables: colorVariables,
            registry: registry
          });
        });
        return itParses('@foo').asInvalidColor();
      });
    });
    describe('with variables from a default file', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value, path) {
        var v;
        v = createVar(name, value, path);
        v.isColor = true;
        return v;
      };
      describe('when there is another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/.pigments"), createVar('b', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(20);
      });
      describe('when there is no another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/.pigments"), createVar('b', 'c', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      describe('when there is another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', "" + projectPath + "/.pigments"), createColorVar('b', '#0000ff', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(0, 0, 255);
      });
      return describe('when there is no another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', "" + projectPath + "/.pigments"), createColorVar('b', 'c', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(255, 0, 0);
      });
    });
    describe('with a reference variable', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/b.styl"), createVar('b', '20', "" + projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath, "" + projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
    return describe('with a reference path', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: "" + projectPath + "/a.styl",
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/b.styl"), createVar('b', '20', "" + projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: "" + projectPath + "/a.styl",
            rootPaths: [projectPath, "" + projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3ItY29udGV4dC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxtQ0FBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUFmLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFFBQUEsK0JBQUE7QUFBQSxJQUFBLE9BQW9CLEVBQXBCLEVBQUMsaUJBQUQsRUFBVSxnQkFBVixDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsU0FBQyxVQUFELEdBQUE7YUFDVDtBQUFBLFFBQUEsV0FBQSxFQUFhLFNBQUEsR0FBQTtpQkFDWCxFQUFBLENBQUksVUFBQSxHQUFVLFVBQVYsR0FBcUIsZ0JBQXpCLEVBQTBDLFNBQUEsR0FBQTttQkFDeEMsTUFBQSxDQUFPLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFVBQWpCLENBQVAsQ0FBb0MsQ0FBQyxhQUFyQyxDQUFBLEVBRHdDO1VBQUEsQ0FBMUMsRUFEVztRQUFBLENBQWI7QUFBQSxRQUlBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtpQkFDaEIsRUFBQSxDQUFJLFVBQUEsR0FBVSxVQUFWLEdBQXFCLHNCQUF6QixFQUFnRCxTQUFBLEdBQUE7bUJBQzlDLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBUixDQUFrQixVQUFsQixDQUFQLENBQXFDLENBQUMsYUFBdEMsQ0FBQSxFQUQ4QztVQUFBLENBQWhELEVBRGdCO1FBQUEsQ0FKbEI7QUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-context-spec.coffee
