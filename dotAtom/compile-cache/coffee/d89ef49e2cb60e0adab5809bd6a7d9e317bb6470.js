(function() {
  describe('editor-linter', function() {
    var EditorLinter, editorLinter, getMessage, textEditor, wait, _ref;
    _ref = require('./common'), getMessage = _ref.getMessage, wait = _ref.wait;
    EditorLinter = require('../lib/editor-linter');
    editorLinter = null;
    textEditor = null;
    beforeEach(function() {
      global.setTimeout = require('remote').getGlobal('setTimeout');
      global.setInterval = require('remote').getGlobal('setInterval');
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open(__dirname + '/fixtures/file.txt').then(function() {
          if (editorLinter != null) {
            editorLinter.dispose();
          }
          textEditor = atom.workspace.getActiveTextEditor();
          return editorLinter = new EditorLinter(textEditor);
        });
      });
    });
    describe('::constructor', function() {
      return it("cries when provided argument isn't a TextEditor", function() {
        expect(function() {
          return new EditorLinter;
        }).toThrow();
        expect(function() {
          return new EditorLinter(null);
        }).toThrow();
        return expect(function() {
          return new EditorLinter(55);
        }).toThrow();
      });
    });
    describe('::{add, remove}Message', function() {
      return it('adds/removes decorations from the editor', function() {
        var countDecorations, message;
        countDecorations = textEditor.getDecorations().length;
        editorLinter.underlineIssues = true;
        message = getMessage('Hey!', __dirname + '/fixtures/file.txt', [[0, 1], [0, 2]]);
        editorLinter.addMessage(message);
        expect(textEditor.getDecorations().length).toBe(countDecorations + 1);
        editorLinter.deleteMessage(message);
        return expect(textEditor.getDecorations().length).toBe(countDecorations);
      });
    });
    describe('::getMessages', function() {
      return it('returns a set of messages', function() {
        var message, messageSet;
        message = getMessage('Hey!', __dirname + '/fixtures/file.txt', [[0, 1], [0, 2]]);
        messageSet = editorLinter.getMessages();
        editorLinter.addMessage(message);
        expect(messageSet.has(message)).toBe(true);
        editorLinter.deleteMessage(message);
        return expect(messageSet.has(message)).toBe(false);
      });
    });
    describe('::onDidMessage{Add, Change, Delete}', function() {
      return it('notifies us of the changes to messages', function() {
        var message, messageAdd, messageChange, messageRemove;
        message = getMessage('Hey!', __dirname + '/fixtures/file.txt', [[0, 1], [0, 2]]);
        messageAdd = jasmine.createSpy('messageAdd');
        messageChange = jasmine.createSpy('messageChange');
        messageRemove = jasmine.createSpy('messageRemove');
        editorLinter.onDidMessageAdd(messageAdd);
        editorLinter.onDidMessageChange(messageChange);
        editorLinter.onDidMessageDelete(messageRemove);
        editorLinter.addMessage(message);
        expect(messageAdd).toHaveBeenCalled();
        expect(messageAdd).toHaveBeenCalledWith(message);
        expect(messageChange).toHaveBeenCalled();
        expect(messageChange.mostRecentCall.args[0].type).toBe('add');
        expect(messageChange.mostRecentCall.args[0].message).toBe(message);
        editorLinter.deleteMessage(message);
        expect(messageRemove).toHaveBeenCalled();
        expect(messageRemove).toHaveBeenCalledWith(message);
        expect(messageChange.mostRecentCall.args[0].type).toBe('delete');
        return expect(messageChange.mostRecentCall.args[0].message).toBe(message);
      });
    });
    describe('::active', function() {
      return it('updates currentFile attribute on the messages', function() {
        var message;
        message = getMessage('Hey!', __dirname + '/fixtures/file.txt', [[0, 1], [0, 2]]);
        editorLinter.addMessage(message);
        expect(message.currentFile).toBe(true);
        editorLinter.active = false;
        expect(message.currentFile).toBe(false);
        editorLinter.deleteMessage(message);
        editorLinter.addMessage(message);
        return expect(message.currentFile).toBe(false);
      });
    });
    describe('::{calculateLineMessages, onDidCalculateLineMessages}', function() {
      return it('works and also ignores', function() {
        var listener, message;
        listener = jasmine.createSpy('onDidCalculateLineMessages');
        message = getMessage('Hey!', __dirname + '/fixtures/file.txt', [[0, 1], [0, 2]]);
        editorLinter.addMessage(message);
        editorLinter.onDidCalculateLineMessages(listener);
        atom.config.set('linter.showErrorTabLine', true);
        expect(editorLinter.calculateLineMessages(0)).toBe(1);
        expect(editorLinter.countLineMessages).toBe(1);
        expect(listener).toHaveBeenCalledWith(1);
        atom.config.set('linter.showErrorTabLine', false);
        expect(editorLinter.calculateLineMessages(0)).toBe(0);
        expect(editorLinter.countLineMessages).toBe(0);
        expect(listener).toHaveBeenCalledWith(0);
        atom.config.set('linter.showErrorTabLine', true);
        expect(editorLinter.calculateLineMessages(0)).toBe(1);
        expect(editorLinter.countLineMessages).toBe(1);
        return expect(listener).toHaveBeenCalledWith(1);
      });
    });
    describe('::{handle, add, remove}Gutter', function() {
      return it('handles the attachment and detachment of gutter to text editor', function() {
        editorLinter.gutterEnabled = false;
        expect(editorLinter.gutter === null).toBe(true);
        editorLinter.gutterEnabled = true;
        editorLinter.handleGutter();
        expect(editorLinter.gutter === null).toBe(false);
        editorLinter.gutterEnabled = false;
        editorLinter.handleGutter();
        expect(editorLinter.gutter === null).toBe(true);
        editorLinter.addGutter();
        expect(editorLinter.gutter === null).toBe(false);
        editorLinter.removeGutter();
        expect(editorLinter.gutter === null).toBe(true);
        editorLinter.removeGutter();
        return expect(editorLinter.gutter === null).toBe(true);
      });
    });
    describe('::onShouldLint', function() {
      it('is triggered on save', function() {
        var timesTriggered;
        timesTriggered = 0;
        editorLinter.onShouldLint(function() {
          return timesTriggered++;
        });
        textEditor.save();
        textEditor.save();
        textEditor.save();
        textEditor.save();
        textEditor.save();
        return expect(timesTriggered).toBe(5);
      });
      return it('respects lintOnFlyInterval config', function() {
        var flyStatus, timeCalled, timeDid;
        timeCalled = null;
        flyStatus = null;
        atom.config.set('linter.lintOnFlyInterval', 300);
        editorLinter.onShouldLint(function(fly) {
          flyStatus = fly;
          return timeCalled = new Date();
        });
        timeDid = new Date();
        editorLinter.editor.insertText("Hey\n");
        return waitsForPromise(function() {
          return wait(300).then(function() {
            expect(timeCalled !== null).toBe(true);
            expect(flyStatus !== null).toBe(true);
            expect(flyStatus).toBe(true);
            expect(timeCalled - timeDid).toBeLessThan(400);
            atom.config.set('linter.lintOnFlyInterval', 600);
            timeCalled = null;
            flyStatus = null;
            timeDid = new Date();
            editorLinter.editor.insertText("Hey\n");
            return wait(600);
          }).then(function() {
            expect(timeCalled !== null).toBe(true);
            expect(flyStatus !== null).toBe(true);
            expect(flyStatus).toBe(true);
            expect(timeCalled - timeDid).toBeGreaterThan(599);
            return expect(timeCalled - timeDid).toBeLessThan(700);
          });
        });
      });
    });
    return describe('::onDidDestroy', function() {
      return it('is called when TextEditor is destroyed', function() {
        var didDestroy;
        didDestroy = false;
        editorLinter.onDidDestroy(function() {
          return didDestroy = true;
        });
        textEditor.destroy();
        return expect(didDestroy).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2VkaXRvci1saW50ZXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsOERBQUE7QUFBQSxJQUFBLE9BQXFCLE9BQUEsQ0FBUSxVQUFSLENBQXJCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLFlBQUEsSUFBYixDQUFBO0FBQUEsSUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHNCQUFSLENBRGYsQ0FBQTtBQUFBLElBRUEsWUFBQSxHQUFlLElBRmYsQ0FBQTtBQUFBLElBR0EsVUFBQSxHQUFhLElBSGIsQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsTUFBTSxDQUFDLFVBQVAsR0FBb0IsT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixZQUE1QixDQUFwQixDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsV0FBUCxHQUFxQixPQUFBLENBQVEsUUFBUixDQUFpQixDQUFDLFNBQWxCLENBQTRCLGFBQTVCLENBRHJCLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBZixDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixTQUFBLEdBQVksb0JBQWhDLENBQXFELENBQUMsSUFBdEQsQ0FBMkQsU0FBQSxHQUFBOztZQUN6RCxZQUFZLENBQUUsT0FBZCxDQUFBO1dBQUE7QUFBQSxVQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEYixDQUFBO2lCQUVBLFlBQUEsR0FBbUIs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/linter/spec/editor-linter-spec.coffee