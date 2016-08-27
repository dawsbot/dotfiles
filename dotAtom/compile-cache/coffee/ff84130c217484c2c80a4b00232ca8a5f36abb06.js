(function() {
  describe("JSX indent", function() {
    var buffer, editor, formattedFile, formattedLines, formattedSample, fs, languageMode, sampleFile, _ref;
    fs = require('fs');
    formattedFile = require.resolve('./fixtures/sample-formatted.jsx');
    sampleFile = require.resolve('./fixtures/sample.jsx');
    formattedSample = fs.readFileSync(formattedFile);
    formattedLines = formattedSample.toString().split('\n');
    _ref = [], editor = _ref[0], buffer = _ref[1], languageMode = _ref[2];
    afterEach(function() {
      return editor.destroy();
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open(sampleFile, {
          autoIndent: false
        }).then(function(o) {
          editor = o;
          return buffer = editor.buffer, languageMode = editor.languageMode, editor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        var grammar;
        grammar = atom.grammars.grammarForScopeName("source.js.jsx");
        return editor.setGrammar(grammar);
      });
    });
    return describe("should indent sample file correctly", function() {
      return it("autoIndentBufferRows should indent same as sample file", function() {
        var i, line, _i, _ref1, _results;
        editor.autoIndentBufferRows(0, formattedLines.length - 1);
        _results = [];
        for (i = _i = 0, _ref1 = formattedLines.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          line = formattedLines[i];
          if (!line.trim()) {
            continue;
          }
          _results.push(expect((i + 1) + ":" + buffer.lineForRow(i)).toBe((i + 1) + ":" + line));
        }
        return _results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlYWN0L3NwZWMvaW5kZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLGtHQUFBO0FBQUEsSUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBO0FBQUEsSUFDQSxhQUFBLEdBQWdCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGlDQUFoQixDQURoQixDQUFBO0FBQUEsSUFFQSxVQUFBLEdBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsdUJBQWhCLENBRmIsQ0FBQTtBQUFBLElBR0EsZUFBQSxHQUFrQixFQUFFLENBQUMsWUFBSCxDQUFnQixhQUFoQixDQUhsQixDQUFBO0FBQUEsSUFJQSxjQUFBLEdBQWlCLGVBQWUsQ0FBQyxRQUFoQixDQUFBLENBQTBCLENBQUMsS0FBM0IsQ0FBaUMsSUFBakMsQ0FKakIsQ0FBQTtBQUFBLElBS0EsT0FBaUMsRUFBakMsRUFBQyxnQkFBRCxFQUFTLGdCQUFULEVBQWlCLHNCQUxqQixDQUFBO0FBQUEsSUFPQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQ1IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQURRO0lBQUEsQ0FBVixDQVBBLENBQUE7QUFBQSxJQVVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLEVBQWdDO0FBQUEsVUFBQSxVQUFBLEVBQVksS0FBWjtTQUFoQyxDQUFrRCxDQUFDLElBQW5ELENBQXdELFNBQUMsQ0FBRCxHQUFBO0FBQ3RELFVBQUEsTUFBQSxHQUFTLENBQVQsQ0FBQTtpQkFDQyxnQkFBQSxNQUFELEVBQVMsc0JBQUEsWUFBVCxFQUF5QixPQUY2QjtRQUFBLENBQXhELEVBRFk7TUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCLEVBRGM7TUFBQSxDQUFoQixDQUxBLENBQUE7QUFBQSxNQVFBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7QUFDUixRQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWQsQ0FBQSxFQUZRO01BQUEsQ0FBVixDQVJBLENBQUE7YUFZQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxPQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQyxDQUFWLENBQUE7ZUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixFQUZHO01BQUEsQ0FBTCxFQWJTO0lBQUEsQ0FBWCxDQVZBLENBQUE7V0EyQkEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTthQUM5QyxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFlBQUEsNEJBQUE7QUFBQSxRQUFBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUE1QixFQUErQixjQUFjLENBQUMsTUFBZixHQUF3QixDQUF2RCxDQUFBLENBQUE7QUFDQTthQUFTLDZHQUFULEdBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxjQUFlLENBQUEsQ0FBQSxDQUF0QixDQUFBO0FBQ0EsVUFBQSxJQUFZLENBQUEsSUFBSyxDQUFDLElBQUwsQ0FBQSxDQUFiO0FBQUEscUJBQUE7V0FEQTtBQUFBLHdCQUVBLE1BQUEsQ0FBTyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxHQUFWLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQXZCLENBQTRDLENBQUMsSUFBN0MsQ0FBbUQsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsR0FBVixHQUFnQixJQUFuRSxFQUZBLENBREY7QUFBQTt3QkFGMkQ7TUFBQSxDQUE3RCxFQUQ4QztJQUFBLENBQWhELEVBNUJxQjtFQUFBLENBQXZCLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/react/spec/indent-spec.coffee
