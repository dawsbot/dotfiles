(function() {
  var TextEditor, buildTextEditor;

  TextEditor = null;

  buildTextEditor = function(params) {
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      if (TextEditor == null) {
        TextEditor = require('atom').TextEditor;
      }
      return new TextEditor(params);
    }
  };

  describe("React grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.js.jsx");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.js.jsx");
    });
    describe("strings", function() {
      return it("tokenizes single-line strings", function() {
        var delim, delimsByScope, scope, tokens, _results;
        delimsByScope = {
          "string.quoted.double.js": '"',
          "string.quoted.single.js": "'"
        };
        _results = [];
        for (scope in delimsByScope) {
          delim = delimsByScope[scope];
          tokens = grammar.tokenizeLine(delim + "x" + delim).tokens;
          expect(tokens[0].value).toEqual(delim);
          expect(tokens[0].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.begin.js"]);
          expect(tokens[1].value).toEqual("x");
          expect(tokens[1].scopes).toEqual(["source.js.jsx", scope]);
          expect(tokens[2].value).toEqual(delim);
          _results.push(expect(tokens[2].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.end.js"]));
        }
        return _results;
      });
    });
    describe("keywords", function() {
      return it("tokenizes with as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('with').tokens;
        return expect(tokens[0]).toEqual({
          value: 'with',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    describe("regular expressions", function() {
      it("tokenizes regular expressions", function() {
        var tokens;
        tokens = grammar.tokenizeLine('/test/').tokens;
        expect(tokens[0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[2]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        tokens = grammar.tokenizeLine('foo + /test/').tokens;
        expect(tokens[0]).toEqual({
          value: 'foo ',
          scopes: ['source.js.jsx']
        });
        expect(tokens[1]).toEqual({
          value: '+',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[4]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        return expect(tokens[5]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
      });
      return it("tokenizes regular expressions inside arrays", function() {
        var tokens;
        tokens = grammar.tokenizeLine('[/test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[2]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[4]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('[1, /test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(tokens[2]).toEqual({
          value: ',',
          scopes: ['source.js.jsx', 'meta.delimiter.object.comma.js']
        });
        expect(tokens[3]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[4]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[5]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[6]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[7]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('0x1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0x1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0X1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0X1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0b011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0b011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0B011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0B011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0o1411').tokens;
        expect(tokens[0]).toEqual({
          value: '0o1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
        tokens = grammar.tokenizeLine('0O1411').tokens;
        return expect(tokens[0]).toEqual({
          value: '0O1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
      });
    });
    describe("operators", function() {
      it("tokenizes void correctly", function() {
        var tokens;
        tokens = grammar.tokenizeLine('void').tokens;
        return expect(tokens[0]).toEqual({
          value: 'void',
          scopes: ['source.js.jsx', 'keyword.operator.void.js']
        });
      });
      return it("tokenizes the / arithmetic operator when separated by newlines", function() {
        var lines;
        lines = grammar.tokenizeLines("1\n/ 2");
        expect(lines[0][0]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(lines[1][0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(lines[1][1]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx']
        });
        return expect(lines[1][2]).toEqual({
          value: '2',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
      });
    });
    describe("ES6 string templates", function() {
      return it("tokenizes them as strings", function() {
        var tokens;
        tokens = grammar.tokenizeLine('`hey ${name}`').tokens;
        expect(tokens[0]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'hey ',
          scopes: ['source.js.jsx', 'string.quoted.template.js']
        });
        expect(tokens[2]).toEqual({
          value: '${',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        expect(tokens[3]).toEqual({
          value: 'name',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source']
        });
        expect(tokens[4]).toEqual({
          value: '}',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        return expect(tokens[5]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.end.js']
        });
      });
    });
    describe("default: in a switch statement", function() {
      return it("tokenizes it as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('default: ').tokens;
        return expect(tokens[0]).toEqual({
          value: 'default',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    it("tokenizes comments in function params", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo: function (/**Bar*/bar){').tokens;
      expect(tokens[5]).toEqual({
        value: '(',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'punctuation.definition.parameters.begin.bracket.round.js']
      });
      expect(tokens[6]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[7]).toEqual({
        value: 'Bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js']
      });
      expect(tokens[8]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      return expect(tokens[9]).toEqual({
        value: 'bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'variable.parameter.function.js']
      });
    });
    it("tokenizes /* */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/**/').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      tokens = grammar.tokenizeLine('/* foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
    });
    it("tokenizes /** */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/***/').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      tokens = grammar.tokenizeLine('/** foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.documentation.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
    });
    it("tokenizes jsx tags", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag></tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside parenthesis", function() {
      var tokens;
      tokens = grammar.tokenizeLine('return (<tag></tag>)').tokens;
      expect(tokens[3]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[6]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[7]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[8]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body", function() {
      var tokens;
      tokens = grammar.tokenizeLine('function () { return (<tag></tag>) }').tokens;
      expect(tokens[10]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[11]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[12]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[13]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body in an object", function() {
      var tokens;
      tokens = grammar.tokenizeLine('{foo:function () { return (<tag></tag>) }}').tokens;
      expect(tokens[13]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[16]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[17]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[18]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo(<tag></tag>)').tokens;
      expect(tokens[2]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[4]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[5]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[6]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[7]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside method call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('bar.foo(<tag></tag>)').tokens;
      expect(tokens[4]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[7]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[8]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[9]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes ' as string inside jsx", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag>fo\'o</tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'fo\'o',
        scopes: ["source.js.jsx", "meta.other.pcdata.js"]
      });
      expect(tokens[4]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    return describe("indentation", function() {
      var editor, expectPreservedIndentation;
      editor = null;
      beforeEach(function() {
        editor = buildTextEditor();
        return editor.setGrammar(grammar);
      });
      expectPreservedIndentation = function(text) {
        editor.setText(text);
        editor.autoIndentBufferRows(0, text.split("\n").length - 1);
        return expect(editor.getText()).toBe(text);
      };
      it("indents allman-style curly braces", function() {
        return expectPreservedIndentation("if (true)\n{\n  for (;;)\n  {\n    while (true)\n    {\n      x();\n    }\n  }\n}\n\nelse\n{\n  do\n  {\n    y();\n  } while (true);\n}");
      });
      return it("indents non-allman-style curly braces", function() {
        return expectPreservedIndentation("if (true) {\n  for (;;) {\n    while (true) {\n      x();\n    }\n  }\n} else {\n  do {\n    y();\n  } while (true);\n}");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlYWN0L3NwZWMvcmVhY3QtZ3JhbW1hci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQkFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsRUFDQSxlQUFBLEdBQWtCLFNBQUMsTUFBRCxHQUFBO0FBQ2hCLElBQUEsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixNQUEvQixFQURGO0tBQUEsTUFBQTs7UUFHRSxhQUFjLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQztPQUE5QjthQUNJLElBQUEsVUFBQSxDQUFXLE1BQVgsRUFKTjtLQURnQjtFQUFBLENBRGxCLENBQUE7O0FBQUEsRUFRQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixxQkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUIsRUFEYztNQUFBLENBQWhCLENBSEEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZCxDQUFBLEVBRlE7TUFBQSxDQUFWLENBTkEsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/react/spec/react-grammar-spec.coffee
