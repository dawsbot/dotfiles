(function() {
  var ColorContext, ColorScanner, registry;

  ColorScanner = require('../lib/color-scanner');

  ColorContext = require('../lib/color-context');

  registry = require('../lib/color-expressions');

  describe('ColorScanner', function() {
    var editor, lastIndex, result, scanner, text, withScannerForString, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2], result = _ref[3], lastIndex = _ref[4];
    withScannerForString = function(string, block) {
      return describe("with '" + (string.replace(/#/g, '+')) + "'", function() {
        beforeEach(function() {
          var context;
          text = string;
          context = new ColorContext({
            registry: registry
          });
          return scanner = new ColorScanner({
            context: context
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            return text = editor.getText();
          });
        });
        afterEach(function() {
          return editor = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          var context;
          context = new ColorContext({
            registry: registry
          });
          return scanner = new ColorScanner({
            context: context
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      withScannerForTextEditor('html-entities.html', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'html');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('css-color-with-prefix.less', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'less');
        });
        return it('returns nothing', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([13, 17]);
          });
          it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
          it('stores the matched text', function() {
            return expect(result.match).toEqual('#fff');
          });
          it('stores the last index', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          return it('stores match line', function() {
            return expect(result.line).toEqual(0);
          });
        });
        return describe('successive searches', function() {
          it('returns a buffer color for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
          return it('stores the line of successive matches', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, 'styl', result.lastIndex);
            };
            expect(doSearch().line).toEqual(2);
            expect(doSearch().line).toEqual(4);
            return expect(doSearch().line).toEqual(6);
          });
        });
      });
      withScannerForTextEditor('class-after-color.sass', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'sass');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        return describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([15, 20]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
        });
      });
      withScannerForTextEditor('project/styles/variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        return describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([18, 25]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#BF616A');
          });
        });
      });
      withScannerForTextEditor('crlf.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text, 'styl');
        });
        it('returns the first buffer color match', function() {
          return expect(result).toBeDefined();
        });
        describe('the resulting buffer color', function() {
          it('has a text range', function() {
            return expect(result.range).toEqual([7, 11]);
          });
          return it('has a color', function() {
            return expect(result.color).toBeColor('#ffffff');
          });
        });
        return it('finds the second color', function() {
          var doSearch;
          doSearch = function() {
            return result = scanner.search(text, 'styl', result.lastIndex);
          };
          doSearch();
          return expect(result.color).toBeDefined();
        });
      });
      withScannerForTextEditor('color-in-tag-content.html', function() {
        return it('finds both colors', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          expect(doSearch()).toBeDefined();
          expect(doSearch()).toBeDefined();
          return expect(doSearch()).toBeUndefined();
        });
      });
      withScannerForString('#add-something {}, #acedbe-foo {}, #acedbeef-foo {}', function() {
        return it('does not find any matches', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          return expect(doSearch()).toBeUndefined();
        });
      });
      return withScannerForString('#add_something {}, #acedbe_foo {}, #acedbeef_foo {}', function() {
        return it('does not find any matches', function() {
          var doSearch;
          result = {
            lastIndex: 0
          };
          doSearch = function() {
            return result = scanner.search(text, 'css', result.lastIndex);
          };
          return expect(doSearch()).toBeUndefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvY29sb3Itc2Nhbm5lci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQ0FBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLDhHQUFBO0FBQUEsSUFBQSxPQUE2QyxFQUE3QyxFQUFDLGlCQUFELEVBQVUsZ0JBQVYsRUFBa0IsY0FBbEIsRUFBd0IsZ0JBQXhCLEVBQWdDLG1CQUFoQyxDQUFBO0FBQUEsSUFFQSxvQkFBQSxHQUF1QixTQUFDLE1BQUQsRUFBUyxLQUFULEdBQUE7YUFDckIsUUFBQSxDQUFVLFFBQUEsR0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFQLENBQWUsSUFBZixFQUFxQixHQUFyQixDQUFELENBQVAsR0FBa0MsR0FBNUMsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsT0FBQTtBQUFBLFVBQUEsSUFBQSxHQUFPLE1BQVAsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxHQUFjLElBQUEsWUFBQSxDQUFhO0FBQUEsWUFBQyxVQUFBLFFBQUQ7V0FBYixDQURkLENBQUE7aUJBRUEsT0FBQSxHQUFjLElBQUEsWUFBQSxDQUFhO0FBQUEsWUFBQyxTQUFBLE9BQUQ7V0FBYixFQUhMO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUtBLFNBQUEsQ0FBVSxTQUFBLEdB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/color-scanner-spec.coffee
