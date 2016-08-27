(function() {
  var AutoIndent, Point, Range, fs, path, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  AutoIndent = require('../lib/auto-indent');

  describe('auto-indent', function() {
    var autoIndent, editor, notifications, sourceCode, sourceCodeRange, _ref1;
    _ref1 = [], autoIndent = _ref1[0], editor = _ref1[1], notifications = _ref1[2], sourceCode = _ref1[3], sourceCodeRange = _ref1[4];
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('non-existent.js').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        autoIndent = new AutoIndent(editor);
        return notifications = atom.notifications;
      });
    });
    describe('::constructor', function() {
      return it(' should setup some valid indentation defaults', function() {
        var expectedResult;
        expectedResult = {
          jsxIndent: [1, 1],
          jsxIndentProps: [1, 1],
          jsxClosingBracketLocation: [
            1, {
              selfClosing: 'tag-aligned',
              nonEmpty: 'tag-aligned'
            }
          ]
        };
        return expect(autoIndent.eslintIndentOptions).toEqual(expectedResult);
      });
    });
    describe('::getEslintrcFilename', function() {
      it('returns a correct project path for the source file', function() {
        return expect(path.dirname(autoIndent.getEslintrcFilename())).toEqual(path.dirname(editor.getPath()));
      });
      return it('returns a .eslintrc file name', function() {
        return expect(path.basename(autoIndent.getEslintrcFilename())).toEqual('.eslintrc');
      });
    });
    return describe('::readEslintrcOptions', function() {
      it('returns an empty object on a missing .eslintrc', function() {
        return expect(autoIndent.readEslintrcOptions('.missing')).toEqual({});
      });
      it('returns and empty Object and a notification message on bad eslint', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      it('returns an empty Object when eslint with no rules is read', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{}');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).not.toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      describe('::translateIndentOptions', function() {
        it('should return expected defaults when no object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions();
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return expected defaults when no valid object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions({});
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return two tab markers for jsx and props when an indent of 4 spaces is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return one tab markers for jsx and props when an indent "tab" is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, "tab"]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 3', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [1, 3],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            'react/jsx-closing-bracket-location': [1, 'line-aligned']
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'line-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        return it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned and props-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            "react/jsx-closing-bracket-location": [
              1, {
                "nonEmpty": "props-aligned",
                "selfClosing": "line-aligned"
              }
            ]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
      });
      describe('::indentJSX', function() {
        beforeEach(function() {
          sourceCode = "<div className={rootClass}>\n{this._renderPlaceholder()}\n<div\nclassName={cx('DraftEditor/editorContainer')}\nkey={'editor' + this.state.containerKey}\nref=\"editorContainer\"\n>\n<div\naria-activedescendant={\nreadOnly ? null : this.props.ariaActiveDescendantID\n}\naria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n>\n{this._renderPlaceholder()}\n<Component p1\np2\n/>\n</div>\n</div>\n</div>";
          editor.insertText(sourceCode);
          return sourceCodeRange = new Range(new Point(0, 0), new Point(19, 6));
        });
        it('should indent JSX according to eslint rules', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n    >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n        >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n            />\n        </div>\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
        return it('should indent JSX according to eslint rules and tag closing alignment', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n        >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n            >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n                />\n        </div>\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'props-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
      });
      return describe('insert-nl-jsx', function() {
        return it('should insert two new lines and position cursor between JSX tags', function() {
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tabs-aligned',
                nonEmpty: 'tabs-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          editor.insertText('<div></div>');
          editor.setCursorBufferPosition([0, 5]);
          editor.insertText('\n');
          expect(editor.getTextInBufferRange([[0, 0], [0, 5]])).toEqual("<div>");
          expect(editor.getTextInBufferRange([[1, 0], [1, 2]])).toEqual("  ");
          expect(editor.getTextInBufferRange([[2, 0], [2, 6]])).toEqual("</div>");
          return expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL3NwZWMvYXV0by1pbmRlbnQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLHFFQUFBO0FBQUEsSUFBQSxRQUFtRSxFQUFuRSxFQUFDLHFCQUFELEVBQWEsaUJBQWIsRUFBcUIsd0JBQXJCLEVBQW9DLHFCQUFwQyxFQUFnRCwwQkFBaEQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QixFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFNQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixpQkFBcEIsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxTQUFDLENBQUQsR0FBQTtpQkFBTyxNQUFBLEdBQVMsRUFBaEI7UUFBQSxDQUE1QyxFQURjO01BQUEsQ0FBaEIs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/language-babel/spec/auto-indent-spec.coffee
