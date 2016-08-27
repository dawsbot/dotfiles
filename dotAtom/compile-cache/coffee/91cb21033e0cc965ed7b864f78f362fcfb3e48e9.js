(function() {
  var Fs, Path, readFile;

  Path = require("path");

  Fs = require("fs");

  readFile = function(path) {
    return Fs.readFileSync(Path.join(__dirname, "./fixtures/", path), "utf8");
  };

  describe("Emmet", function() {
    var editor, editorElement, simulateTabKeyEvent, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1];
    console.log(atom.keymaps.onDidMatchBinding(function(event) {
      return console.log('Matched keybinding', event);
    }));
    simulateTabKeyEvent = function() {
      var event;
      event = keydownEvent("tab", {
        target: editorElement
      });
      return atom.keymaps.handleKeyboardEvent(event.originalEvent);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("tabbing.html");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("emmet");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("snippets");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-css", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-sass", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-php", {
          sync: true
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-html", {
          sync: true
        });
      });
      return runs(function() {
        var _ref1, _ref2;
        if ((_ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
          if ((_ref2 = _ref1.mainModule) != null) {
            _ref2.getEmitter();
          }
        }
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe("tabbing", function() {
      beforeEach(function() {
        atom.workspace.open('tabbing.html');
        return editor.setCursorScreenPosition([1, 4]);
      });
      return it("moves the cursor along", function() {
        var cursorPos;
        simulateTabKeyEvent();
        cursorPos = editor.getCursorScreenPosition();
        return expect(cursorPos.column).toBe(6);
      });
    });
    return describe("emmet:expand-abbreviation", function() {
      var expansion;
      expansion = null;
      return describe("for normal HTML", function() {
        beforeEach(function() {
          editor.setText(readFile("abbreviation/before/html-abbrv.html"));
          editor.moveToEndOfLine();
          return expansion = readFile("abbreviation/after/html-abbrv.html");
        });
        it("expands HTML abbreviations via commands", function() {
          atom.commands.dispatch(editorElement, "emmet:expand-abbreviation");
          return expect(editor.getText()).toBe(expansion);
        });
        it("expands HTML abbreviations via keybindings", function() {
          var event;
          event = keydownEvent('e', {
            shiftKey: true,
            metaKey: true,
            target: editorElement
          });
          atom.keymaps.handleKeyboardEvent(event.originalEvent);
          return expect(editor.getText()).toBe(expansion);
        });
        return it("expands HTML abbreviations via Tab", function() {
          console.log(atom.keymaps.findKeyBindings({
            keystrokes: 'tab'
          }));
          simulateTabKeyEvent();
          return expect(editor.getText()).toBe(expansion);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2VtbWV0L3NwZWMvZW1tZXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxTQUFDLElBQUQsR0FBQTtXQUNULEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixhQUFyQixFQUFvQyxJQUFwQyxDQUFoQixFQUEyRCxNQUEzRCxFQURTO0VBQUEsQ0FIWCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFFBQUEsZ0RBQUE7QUFBQSxJQUFBLE9BQTBCLEVBQTFCLEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxDQUFBO0FBQUEsSUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWIsQ0FBK0IsU0FBQyxLQUFELEdBQUE7YUFDekMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQyxLQUFsQyxFQUR5QztJQUFBLENBQS9CLENBQVosQ0FGQSxDQUFBO0FBQUEsSUFNQSxtQkFBQSxHQUFzQixTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsWUFBQSxDQUFhLEtBQWIsRUFBb0I7QUFBQSxRQUFDLE1BQUEsRUFBUSxhQUFUO09BQXBCLENBQVIsQ0FBQTthQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQWIsQ0FBaUMsS0FBSyxDQUFDLGFBQXZDLEVBRm9CO0lBQUEsQ0FOdEIsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/emmet/spec/emmet-spec.coffee
