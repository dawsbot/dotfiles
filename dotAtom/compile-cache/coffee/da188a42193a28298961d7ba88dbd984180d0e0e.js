(function() {
  describe('Coffee-React grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('react');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('source.coffee.jsx');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('source.coffee.jsx');
    });
    it('tokenizes CoffeeScript', function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo = @bar').tokens;
      expect(tokens.length).toEqual(5);
      expect(tokens[0]).toEqual({
        value: 'foo',
        scopes: ['source.coffee.jsx', 'variable.assignment.coffee']
      });
      expect(tokens[1]).toEqual({
        value: ' ',
        scopes: ['source.coffee.jsx']
      });
      expect(tokens[2]).toEqual({
        value: '=',
        scopes: ['source.coffee.jsx', 'keyword.operator.coffee']
      });
      expect(tokens[3]).toEqual({
        value: ' ',
        scopes: ['source.coffee.jsx']
      });
      return expect(tokens[4]).toEqual({
        value: '@bar',
        scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
      });
    });
    return describe('CJSX', function() {
      it('tokenizes CJSX', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>hi</div>').tokens;
        expect(tokens.length).toEqual(7);
        expect(tokens[0]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[1]).toEqual({
          value: 'div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        expect(tokens[2]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
        expect(tokens[3]).toEqual({
          value: 'hi',
          scopes: ['source.coffee.jsx']
        });
        expect(tokens[4]).toEqual({
          value: '<',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.begin.html']
        });
        expect(tokens[5]).toEqual({
          value: '/div',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.name.tag.other.html']
        });
        return expect(tokens[6]).toEqual({
          value: '>',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'punctuation.definition.tag.end.html']
        });
      });
      it('tokenizes props', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="span6"></div>').tokens;
        expect(tokens.length).toEqual(12);
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[3]).toEqual({
          value: 'className',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
        expect(tokens[4]).toEqual({
          value: '=',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html']
        });
        expect(tokens[5]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.begin.html']
        });
        expect(tokens[6]).toEqual({
          value: 'span6',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html']
        });
        return expect(tokens[7]).toEqual({
          value: '"',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'punctuation.definition.string.end.html']
        });
      });
      it('tokenizes props with digits', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div thing1="hi"></div>').tokens;
        return expect(tokens[3]).toEqual({
          value: 'thing1',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'entity.other.attribute-name.html']
        });
      });
      it('tokenizes interpolated CoffeeScript strings', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div className="#{@var}"></div>').tokens;
        expect(tokens.length).toEqual(14);
        expect(tokens[6]).toEqual({
          value: '#{',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
        expect(tokens[7]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[8]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.tag.other.html', 'string.quoted.double.html', 'source.coffee.embedded.source', 'punctuation.section.embedded.coffee']
        });
      });
      it('tokenizes embedded CoffeeScript', function() {
        var tokens;
        tokens = grammar.tokenizeLine('<div>{@var}</div>').tokens;
        expect(tokens.length).toEqual(9);
        expect(tokens[3]).toEqual({
          value: '{',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
        expect(tokens[4]).toEqual({
          value: '@var',
          scopes: ['source.coffee.jsx', 'variable.other.readwrite.instance.coffee']
        });
        return expect(tokens[5]).toEqual({
          value: '}',
          scopes: ['source.coffee.jsx', 'meta.brace.curly.coffee']
        });
      });
      return it("doesn't tokenize inner CJSX as CoffeeScript", function() {
        var tokens;
        tokens = grammar.tokenizeLine("<div>it's and</div>").tokens;
        expect(tokens.length).toEqual(7);
        return expect(tokens[3]).toEqual({
          value: "it's and",
          scopes: ['source.coffee.jsx']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlYWN0L3NwZWMvY29mZmVlLXJlYWN0LWdyYW1tYXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtBQUMvQixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLHdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO2FBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtlQUNILE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLG1CQUFsQyxFQURQO01BQUEsQ0FBTCxFQU5TO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVdBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsVUFBaEIsQ0FBQSxDQUFBLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixtQkFBL0IsRUFGdUI7SUFBQSxDQUF6QixDQVhBLENBQUE7QUFBQSxJQWVBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsVUFBQSxNQUFBO0FBQUEsTUFBQyxTQUFVLE9BQU8sQ0FBQyxZ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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/react/spec/coffee-react-grammar-spec.coffee
