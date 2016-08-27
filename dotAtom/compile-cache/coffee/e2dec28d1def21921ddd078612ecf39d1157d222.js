(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Prefixes", function() {
    var editor, editorElement, keydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        return vimState.resetNormalMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    describe("Repeat", function() {
      describe("with operations", function() {
        beforeEach(function() {
          editor.setText("123456789abc");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("repeats N times", function() {
          keydown('3');
          keydown('x');
          return expect(editor.getText()).toBe('456789abc');
        });
        return it("repeats NN times", function() {
          keydown('1');
          keydown('0');
          keydown('x');
          return expect(editor.getText()).toBe('bc');
        });
      });
      describe("with motions", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats N times", function() {
          keydown('d');
          keydown('2');
          keydown('w');
          return expect(editor.getText()).toBe('three');
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText('one two three');
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("repeats movements in visual mode", function() {
          keydown("v");
          keydown("2");
          keydown("w");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        });
      });
    });
    return describe("Register", function() {
      describe("the a register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
        return it("overwrites a value previously in the register", function() {
          vimState.setRegister('a', {
            text: 'content'
          });
          vimState.setRegister('a', {
            text: 'new content'
          });
          return expect(vimState.getRegister("a").text).toEqual('new content');
        });
      });
      describe("the B register", function() {
        it("saves a value for future reading", function() {
          vimState.setRegister('B', {
            text: 'new content'
          });
          expect(vimState.getRegister("b").text).toEqual('new content');
          return expect(vimState.getRegister("B").text).toEqual('new content');
        });
        it("appends to a value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('contentnew content');
        });
        it("appends linewise to a linewise value previously in the register", function() {
          vimState.setRegister('b', {
            type: 'linewise',
            text: 'content\n'
          });
          vimState.setRegister('B', {
            text: 'new content'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
        return it("appends linewise to a character value previously in the register", function() {
          vimState.setRegister('b', {
            text: 'content'
          });
          vimState.setRegister('B', {
            type: 'linewise',
            text: 'new content\n'
          });
          return expect(vimState.getRegister("b").text).toEqual('content\nnew content\n');
        });
      });
      describe("the * register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the + register", function() {
        describe("reading", function() {
          return it("is the same the system clipboard", function() {
            expect(vimState.getRegister('*').text).toEqual('initial clipboard content');
            return expect(vimState.getRegister('*').type).toEqual('character');
          });
        });
        return describe("writing", function() {
          beforeEach(function() {
            return vimState.setRegister('*', {
              text: 'new content'
            });
          });
          return it("overwrites the contents of the system clipboard", function() {
            return expect(atom.clipboard.read()).toEqual('new content');
          });
        });
      });
      describe("the _ register", function() {
        describe("reading", function() {
          return it("is always the empty string", function() {
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('_', {
              text: 'new content'
            });
            return expect(vimState.getRegister("_").text).toEqual('');
          });
        });
      });
      describe("the % register", function() {
        beforeEach(function() {
          return spyOn(editor, 'getURI').andReturn('/Users/atom/known_value.txt');
        });
        describe("reading", function() {
          return it("returns the filename of the current editor", function() {
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
        return describe("writing", function() {
          return it("throws away anything written to it", function() {
            vimState.setRegister('%', "new content");
            return expect(vimState.getRegister('%').text).toEqual('/Users/atom/known_value.txt');
          });
        });
      });
      return describe("the ctrl-r command in insert mode", function() {
        beforeEach(function() {
          editor.setText("02\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'abc'
          });
          atom.clipboard.write("clip");
          keydown('a');
          return editor.insertText('1');
        });
        it("inserts contents of the unnamed register with \"", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('"');
          return expect(editor.getText()).toBe('013452\n');
        });
        describe("when useClipboardAsDefaultRegister enabled", function() {
          return it("inserts contents from clipboard with \"", function() {
            atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
            keydown('r', {
              ctrl: true
            });
            keydown('"');
            return expect(editor.getText()).toBe('01clip2\n');
          });
        });
        it("inserts contents of the 'a' register", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('a');
          return expect(editor.getText()).toBe('01abc2\n');
        });
        return it("is cancelled with the escape key", function() {
          keydown('r', {
            ctrl: true
          });
          keydown('escape');
          expect(editor.getText()).toBe('012\n');
          expect(vimState.mode).toBe("insert");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvcHJlZml4ZXMtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUixDQUFWLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsUUFBQSw4Q0FBQTtBQUFBLElBQUEsT0FBb0MsRUFBcEMsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLGtCQUF4QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCLENBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FEQSxDQUFBO2FBR0EsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRCxHQUFBO0FBQ3ZCLFFBQUEsYUFBQSxHQUFnQixPQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsYUFBYSxDQUFDLFFBQWQsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxhQUFhLENBQUMsUUFGekIsQ0FBQTtBQUFBLFFBR0EsUUFBUSxDQUFDLGtCQUFULENBQUEsQ0FIQSxDQUFBO2VBSUEsUUFBUSxDQUFDLGVBQVQsQ0FBQSxFQUx1QjtNQUFBLENBQXpCLEVBSlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBYUEsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTs7UUFBTSxVQUFRO09BQ3RCOztRQUFBLE9BQU8sQ0FBQyxVQUFXO09BQW5CO2FBQ0EsT0FBTyxDQUFDLE9B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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/spec/prefixes-spec.coffee
