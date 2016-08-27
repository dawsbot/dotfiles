(function() {
  var HighlightLine, Point, Range, path, _ref;

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  HighlightLine = require('../lib/highlight-line');

  describe("Higlight line", function() {
    var activationPromise, editor, editorElement, highlightSelected, workspaceElement, _ref1;
    _ref1 = [], activationPromise = _ref1[0], workspaceElement = _ref1[1], editor = _ref1[2], editorElement = _ref1[3], highlightSelected = _ref1[4];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.workspace.open('sample.coffee');
      });
      runs(function() {
        jasmine.attachToDOM(workspaceElement);
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('highlight-line').then(function(_arg) {
          var highlightLine, mainModule;
          mainModule = _arg.mainModule;
          return highlightLine = mainModule.highlightLine, mainModule;
        });
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("when the view is loaded", function() {
      return it("does not attach to the view", function() {
        return expect(workspaceElement.querySelectorAll('.highlight-view')).toHaveLength(0);
      });
    });
    return describe("when the background color is enabled", function() {
      beforeEach(function() {
        return atom.config.set('highlight-line.enabledBackgroundColor', true);
      });
      describe("when there is only one cursor", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(8, 2));
          return editor.setSelectedBufferRange(range);
        });
        it("adds the background class to the cursor line", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(1);
        });
        return describe("when hide highlight on select is enabled", function() {
          beforeEach(function() {
            return atom.config.set('highlight-line.hideHighlightOnSelect', true);
          });
          it("will have a highlight when there is no text selected", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(1);
          });
          return it("won`t have a highlight when there is text selected", function() {
            var range;
            range = new Range(new Point(8, 2), new Point(8, 5));
            editor.setSelectedBufferRange(range);
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(0);
          });
        });
      });
      describe("when underline is enabled", function() {
        beforeEach(function() {
          return atom.config.set('highlight-line.enableUnderline', true);
        });
        describe("when solid settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'solid');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-solid-bottom')).toHaveLength(1);
          });
          return describe("when hide highlight on select is enabled", function() {
            beforeEach(function() {
              return atom.config.set('highlight-line.hideHighlightOnSelect', true);
            });
            return it("will still have a line", function() {
              var range;
              range = new Range(new Point(8, 2), new Point(8, 5));
              editor.setSelectedBufferRange(range);
              return expect(editorElement.shadowRoot.querySelectorAll('.line.highlight-line-multi-line-solid-bottom')).toHaveLength(1);
            });
          });
        });
        describe("when dashed settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'dashed');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          return it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-dashed-bottom')).toHaveLength(1);
          });
        });
        return describe("when dotted settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'dotted');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          return it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-dotted-bottom')).toHaveLength(1);
          });
        });
      });
      describe("when there are two cursors", function() {
        beforeEach(function() {
          var range1, range2;
          range1 = new Range(new Point(8, 2), new Point(8, 2));
          range2 = new Range(new Point(10, 2), new Point(10, 2));
          return editor.setSelectedBufferRanges([range1, range2]);
        });
        return it('adds the background class to the cursor line', function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(2);
        });
      });
      return describe("when there is a multi row selection", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(10, 8));
          return editor.setSelectedBufferRange(range);
        });
        it("won`t add a highlight line class", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(0);
        });
        return describe("when selection border is enabled", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.enableSelectionBorder', true);
            atom.config.set('highlight-line.underline', 'solid');
            range = new Range(new Point(8, 2), new Point(10, 8));
            return editor.setSelectedBufferRange(range);
          });
          return it("will add highlights to the top and bottom", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line .highlight-line-multi-line-solid-top .highlight-line-multi-line-solid-bottom')).toHaveLength(0);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1saW5lL3NwZWMvaGlnaGxpZ2h0LWxpbmUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRFIsQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLHVCQUFSLENBRmhCLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxvRkFBQTtBQUFBLElBQUEsUUFDOEMsRUFEOUMsRUFBQyw0QkFBRCxFQUFvQiwyQkFBcEIsRUFDRSxpQkFERixFQUNVLHdCQURWLEVBQ3lCLDRCQUR6QixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixVQUFyQixDQUFELENBQXRCLENBREEsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZUFBcEIsRUFEYztNQUFBLENBQWhCLENBSEEsQ0FBQTtBQUFBLE1BTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRmhCLENBQUE7ZUFJQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFDdkIsQ0FBQyxlQURpQixDQUNELGdCQURDLENBQ2dCLENBQUMsSUFEakIsQ0FDc0IsU0FBQyxJQUFELEdBQUE7QUFDdEMsY0FBQSx5QkFBQTtBQUFBLFVBRHdDLGFBQUQsS0FBQyxVQUN4QyxDQUFBO2lCQUFDLDJCQUFBLGFBQUQsRUFBa0IsV0FEb0I7UUFBQSxDQUR0QixFQUxqQjtNQUFBLENBQUwsQ0FOQSxDQUFBO2FBZUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxrQkFEYztNQUFBLENBQWhCLEVBaEJTO0lBQUEsQ0FBWCxDQUhBLENBQUE7QUFBQSxJQXNCQSxRQUFBLENBQVMseUJBQVQsRUFBb0MsU0FBQSxHQUFBO2FBQ2xDLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7ZUFDaEMsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxpQkFBbEMsQ0FBUCxDQUNFLENBQUMsWUFESCxDQUNnQixDQURoQixFQURnQztNQUFBLENBQWxDLEVBRGtDO0lBQUEsQ0FBcEMsQ0F0QkEsQ0FBQTtXQTJCQSxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsSUFBekQsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsS0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0IsQ0FBWixDQUFBO2lCQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7aUJBQ2pELE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFDbkIsQ0FBQyxnQkFESSxDQUNhLDZCQURiLENBQVAsQ0FFQyxDQUFDLFlBRkYsQ0FFZSxDQUZmLEVBRGlEO1FBQUEsQ0FBbkQsQ0FKQSxDQUFBO2VBU0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxJQUF4RCxFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUdBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7bUJBQ3pELE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFDbkIsQ0FBQyxnQkFESSxDQUNhLDZCQURiLENBQVAsQ0FFQyxDQUFDLFlBRkYsQ0FFZSxDQUZmLEVBRHlEO1VBQUEsQ0FBM0QsQ0FIQSxDQUFBO2lCQVFBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsZ0JBQUEsS0FBQTtBQUFBLFlBQUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0IsQ0FBWixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxhQUFhLENBQUMsVUFDbkIsQ0FBQyxnQkFESSxDQUNhLDZCQURiLENBQVAsQ0FFQyxDQUFDLFlBRkYsQ0FFZSxDQUZmLEVBSHVEO1VBQUEsQ0FBekQsRUFUbUQ7UUFBQSxDQUFyRCxFQVZ3QztNQUFBLENBQTFDLENBSEEsQ0FBQTtBQUFBLE1BNkJBLFFBQUEsQ0FBUywyQkFBVCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsSUFBbEQsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFHQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFVBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGdCQUFBLEtBQUE7QUFBQSxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsT0FBNUMsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQVUsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBVixFQUEyQixJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUEzQixDQURaLENBQUE7bUJBRUEsTUFBTSxDQUFDLHNCQUFQLENBQThCLEtBQTlCLEVBSFM7VUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFVBS0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTttQkFDMUMsTUFBQSxDQUNFLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0JBQXpCLENBQ0UscURBREYsQ0FERixDQUlDLENBQUMsWUFKRixDQUllLENBSmYsRUFEMEM7VUFBQSxDQUE1QyxDQUxBLENBQUE7aUJBWUEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxZQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7cUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxJQUF4RCxFQURTO1lBQUEsQ0FBWCxDQUFBLENBQUE7bUJBR0EsRUFBQSxDQUFHLHdCQUFILEVBQTZCLFNBQUEsR0FBQTtBQUMzQixrQkFBQSxLQUFBO0FBQUEsY0FBQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQVUsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBVixFQUEyQixJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUEzQixDQUFaLENBQUE7QUFBQSxjQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixDQURBLENBQUE7cUJBRUEsTUFBQSxDQUNFLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0JBQXpCLENBQ0UsOENBREYsQ0FERixDQUlDLENBQUMsWUFKRixDQUllLENBSmYsRUFIMkI7WUFBQSxDQUE3QixFQUptRDtVQUFBLENBQXJELEVBYjJDO1FBQUEsQ0FBN0MsQ0FIQSxDQUFBO0FBQUEsUUE2QkEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtBQUM1QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxnQkFBQSxLQUFBO0FBQUEsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLFFBQTVDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0IsQ0FEWixDQUFBO21CQUVBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBS0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTttQkFDMUMsTUFBQSxDQUNFLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0JBQXpCLENBQ0Usc0RBREYsQ0FERixDQUlDLENBQUMsWUFKRixDQUllLENBSmYsRUFEMEM7VUFBQSxDQUE1QyxFQU40QztRQUFBLENBQTlDLENBN0JBLENBQUE7ZUEwQ0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtBQUM1QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxnQkFBQSxLQUFBO0FBQUEsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLFFBQTVDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0IsQ0FEWixDQUFBO21CQUVBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixLQUE5QixFQUhTO1VBQUEsQ0FBWCxDQUFBLENBQUE7aUJBS0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTttQkFDMUMsTUFBQSxDQUNFLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0JBQXpCLENBQ0Usc0RBREYsQ0FERixDQUlDLENBQUMsWUFKRixDQUllLENBSmYsRUFEMEM7VUFBQSxDQUE1QyxFQU40QztRQUFBLENBQTlDLEVBM0NvQztNQUFBLENBQXRDLENBN0JBLENBQUE7QUFBQSxNQXFGQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULGNBQUEsY0FBQTtBQUFBLFVBQUEsTUFBQSxHQUFhLElBQUEsS0FBQSxDQUFVLElBQUEsS0FBQSxDQUFNLENBQU4sRUFBUyxDQUFULENBQVYsRUFBMkIsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBM0IsQ0FBYixDQUFBO0FBQUEsVUFDQSxNQUFBLEdBQWEsSUFBQSxLQUFBLENBQVUsSUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLENBQVYsQ0FBVixFQUE0QixJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUE1QixDQURiLENBQUE7aUJBRUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBL0IsRUFIUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBS0EsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtpQkFDakQsTUFBQSxDQUFPLGFBQWEsQ0FBQyxVQUNuQixDQUFDLGdCQURJLENBQ2EsNkJBRGIsQ0FBUCxDQUVDLENBQUMsWUFGRixDQUVlLENBRmYsRUFEaUQ7UUFBQSxDQUFuRCxFQU5xQztNQUFBLENBQXZDLENBckZBLENBQUE7YUFnR0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxjQUFBLEtBQUE7QUFBQSxVQUFBLEtBQUEsR0FBWSxJQUFBLEtBQUEsQ0FBVSxJQUFBLEtBQUEsQ0FBTSxDQUFOLEVBQVMsQ0FBVCxDQUFWLEVBQTJCLElBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxDQUFWLENBQTNCLENBQVosQ0FBQTtpQkFDQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsS0FBOUIsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO2lCQUNyQyxNQUFBLENBQU8sYUFBYSxDQUFDLFVBQ25CLENBQUMsZ0JBREksQ0FDYSw2QkFEYixDQUFQLENBRUMsQ0FBQyxZQUZGLENBRWUsQ0FGZixFQURxQztRQUFBLENBQXZDLENBSkEsQ0FBQTtlQVNBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsZ0JBQUEsS0FBQTtBQUFBLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxJQUF4RCxDQUFBLENBQUE7QUFBQSxZQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsRUFBNEMsT0FBNUMsQ0FEQSxDQUFBO0FBQUEsWUFFQSxLQUFBLEdBQVksSUFBQSxLQUFBLENBQVUsSUFBQSxLQUFBLENBQU0sQ0FBTixFQUFTLENBQVQsQ0FBVixFQUEyQixJQUFBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsQ0FBVixDQUEzQixDQUZaLENBQUE7bUJBR0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLEtBQTlCLEVBSlM7VUFBQSxDQUFYLENBQUEsQ0FBQTtpQkFNQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO21CQUM5QyxNQUFBLENBQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQyxnQkFBekIsQ0FBMEMsMkZBQTFDLENBQVAsQ0FHRSxDQUFDLFlBSEgsQ0FHZ0IsQ0FIaEIsRUFEOEM7VUFBQSxDQUFoRCxFQVAyQztRQUFBLENBQTdDLEVBVjhDO01BQUEsQ0FBaEQsRUFqRytDO0lBQUEsQ0FBakQsRUE1QndCO0VBQUEsQ0FBMUIsQ0FKQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/dawsonbotsford/.atom/packages/highlight-line/spec/highlight-line-spec.coffee
