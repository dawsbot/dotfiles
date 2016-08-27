(function() {
  var VariableParser, registry;

  VariableParser = require('../lib/variable-parser');

  registry = require('../lib/variable-expressions');

  describe('VariableParser', function() {
    var itParses, parser;
    parser = [][0];
    itParses = function(expression) {
      return {
        as: function(variables) {
          it("parses '" + expression + "' as variables " + (jasmine.pp(variables)), function() {
            var expected, name, range, results, value, _i, _len, _ref, _results;
            results = parser.parse(expression);
            expect(results.length).toEqual(Object.keys(variables).length);
            _results = [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              _ref = results[_i], name = _ref.name, value = _ref.value, range = _ref.range;
              expected = variables[name];
              if (expected.value != null) {
                _results.push(expect(value).toEqual(expected.value));
              } else if (expected.range != null) {
                _results.push(expect(range).toEqual(expected.range));
              } else {
                _results.push(expect(value).toEqual(expected));
              }
            }
            return _results;
          });
          return this;
        },
        asUndefined: function() {
          return it("does not parse '" + expression + "' as a variable expression", function() {
            var results;
            results = parser.parse(expression);
            return expect(results).toBeUndefined();
          });
        }
      };
    };
    beforeEach(function() {
      return parser = new VariableParser(registry);
    });
    itParses('color = white').as({
      'color': 'white'
    });
    itParses('non-color = 10px').as({
      'non-color': '10px'
    });
    itParses('$color: white').as({
      '$color': 'white'
    });
    itParses('$color: white // foo').as({
      '$color': 'white'
    });
    itParses('$color  : white').as({
      '$color': 'white'
    });
    itParses('$some-color: white;').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$some_color  : white').as({
      '$some-color': 'white',
      '$some_color': 'white'
    });
    itParses('$non-color: 10px;').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('$non_color: 10px').as({
      '$non-color': '10px',
      '$non_color': '10px'
    });
    itParses('@color: white;').as({
      '@color': 'white'
    });
    itParses('@non-color: 10px;').as({
      '@non-color': '10px'
    });
    itParses('@non--color: 10px;').as({
      '@non--color': '10px'
    });
    itParses('--color: white;').as({
      'var(--color)': 'white'
    });
    itParses('--non-color: 10px;').as({
      'var(--non-color)': '10px'
    });
    itParses('\\definecolor{orange}{gray}{1}').as({
      '{orange}': 'gray(100%)'
    });
    itParses('\\definecolor{orange}{RGB}{255,127,0}').as({
      '{orange}': 'rgb(255,127,0)'
    });
    itParses('\\definecolor{orange}{rgb}{1,0.5,0}').as({
      '{orange}': 'rgb(255,127,0)'
    });
    itParses('\\definecolor{orange}{cmyk}{0,0.5,1,0}').as({
      '{orange}': 'cmyk(0,0.5,1,0)'
    });
    itParses('\\definecolor{orange}{HTML}{FF7F00}').as({
      '{orange}': '#FF7F00'
    });
    itParses('\\definecolor{darkgreen}{blue!20!black!30!green}').as({
      '{darkgreen}': '{blue!20!black!30!green}'
    });
    itParses('\n.error--large(@color: red) {\n  background-color: @color;\n}').asUndefined();
    return itParses("colors = {\n  red: rgb(255,0,0),\n  green: rgb(0,255,0),\n  blue: rgb(0,0,255)\n  value: 10px\n  light: {\n    base: lightgrey\n  }\n  dark: {\n    base: slategrey\n  }\n}").as({
      'colors.red': {
        value: 'rgb(255,0,0)',
        range: [[1, 2], [1, 14]]
      },
      'colors.green': {
        value: 'rgb(0,255,0)',
        range: [[2, 2], [2, 16]]
      },
      'colors.blue': {
        value: 'rgb(0,0,255)',
        range: [[3, 2], [3, 15]]
      },
      'colors.value': {
        value: '10px',
        range: [[4, 2], [4, 13]]
      },
      'colors.light.base': {
        value: 'lightgrey',
        range: [[9, 4], [9, 17]]
      },
      'colors.dark.base': {
        value: 'slategrey',
        range: [[12, 4], [12, 14]]
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvdmFyaWFibGUtcGFyc2VyLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsd0JBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsNkJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUEsR0FBQTtBQUN6QixRQUFBLGdCQUFBO0FBQUEsSUFBQyxTQUFVLEtBQVgsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLFNBQUMsVUFBRCxHQUFBO2FBQ1Q7QUFBQSxRQUFBLEVBQUEsRUFBSSxTQUFDLFNBQUQsR0FBQTtBQUNGLFVBQUEsRUFBQSxDQUFJLFVBQUEsR0FBVSxVQUFWLEdBQXFCLGlCQUFyQixHQUFxQyxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxDQUFELENBQXpDLEVBQW1FLFNBQUEsR0FBQTtBQUNqRSxnQkFBQSwrREFBQTtBQUFBLFlBQUEsT0FBQSxHQUFVLE1BQU0sQ0FBQyxLQUFQLENBQWEsVUFBYixDQUFWLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsTUFBZixDQUFzQixDQUFDLE9BQXZCLENBQStCLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBWixDQUFzQixDQUFDLE1BQXRELENBRkEsQ0FBQTtBQUdBO2lCQUFBLDhDQUFBLEdBQUE7QUFDRSxrQ0FERyxZQUFBLE1BQU0sYUFBQSxPQUFPLGFBQUEsS0FDaEIsQ0FBQTtBQUFBLGNBQUEsUUFBQSxHQUFXLFNBQVUsQ0FBQSxJQUFBLENBQXJCLENBQUE7QUFDQSxjQUFBLElBQUcsc0JBQUg7OEJBQ0Us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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/variable-parser-spec.coffee
