(function() {
  var grammarTest, path;

  path = require('path');

  grammarTest = require('atom-grammar-test');

  describe('Grammar', function() {
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-todo');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-hyperlink');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-mustache');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-html');
      });
    });
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/flow.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-class.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-functions.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-symbols.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-template-strings.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-attributes.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-es6.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-features.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-full-react-class.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-text.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/declare.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/browser-polyfill.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/bundle.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.min.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/everythingJs/es2015-module.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/doc-keywords.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/flow-predicates.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/issues.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/misc.js'));
    return grammarTest(path.join(__dirname, 'fixtures/grammar/es6module.js'));
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL3NwZWMvZ3JhbW1hci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG1CQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixvQkFBOUIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTtBQUFBLE1BTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCLEVBRGM7TUFBQSxDQUFoQixDQU5BLENBQUE7YUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixlQUE5QixFQURjO01BQUEsQ0FBaEIsRUFUUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFhQSxXQUFBLENBQVks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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/spec/grammar-spec.coffee
