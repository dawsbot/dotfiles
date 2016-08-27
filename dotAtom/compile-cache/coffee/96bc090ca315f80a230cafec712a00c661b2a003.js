(function() {
  describe("VimMode", function() {
    var editor, editorElement, workspaceElement, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('vim-mode');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return editorElement = atom.views.getView(editor);
      });
    });
    describe(".activate", function() {
      it("puts the editor in normal-mode initially by default", function() {
        expect(editorElement.classList.contains('vim-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("shows the current vim mode in the status bar", function() {
        var statusBarTile;
        statusBarTile = null;
        waitsFor(function() {
          return statusBarTile = workspaceElement.querySelector("#status-bar-vim-mode");
        });
        return runs(function() {
          expect(statusBarTile.textContent).toBe("Normal");
          atom.commands.dispatch(editorElement, "vim-mode:activate-insert-mode");
          return expect(statusBarTile.textContent).toBe("Insert");
        });
      });
      return it("doesn't register duplicate command listeners for editors", function() {
        var newPane, pane;
        editor.setText("12345");
        editor.setCursorBufferPosition([0, 0]);
        pane = atom.workspace.getActivePane();
        newPane = pane.splitRight();
        pane.removeItem(editor);
        newPane.addItem(editor);
        atom.commands.dispatch(editorElement, "vim-mode:move-right");
        return expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
      });
    });
    return describe(".deactivate", function() {
      it("removes the vim classes from the editor", function() {
        atom.packages.deactivatePackage('vim-mode');
        expect(editorElement.classList.contains("vim-mode")).toBe(false);
        return expect(editorElement.classList.contains("normal-mode")).toBe(false);
      });
      return it("removes the vim commands from the editor element", function() {
        var vimCommands;
        vimCommands = function() {
          return atom.commands.findCommands({
            target: editorElement
          }).filter(function(cmd) {
            return cmd.name.startsWith("vim-mode:");
          });
        };
        expect(vimCommands().length).toBeGreaterThan(0);
        atom.packages.deactivatePackage('vim-mode');
        return expect(vimCommands().length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdmltLW1vZGUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFFBQUEsNkNBQUE7QUFBQSxJQUFBLE9BQTRDLEVBQTVDLEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QiwwQkFBeEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUxBLENBQUE7QUFBQSxNQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCLEVBRGM7TUFBQSxDQUFoQixDQVJBLENBQUE7YUFXQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtlQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLEVBRmI7TUFBQSxDQUFMLEVBWlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBa0JBLFFBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/vim-mode/spec/vim-mode-spec.coffee
