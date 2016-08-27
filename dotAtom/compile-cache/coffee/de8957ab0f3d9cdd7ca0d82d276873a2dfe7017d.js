(function() {
  var VariableScanner, path, registry, scopeFromFileName;

  path = require('path');

  VariableScanner = require('../lib/variable-scanner');

  registry = require('../lib/variable-expressions');

  scopeFromFileName = require('../lib/scope-from-file-name');

  describe('VariableScanner', function() {
    var editor, scanner, scope, text, withScannerForTextEditor, withTextEditor, _ref;
    _ref = [], scanner = _ref[0], editor = _ref[1], text = _ref[2], scope = _ref[3];
    withTextEditor = function(fixture, block) {
      return describe("with " + fixture + " buffer", function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(fixture);
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            text = editor.getText();
            return scope = scopeFromFileName(editor.getPath());
          });
        });
        afterEach(function() {
          editor = null;
          return scope = null;
        });
        return block();
      });
    };
    withScannerForTextEditor = function(fixture, block) {
      return withTextEditor(fixture, function() {
        beforeEach(function() {
          return scanner = new VariableScanner({
            registry: registry,
            scope: scope
          });
        });
        afterEach(function() {
          return scanner = null;
        });
        return block();
      });
    };
    return describe('::search', function() {
      var result;
      result = [][0];
      withScannerForTextEditor('four-variables.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        it('returns the first match', function() {
          return expect(result).toBeDefined();
        });
        describe('the result object', function() {
          it('has a match string', function() {
            return expect(result.match).toEqual('base-color = #fff');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(17);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([0, 17]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('base-color');
            expect(result[0].value).toEqual('#fff');
            expect(result[0].range).toEqual([0, 17]);
            return expect(result[0].line).toEqual(0);
          });
        });
        describe('the second result object', function() {
          beforeEach(function() {
            return result = scanner.search(text, result.lastIndex);
          });
          it('has a match string', function() {
            return expect(result.match).toEqual('other-color = transparentize(base-color, 50%)');
          });
          it('has a lastIndex property', function() {
            return expect(result.lastIndex).toEqual(64);
          });
          it('has a range property', function() {
            return expect(result.range).toEqual([19, 64]);
          });
          return it('has a variable result', function() {
            expect(result[0].name).toEqual('other-color');
            expect(result[0].value).toEqual('transparentize(base-color, 50%)');
            expect(result[0].range).toEqual([19, 64]);
            return expect(result[0].line).toEqual(2);
          });
        });
        return describe('successive searches', function() {
          return it('returns a result for each match and then undefined', function() {
            var doSearch;
            doSearch = function() {
              return result = scanner.search(text, result.lastIndex);
            };
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            expect(doSearch()).toBeDefined();
            return expect(doSearch()).toBeUndefined();
          });
        });
      });
      withScannerForTextEditor('incomplete-stylus-hash.styl', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-arguments.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('attribute-selectors.scss', function() {
        beforeEach(function() {
          return result = scanner.search(text);
        });
        return it('does not find any variables', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-in-conditions.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('does not find the variable in the if clause', function() {
          return expect(result).toBeUndefined();
        });
      });
      withScannerForTextEditor('variables-after-mixins.scss', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable after the mixin', function() {
          return expect(result).toBeDefined();
        });
      });
      withScannerForTextEditor('variables-from-other-process.less', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          return doSearch();
        });
        return it('finds the variable with an interpolation tag', function() {
          return expect(result).toBeDefined();
        });
      });
      return withScannerForTextEditor('crlf.styl', function() {
        beforeEach(function() {
          var doSearch;
          result = null;
          doSearch = function() {
            return result = scanner.search(text, result != null ? result.lastIndex : void 0);
          };
          doSearch();
          return doSearch();
        });
        return it('finds all the variables even with crlf mode', function() {
          return expect(result).toBeDefined();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL3NwZWMvdmFyaWFibGUtc2Nhbm5lci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrREFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUixDQURsQixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxpQkFBQSxHQUFvQixPQUFBLENBQVEsNkJBQVIsQ0FIcEIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsUUFBQSw0RUFBQTtBQUFBLElBQUEsT0FBaUMsRUFBakMsRUFBQyxpQkFBRCxFQUFVLGdCQUFWLEVBQWtCLGNBQWxCLEVBQXdCLGVBQXhCLENBQUE7QUFBQSxJQUVBLGNBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO2FBQ2YsUUFBQSxDQUFVLE9BQUEsR0FBTyxPQUFQLEdBQWUsU0FBekIsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7bUJBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLE9BQXBCLEVBQUg7VUFBQSxDQUFoQixDQUFBLENBQUE7aUJBQ0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxZQUNBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBRFAs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/spec/variable-scanner-spec.coffee
