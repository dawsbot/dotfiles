(function() {
  describe("React tests", function() {
    var sampleCorrectAddonsES6File, sampleCorrectAddonsFile, sampleCorrectES6File, sampleCorrectFile, sampleCorrectNativeFile, sampleInvalidFile;
    sampleCorrectFile = require.resolve('./fixtures/sample-correct.js');
    sampleCorrectNativeFile = require.resolve('./fixtures/sample-correct-native.js');
    sampleCorrectES6File = require.resolve('./fixtures/sample-correct-es6.js');
    sampleCorrectAddonsES6File = require.resolve('./fixtures/sample-correct-addons-es6.js');
    sampleCorrectAddonsFile = require.resolve('./fixtures/sample-correct-addons.js');
    sampleInvalidFile = require.resolve('./fixtures/sample-invalid.js');
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      return afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
    });
    return describe("should select correct grammar", function() {
      it("should select source.js.jsx if file has require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react-native')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectNativeFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react/addons')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react/addons es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      return it("should select source.js if file doesnt have require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleInvalidFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js');
            return editor.destroy();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlYWN0L3NwZWMvYXRvbS1yZWFjdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSx3SUFBQTtBQUFBLElBQUEsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsOEJBQWhCLENBQXBCLENBQUE7QUFBQSxJQUNBLHVCQUFBLEdBQTBCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHFDQUFoQixDQUQxQixDQUFBO0FBQUEsSUFFQSxvQkFBQSxHQUF1QixPQUFPLENBQUMsT0FBUixDQUFnQixrQ0FBaEIsQ0FGdkIsQ0FBQTtBQUFBLElBR0EsMEJBQUEsR0FBNkIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IseUNBQWhCLENBSDdCLENBQUE7QUFBQSxJQUlBLHVCQUFBLEdBQTBCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHFDQUFoQixDQUoxQixDQUFBO0FBQUEsSUFLQSxpQkFBQSxHQUFvQixPQUFPLENBQUMsT0FBUixDQUFnQiw4QkFBaEIsQ0FMcEIsQ0FBQTtBQUFBLElBT0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxNQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCLEVBRGM7TUFBQSxDQUFoQixDQUhBLENBQUE7YUFNQSxTQUFBLENBQVUsU0FBQSxHQUFBO0FBQ1IsUUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/react/spec/atom-react-spec.coffee
