(function() {
  var util;

  util = require('util');

  describe('Relative Line Numbers', function() {
    beforeEach(function() {
      return waitsForPromise((function(_this) {
        return function() {
          return atom.packages.activatePackage('relative-numbers').then(function(module) {
            return _this.module = module;
          });
        };
      })(this));
    });
    it('should be in the packages list', function() {
      expect(this.module).toBeDefined();
      return expect(atom.packages.isPackageLoaded('relative-numbers'));
    });
    it('should be an active package', function() {
      return expect(atom.packages.isPackageActive('relative-numbers'));
    });
    it('should provide default config', function() {
      expect(atom.config.get('relative-numbers.trueNumberCurrentLine')).toBe(true);
      expect(atom.config.get('relative-numbers.showAbsoluteNumbers')).toBe(false);
      return expect(atom.config.get('relative-numbers.startAtOne')).toBe(false);
    });
    return describe('Example Text File', function() {
      beforeEach(function() {
        return waitsForPromise((function(_this) {
          return function() {
            return atom.workspace.open(__dirname + '/fixtures/example.txt').then(function(editor) {
              _this.editor = editor;
              _this.editorView = atom.views.getView(editor);
              return jasmine.attachToDOM(_this.editorView);
            });
          };
        })(this));
      });
      it('should open correctly', function() {
        expect(this.editor).toBeDefined();
        return expect(this.editor.getLineCount()).toBe(11);
      });
      it('should have added a gutter', function() {
        return expect(this.editor.gutterWithName('relative-numbers')).not.toBe(null);
      });
      return it('should show line numbers', function() {
        return expect(this.editorView.shadowRoot.querySelectorAll('.line-number').length).toBe(12);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3JlbGF0aXZlLW51bWJlcnMvc3BlYy9yZWxhdGl2ZS1udW1iZXJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDZCxpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsa0JBQTlCLENBQ0wsQ0FBQyxJQURJLENBQ0MsU0FBQyxNQUFELEdBQUE7bUJBQVksS0FBQyxDQUFBLE1BQUQsR0FBVSxPQUF0QjtVQUFBLENBREQsQ0FBUCxDQURjO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFLQSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLE1BQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxNQUFSLENBQWUsQ0FBQyxXQUFoQixDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsa0JBQTlCLENBQVAsRUFGbUM7SUFBQSxDQUFyQyxDQUxBLENBQUE7QUFBQSxJQVNBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixrQkFBOUIsQ0FBUCxFQURnQztJQUFBLENBQWxDLENBVEEsQ0FBQTtBQUFBLElBWUEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxNQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RSxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQVAsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFxRSxLQUFyRSxDQURBLENBQUE7YUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFQLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsS0FBNUQsRUFIa0M7SUFBQSxDQUFwQyxDQVpBLENBQUE7V0FpQkEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxlQUFBLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ2QsbUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQUEsR0FBWSx1QkFBaEMsQ0FDTCxDQUFDLElBREksQ0FDQyxTQUFDLE1BQUQsR0FBQTtBQUNKLGNBQUEsS0FBQyxDQUFBLE1BQUQsR0FBVSxNQUFWLENBQUE7QUFBQSxjQUNBLEtBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRGQsQ0FBQTtxQkFFQSxPQUFPLENBQUMsV0FBUixDQUFvQixLQUFDLENBQUEsVUFBckIsRUFISTtZQUFBLENBREQsQ0FBUCxDQURjO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFRQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsTUFBQSxDQUFPLElBQUMsQ0FBQSxNQUFSLENBQWUsQ0FBQyxXQUFoQixDQUFBLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBQSxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsRUFBcEMsRUFGMEI7TUFBQSxDQUE1QixDQVJBLENBQUE7QUFBQSxNQVlBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7ZUFDL0IsTUFBQSxDQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixrQkFBdkIsQ0FBUCxDQUFrRCxDQUFDLEdBQUcsQ0FBQyxJQUF2RCxDQUE0RCxJQUE1RCxFQUQrQjtNQUFBLENBQWpDLENBWkEsQ0FBQTthQWVBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7ZUFDN0IsTUFBQSxDQUFPLElBQUMsQ0FBQSxVQUFVLENBQUMsVUFBVSxDQUFDLGdCQUF2QixDQUF3QyxjQUF4QyxDQUF1RCxDQUFDLE1BQS9ELENBQXNFLENBQUMsSUFBdkUsQ0FBNEUsRUFBNUUsRUFENkI7TUFBQSxDQUEvQixFQWhCNEI7SUFBQSxDQUE5QixFQWxCZ0M7RUFBQSxDQUFsQyxDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/relative-numbers/spec/relative-numbers-spec.coffee
