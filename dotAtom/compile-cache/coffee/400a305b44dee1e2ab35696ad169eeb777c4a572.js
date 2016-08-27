(function() {
  var Ex, ExClass, fs, helpers, os, path, uuid;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  uuid = require('node-uuid');

  helpers = require('./spec-helper');

  ExClass = require('../lib/ex');

  Ex = ExClass.singleton();

  describe("the commands", function() {
    var dir, dir2, editor, editorElement, exState, keydown, normalModeInputKeydown, projectPath, submitNormalModeInputText, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2], exState = _ref[3], dir = _ref[4], dir2 = _ref[5];
    projectPath = function(fileName) {
      return path.join(dir, fileName);
    };
    beforeEach(function() {
      var exMode, vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      exMode = atom.packages.loadPackage('ex-mode');
      waitsForPromise(function() {
        var activationPromise;
        activationPromise = exMode.activate();
        helpers.activateExMode();
        return activationPromise;
      });
      runs(function() {
        return spyOn(exMode.mainModule.globalExState, 'setVim').andCallThrough();
      });
      waitsForPromise(function() {
        return vimMode.activate();
      });
      waitsFor(function() {
        return exMode.mainModule.globalExState.setVim.calls.length > 0;
      });
      return runs(function() {
        dir = path.join(os.tmpdir(), "atom-ex-mode-spec-" + (uuid.v4()));
        dir2 = path.join(os.tmpdir(), "atom-ex-mode-spec-" + (uuid.v4()));
        fs.makeTreeSync(dir);
        fs.makeTreeSync(dir2);
        atom.project.setPaths([dir, dir2]);
        return helpers.getEditorElement(function(element) {
          atom.commands.dispatch(element, "ex-mode:open");
          keydown('escape');
          editorElement = element;
          editor = editorElement.getModel();
          vimState = vimMode.mainModule.getEditorState(editor);
          exState = exMode.mainModule.exStates.get(editor);
          vimState.activateNormalMode();
          vimState.resetNormalMode();
          return editor.setText("abc\ndef\nabc\ndef");
        });
      });
    });
    afterEach(function() {
      fs.removeSync(dir);
      return fs.removeSync(dir2);
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
    normalModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      return editor.normalModeInputView.editorElement.getModel().setText(key);
    };
    submitNormalModeInputText = function(text) {
      var commandEditor;
      commandEditor = editor.normalModeInputView.editorElement;
      commandEditor.getModel().setText(text);
      return atom.commands.dispatch(commandEditor, "core:confirm");
    };
    describe(":write", function() {
      describe("when editing a new file", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('abc\ndef');
        });
        it("opens the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync');
          keydown(':');
          submitNormalModeInputText('write');
          return expect(atom.showSaveDialogSync).toHaveBeenCalled();
        });
        it("saves when a path is specified in the save dialog", function() {
          var filePath;
          filePath = projectPath('write-from-save-dialog');
          spyOn(atom, 'showSaveDialogSync').andReturn(filePath);
          keydown(':');
          submitNormalModeInputText('write');
          expect(fs.existsSync(filePath)).toBe(true);
          return expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc\ndef');
        });
        return it("saves when a path is specified in the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
          spyOn(fs, 'writeFileSync');
          keydown(':');
          submitNormalModeInputText('write');
          return expect(fs.writeFileSync.calls.length).toBe(0);
        });
      });
      return describe("when editing an existing file", function() {
        var filePath, i;
        filePath = '';
        i = 0;
        beforeEach(function() {
          i++;
          filePath = projectPath("write-" + i);
          editor.setText('abc\ndef');
          return editor.saveAs(filePath);
        });
        it("saves the file", function() {
          editor.setText('abc');
          keydown(':');
          submitNormalModeInputText('write');
          expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc');
          return expect(editor.isModified()).toBe(false);
        });
        describe("with a specified path", function() {
          var newPath;
          newPath = '';
          beforeEach(function() {
            newPath = path.relative(dir, "" + filePath + ".new");
            editor.getBuffer().setText('abc');
            return keydown(':');
          });
          afterEach(function() {
            submitNormalModeInputText("write " + newPath);
            newPath = path.resolve(dir, fs.normalize(newPath));
            expect(fs.existsSync(newPath)).toBe(true);
            expect(fs.readFileSync(newPath, 'utf-8')).toEqual('abc');
            expect(editor.isModified()).toBe(true);
            return fs.removeSync(newPath);
          });
          it("saves to the path", function() {});
          it("expands .", function() {
            return newPath = path.join('.', newPath);
          });
          it("expands ..", function() {
            return newPath = path.join('..', newPath);
          });
          return it("expands ~", function() {
            return newPath = path.join('~', newPath);
          });
        });
        it("throws an error with more than one path", function() {
          keydown(':');
          submitNormalModeInputText('write path1 path2');
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Only one file name allowed');
        });
        return describe("when the file already exists", function() {
          var existsPath;
          existsPath = '';
          beforeEach(function() {
            existsPath = projectPath('write-exists');
            return fs.writeFileSync(existsPath, 'abc');
          });
          afterEach(function() {
            return fs.removeSync(existsPath);
          });
          it("throws an error if the file already exists", function() {
            keydown(':');
            submitNormalModeInputText("write " + existsPath);
            expect(atom.notifications.notifications[0].message).toEqual('Command error: File exists (add ! to override)');
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc');
          });
          return it("writes if forced with :write!", function() {
            keydown(':');
            submitNormalModeInputText("write! " + existsPath);
            expect(atom.notifications.notifications).toEqual([]);
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc\ndef');
          });
        });
      });
    });
    describe(":wall", function() {
      return it("saves all", function() {
        spyOn(atom.workspace, 'saveAll');
        keydown(':');
        submitNormalModeInputText('wall');
        return expect(atom.workspace.saveAll).toHaveBeenCalled();
      });
    });
    describe(":saveas", function() {
      describe("when editing a new file", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('abc\ndef');
        });
        it("opens the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync');
          keydown(':');
          submitNormalModeInputText('saveas');
          return expect(atom.showSaveDialogSync).toHaveBeenCalled();
        });
        it("saves when a path is specified in the save dialog", function() {
          var filePath;
          filePath = projectPath('saveas-from-save-dialog');
          spyOn(atom, 'showSaveDialogSync').andReturn(filePath);
          keydown(':');
          submitNormalModeInputText('saveas');
          expect(fs.existsSync(filePath)).toBe(true);
          return expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc\ndef');
        });
        return it("saves when a path is specified in the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
          spyOn(fs, 'writeFileSync');
          keydown(':');
          submitNormalModeInputText('saveas');
          return expect(fs.writeFileSync.calls.length).toBe(0);
        });
      });
      return describe("when editing an existing file", function() {
        var filePath, i;
        filePath = '';
        i = 0;
        beforeEach(function() {
          i++;
          filePath = projectPath("saveas-" + i);
          editor.setText('abc\ndef');
          return editor.saveAs(filePath);
        });
        it("complains if no path given", function() {
          editor.setText('abc');
          keydown(':');
          submitNormalModeInputText('saveas');
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Argument required');
        });
        describe("with a specified path", function() {
          var newPath;
          newPath = '';
          beforeEach(function() {
            newPath = path.relative(dir, "" + filePath + ".new");
            editor.getBuffer().setText('abc');
            return keydown(':');
          });
          afterEach(function() {
            submitNormalModeInputText("saveas " + newPath);
            newPath = path.resolve(dir, fs.normalize(newPath));
            expect(fs.existsSync(newPath)).toBe(true);
            expect(fs.readFileSync(newPath, 'utf-8')).toEqual('abc');
            expect(editor.isModified()).toBe(false);
            return fs.removeSync(newPath);
          });
          it("saves to the path", function() {});
          it("expands .", function() {
            return newPath = path.join('.', newPath);
          });
          it("expands ..", function() {
            return newPath = path.join('..', newPath);
          });
          return it("expands ~", function() {
            return newPath = path.join('~', newPath);
          });
        });
        it("throws an error with more than one path", function() {
          keydown(':');
          submitNormalModeInputText('saveas path1 path2');
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Only one file name allowed');
        });
        return describe("when the file already exists", function() {
          var existsPath;
          existsPath = '';
          beforeEach(function() {
            existsPath = projectPath('saveas-exists');
            return fs.writeFileSync(existsPath, 'abc');
          });
          afterEach(function() {
            return fs.removeSync(existsPath);
          });
          it("throws an error if the file already exists", function() {
            keydown(':');
            submitNormalModeInputText("saveas " + existsPath);
            expect(atom.notifications.notifications[0].message).toEqual('Command error: File exists (add ! to override)');
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc');
          });
          return it("writes if forced with :saveas!", function() {
            keydown(':');
            submitNormalModeInputText("saveas! " + existsPath);
            expect(atom.notifications.notifications).toEqual([]);
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc\ndef');
          });
        });
      });
    });
    describe(":quit", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          spyOn(pane, 'destroyActiveItem').andCallThrough();
          return atom.workspace.open();
        });
      });
      it("closes the active pane item if not modified", function() {
        keydown(':');
        submitNormalModeInputText('quit');
        expect(pane.destroyActiveItem).toHaveBeenCalled();
        return expect(pane.getItems().length).toBe(1);
      });
      return describe("when the active pane item is modified", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('def');
        });
        return it("opens the prompt to save", function() {
          spyOn(pane, 'promptToSaveItem');
          keydown(':');
          submitNormalModeInputText('quit');
          return expect(pane.promptToSaveItem).toHaveBeenCalled();
        });
      });
    });
    describe(":quitall", function() {
      return it("closes Atom", function() {
        spyOn(atom, 'close');
        keydown(':');
        submitNormalModeInputText('quitall');
        return expect(atom.close).toHaveBeenCalled();
      });
    });
    describe(":tabclose", function() {
      return it("acts as an alias to :quit", function() {
        var _ref1;
        spyOn(Ex, 'tabclose').andCallThrough();
        spyOn(Ex, 'quit').andCallThrough();
        keydown(':');
        submitNormalModeInputText('tabclose');
        return (_ref1 = expect(Ex.quit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabclose.calls[0].args);
      });
    });
    describe(":tabnext", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return atom.workspace.open().then(function() {
            return atom.workspace.open();
          }).then(function() {
            return atom.workspace.open();
          });
        });
      });
      it("switches to the next tab", function() {
        pane.activateItemAtIndex(1);
        keydown(':');
        submitNormalModeInputText('tabnext');
        return expect(pane.getActiveItemIndex()).toBe(2);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(pane.getItems().length - 1);
        keydown(':');
        submitNormalModeInputText('tabnext');
        return expect(pane.getActiveItemIndex()).toBe(0);
      });
    });
    describe(":tabprevious", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        return waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return atom.workspace.open().then(function() {
            return atom.workspace.open();
          }).then(function() {
            return atom.workspace.open();
          });
        });
      });
      it("switches to the previous tab", function() {
        pane.activateItemAtIndex(1);
        keydown(':');
        submitNormalModeInputText('tabprevious');
        return expect(pane.getActiveItemIndex()).toBe(0);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(0);
        keydown(':');
        submitNormalModeInputText('tabprevious');
        return expect(pane.getActiveItemIndex()).toBe(pane.getItems().length - 1);
      });
    });
    describe(":wq", function() {
      beforeEach(function() {
        spyOn(Ex, 'write').andCallThrough();
        return spyOn(Ex, 'quit');
      });
      it("writes the file, then quits", function() {
        spyOn(atom, 'showSaveDialogSync').andReturn(projectPath('wq-1'));
        keydown(':');
        submitNormalModeInputText('wq');
        expect(Ex.write).toHaveBeenCalled();
        return waitsFor((function() {
          return Ex.quit.wasCalled;
        }), "the :quit command to be called", 100);
      });
      it("doesn't quit when the file is new and no path is specified in the save dialog", function() {
        var wasNotCalled;
        spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
        keydown(':');
        submitNormalModeInputText('wq');
        expect(Ex.write).toHaveBeenCalled();
        wasNotCalled = false;
        setImmediate((function() {
          return wasNotCalled = !Ex.quit.wasCalled;
        }));
        return waitsFor((function() {
          return wasNotCalled;
        }), 100);
      });
      return it("passes the file name", function() {
        keydown(':');
        submitNormalModeInputText('wq wq-2');
        expect(Ex.write).toHaveBeenCalled();
        expect(Ex.write.calls[0].args[0].args.trim()).toEqual('wq-2');
        return waitsFor((function() {
          return Ex.quit.wasCalled;
        }), "the :quit command to be called", 100);
      });
    });
    describe(":xit", function() {
      return it("acts as an alias to :wq", function() {
        spyOn(Ex, 'wq');
        keydown(':');
        submitNormalModeInputText('xit');
        return expect(Ex.wq).toHaveBeenCalled();
      });
    });
    describe(":wqall", function() {
      return it("calls :wall, then :quitall", function() {
        spyOn(Ex, 'wall');
        spyOn(Ex, 'quitall');
        keydown(':');
        submitNormalModeInputText('wqall');
        expect(Ex.wall).toHaveBeenCalled();
        return expect(Ex.quitall).toHaveBeenCalled();
      });
    });
    describe(":edit", function() {
      describe("without a file name", function() {
        it("reloads the file from the disk", function() {
          var filePath;
          filePath = projectPath("edit-1");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit');
          return waitsFor((function() {
            return editor.getText() === 'def';
          }), "the editor's content to change", 100);
        });
        it("doesn't reload when the file has been modified", function() {
          var filePath, isntDef;
          filePath = projectPath("edit-2");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          editor.getBuffer().setText('abcd');
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit');
          expect(atom.notifications.notifications[0].message).toEqual('Command error: No write since last change (add ! to override)');
          isntDef = false;
          setImmediate(function() {
            return isntDef = editor.getText() !== 'def';
          });
          return waitsFor((function() {
            return isntDef;
          }), "the editor's content not to change", 50);
        });
        it("reloads when the file has been modified and it is forced", function() {
          var filePath;
          filePath = projectPath("edit-3");
          editor.getBuffer().setText('abc');
          editor.saveAs(filePath);
          editor.getBuffer().setText('abcd');
          fs.writeFileSync(filePath, 'def');
          keydown(':');
          submitNormalModeInputText('edit!');
          expect(atom.notifications.notifications.length).toBe(0);
          return waitsFor((function() {
            return editor.getText() === 'def';
          }), "the editor's content to change", 50);
        });
        return it("throws an error when editing a new file", function() {
          editor.getBuffer().reload();
          keydown(':');
          submitNormalModeInputText('edit');
          expect(atom.notifications.notifications[0].message).toEqual('Command error: No file name');
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText('edit!');
          return expect(atom.notifications.notifications[1].message).toEqual('Command error: No file name');
        });
      });
      return describe("with a file name", function() {
        beforeEach(function() {
          spyOn(atom.workspace, 'open');
          return editor.getBuffer().reload();
        });
        it("opens the specified path", function() {
          var filePath;
          filePath = projectPath('edit-new-test');
          keydown(':');
          submitNormalModeInputText("edit " + filePath);
          return expect(atom.workspace.open).toHaveBeenCalledWith(filePath);
        });
        it("opens a relative path", function() {
          keydown(':');
          submitNormalModeInputText('edit edit-relative-test');
          return expect(atom.workspace.open).toHaveBeenCalledWith(projectPath('edit-relative-test'));
        });
        return it("throws an error if trying to open more than one file", function() {
          keydown(':');
          submitNormalModeInputText('edit edit-new-test-1 edit-new-test-2');
          expect(atom.workspace.open.callCount).toBe(0);
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Only one file name allowed');
        });
      });
    });
    describe(":tabedit", function() {
      it("acts as an alias to :edit if supplied with a path", function() {
        var _ref1;
        spyOn(Ex, 'tabedit').andCallThrough();
        spyOn(Ex, 'edit');
        keydown(':');
        submitNormalModeInputText('tabedit tabedit-test');
        return (_ref1 = expect(Ex.edit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
      return it("acts as an alias to :tabnew if not supplied with a path", function() {
        var _ref1;
        spyOn(Ex, 'tabedit').andCallThrough();
        spyOn(Ex, 'tabnew');
        keydown(':');
        submitNormalModeInputText('tabedit  ');
        return (_ref1 = expect(Ex.tabnew)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
    });
    describe(":tabnew", function() {
      return it("opens a new tab", function() {
        spyOn(atom.workspace, 'open');
        keydown(':');
        submitNormalModeInputText('tabnew');
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
    });
    describe(":split", function() {
      return it("splits the current file upwards", function() {
        var filePath, pane;
        pane = atom.workspace.getActivePane();
        spyOn(pane, 'splitUp').andCallThrough();
        filePath = projectPath('split');
        editor.saveAs(filePath);
        keydown(':');
        submitNormalModeInputText('split');
        return expect(pane.splitUp).toHaveBeenCalled();
      });
    });
    describe(":vsplit", function() {
      return it("splits the current file to the left", function() {
        var filePath, pane;
        pane = atom.workspace.getActivePane();
        spyOn(pane, 'splitLeft').andCallThrough();
        filePath = projectPath('vsplit');
        editor.saveAs(filePath);
        keydown(':');
        submitNormalModeInputText('vsplit');
        return expect(pane.splitLeft).toHaveBeenCalled();
      });
    });
    describe(":delete", function() {
      beforeEach(function() {
        editor.setText('abc\ndef\nghi\njkl');
        return editor.setCursorBufferPosition([2, 0]);
      });
      it("deletes the current line", function() {
        keydown(':');
        submitNormalModeInputText('delete');
        return expect(editor.getText()).toEqual('abc\ndef\njkl');
      });
      it("deletes the lines in the given range", function() {
        var processedOpStack;
        processedOpStack = false;
        exState.onDidProcessOpStack(function() {
          return processedOpStack = true;
        });
        keydown(':');
        submitNormalModeInputText('1,2delete');
        expect(editor.getText()).toEqual('ghi\njkl');
        waitsFor(function() {
          return processedOpStack;
        });
        editor.setText('abc\ndef\nghi\njkl');
        editor.setCursorBufferPosition([1, 1]);
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(',/k/delete');
        return expect(editor.getText()).toEqual('abc\n');
      });
      return it("undos deleting several lines at once", function() {
        keydown(':');
        submitNormalModeInputText('-1,.delete');
        expect(editor.getText()).toEqual('abc\njkl');
        atom.commands.dispatch(editorElement, 'core:undo');
        return expect(editor.getText()).toEqual('abc\ndef\nghi\njkl');
      });
    });
    describe(":substitute", function() {
      beforeEach(function() {
        editor.setText('abcaABC\ndefdDEF\nabcaABC');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("replaces a character on the current line", function() {
        keydown(':');
        submitNormalModeInputText(':substitute /a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("doesn't need a space before the arguments", function() {
        keydown(':');
        submitNormalModeInputText(':substitute/a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("respects modifiers passed to it", function() {
        keydown(':');
        submitNormalModeInputText(':substitute/a/x/g');
        expect(editor.getText()).toEqual('xbcxABC\ndefdDEF\nabcaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':substitute/a/x/gi');
        return expect(editor.getText()).toEqual('xbcxxBC\ndefdDEF\nabcaABC');
      });
      it("replaces on multiple lines", function() {
        keydown(':');
        submitNormalModeInputText(':%substitute/abc/ghi');
        expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nghiaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':%substitute/abc/ghi/ig');
        return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nghiaghi');
      });
      describe("illegal delimiters", function() {
        var test;
        test = function(delim) {
          keydown(':');
          submitNormalModeInputText(":substitute " + delim + "a" + delim + "x" + delim + "gi");
          expect(atom.notifications.notifications[0].message).toEqual("Command error: Regular expressions can't be delimited by alphanumeric characters, '\\', '\"' or '|'");
          return expect(editor.getText()).toEqual('abcaABC\ndefdDEF\nabcaABC');
        };
        it("can't be delimited by letters", function() {
          return test('n');
        });
        it("can't be delimited by numbers", function() {
          return test('3');
        });
        it("can't be delimited by '\\'", function() {
          return test('\\');
        });
        it("can't be delimited by '\"'", function() {
          return test('"');
        });
        return it("can't be delimited by '|'", function() {
          return test('|');
        });
      });
      describe("empty replacement", function() {
        beforeEach(function() {
          return editor.setText('abcabc\nabcabc');
        });
        it("removes the pattern without modifiers", function() {
          keydown(':');
          submitNormalModeInputText(":substitute/abc//");
          return expect(editor.getText()).toEqual('abc\nabcabc');
        });
        return it("removes the pattern with modifiers", function() {
          keydown(':');
          submitNormalModeInputText(":substitute/abc//g");
          return expect(editor.getText()).toEqual('\nabcabc');
        });
      });
      describe("replacing with escape sequences", function() {
        var test;
        beforeEach(function() {
          return editor.setText('abc,def,ghi');
        });
        test = function(escapeChar, escaped) {
          keydown(':');
          submitNormalModeInputText(":substitute/,/\\" + escapeChar + "/g");
          return expect(editor.getText()).toEqual("abc" + escaped + "def" + escaped + "ghi");
        };
        it("replaces with a tab", function() {
          return test('t', '\t');
        });
        it("replaces with a linefeed", function() {
          return test('n', '\n');
        });
        return it("replaces with a carriage return", function() {
          return test('r', '\r');
        });
      });
      describe("case sensitivity", function() {
        describe("respects the smartcase setting", function() {
          beforeEach(function() {
            return editor.setText('abcaABC\ndefdDEF\nabcaABC');
          });
          it("uses case sensitive search if smartcase is off and the pattern is lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', false);
            keydown(':');
            submitNormalModeInputText(':substitute/abc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nabcaABC');
          });
          it("uses case sensitive search if smartcase is off and the pattern is uppercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            keydown(':');
            submitNormalModeInputText(':substitute/ABC/ghi/g');
            return expect(editor.getText()).toEqual('abcaghi\ndefdDEF\nabcaABC');
          });
          it("uses case insensitive search if smartcase is on and the pattern is lowercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            keydown(':');
            submitNormalModeInputText(':substitute/abc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          return it("uses case sensitive search if smartcase is on and the pattern is uppercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            keydown(':');
            submitNormalModeInputText(':substitute/ABC/ghi/g');
            return expect(editor.getText()).toEqual('abcaghi\ndefdDEF\nabcaABC');
          });
        });
        return describe("\\c and \\C in the pattern", function() {
          beforeEach(function() {
            return editor.setText('abcaABC\ndefdDEF\nabcaABC');
          });
          it("uses case insensitive search if smartcase is off and \c is in the pattern", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', false);
            keydown(':');
            submitNormalModeInputText(':substitute/abc\\c/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("doesn't matter where in the pattern \\c is", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', false);
            keydown(':');
            submitNormalModeInputText(':substitute/a\\cbc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("uses case sensitive search if smartcase is on, \\C is in the pattern and the pattern is lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            keydown(':');
            submitNormalModeInputText(':substitute/a\\Cbc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nabcaABC');
          });
          it("overrides \\C with \\c if \\C comes first", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            keydown(':');
            submitNormalModeInputText(':substitute/a\\Cb\\cc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("overrides \\C with \\c if \\c comes first", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            keydown(':');
            submitNormalModeInputText(':substitute/a\\cb\\Cc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          return it("overrides an appended /i flag with \\C", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            keydown(':');
            submitNormalModeInputText(':substitute/ab\\Cc/ghi/gi');
            return expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nabcaABC');
          });
        });
      });
      return describe("capturing groups", function() {
        beforeEach(function() {
          return editor.setText('abcaABC\ndefdDEF\nabcaABC');
        });
        it("replaces \\1 with the first group", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/bc(.{2})/X\\1X');
          return expect(editor.getText()).toEqual('aXaAXBC\ndefdDEF\nabcaABC');
        });
        it("replaces multiple groups", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/a([a-z]*)aA([A-Z]*)/X\\1XY\\2Y');
          return expect(editor.getText()).toEqual('XbcXYBCY\ndefdDEF\nabcaABC');
        });
        return it("replaces \\0 with the entire match", function() {
          keydown(':');
          submitNormalModeInputText(':substitute/ab(ca)AB/X\\0X');
          return expect(editor.getText()).toEqual('XabcaABXC\ndefdDEF\nabcaABC');
        });
      });
    });
    describe(":set", function() {
      it("throws an error without a specified option", function() {
        keydown(':');
        submitNormalModeInputText(':set');
        return expect(atom.notifications.notifications[0].message).toEqual('Command error: No option specified');
      });
      it("sets multiple options at once", function() {
        atom.config.set('editor.showInvisibles', false);
        atom.config.set('editor.showLineNumbers', false);
        keydown(':');
        submitNormalModeInputText(':set list number');
        expect(atom.config.get('editor.showInvisibles')).toBe(true);
        return expect(atom.config.get('editor.showLineNumbers')).toBe(true);
      });
      return describe("the options", function() {
        beforeEach(function() {
          atom.config.set('editor.showInvisibles', false);
          return atom.config.set('editor.showLineNumbers', false);
        });
        it("sets (no)list", function() {
          keydown(':');
          submitNormalModeInputText(':set list');
          expect(atom.config.get('editor.showInvisibles')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nolist');
          return expect(atom.config.get('editor.showInvisibles')).toBe(false);
        });
        return it("sets (no)nu(mber)", function() {
          keydown(':');
          submitNormalModeInputText(':set nu');
          expect(atom.config.get('editor.showLineNumbers')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nonu');
          expect(atom.config.get('editor.showLineNumbers')).toBe(false);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set number');
          expect(atom.config.get('editor.showLineNumbers')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nonumber');
          return expect(atom.config.get('editor.showLineNumbers')).toBe(false);
        });
      });
    });
    return describe("aliases", function() {
      it("calls the aliased function without arguments", function() {
        ExClass.registerAlias('W', 'w');
        spyOn(Ex, 'write');
        keydown(':');
        submitNormalModeInputText('W');
        return expect(Ex.write).toHaveBeenCalled();
      });
      return it("calls the aliased function with arguments", function() {
        var WArgs, writeArgs;
        ExClass.registerAlias('W', 'write');
        spyOn(Ex, 'W').andCallThrough();
        spyOn(Ex, 'write');
        keydown(':');
        submitNormalModeInputText('W');
        WArgs = Ex.W.calls[0].args[0];
        writeArgs = Ex.write.calls[0].args[0];
        return expect(WArgs).toBe(writeArgs);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvc3BlYy9leC1jb21tYW5kcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsV0FBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FKVixDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBTlYsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFPLENBQUMsU0FBUixDQUFBLENBUEwsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLGtJQUFBO0FBQUEsSUFBQSxPQUF3RCxFQUF4RCxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0Isa0JBQXhCLEVBQWtDLGlCQUFsQyxFQUEyQyxhQUEzQyxFQUFnRCxjQUFoRCxDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxRQUFmLEVBQWQ7SUFBQSxDQURkLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBVixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFNBQTFCLENBRFQsQ0FBQTtBQUFBLE1BRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxZQUFBLGlCQUFBO0FBQUEsUUFBQSxpQkFBQSxHQUFvQixNQUFNLENBQUMsUUFBUCxDQUFBLENBQXBCLENBQUE7QUFBQSxRQUNBLE9BQU8sQ0FBQyxjQUFSLENBQUEsQ0FEQSxDQUFBO2VBRUEsa0JBSGM7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxLQUFBLENBQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUF4QixFQUF1QyxRQUF2QyxDQUFnRCxDQUFDLGNBQWpELENBQUEsRUFERztNQUFBLENBQUwsQ0FQQSxDQUFBO0FBQUEsTUFVQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLE9BQU8sQ0FBQyxRQUFSLENBQUEsRUFEYztNQUFBLENBQWhCLENBVkEsQ0FBQTtBQUFBLE1BYUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtlQUNQLE1BQU0sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBN0MsR0FBc0QsRUFEL0M7TUFBQSxDQUFULENBYkEsQ0FBQTthQWdCQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQVYsRUFBd0Isb0JBQUEsR0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBTCxDQUFBLENBQUQsQ0FBM0MsQ0FBTixDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFFLENBQUMsTUFBSCxDQUFBLENBQVYsRUFBd0Isb0JBQUEsR0FBbUIsQ0FBQyxJQUFJLENBQUMsRUFBTCxDQUFBLENBQUQsQ0FBM0MsQ0FEUCxDQUFBO0FBQUEsUUFFQSxFQUFFLENBQUMsWUFBSCxDQUFnQixHQUFoQixDQUZBLENBQUE7QUFBQSxRQUdBLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQWhCLENBSEEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsR0FBRCxFQUFNLElBQU4sQ0FBdEIsQ0FKQSxDQUFBO2VBTUEsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRCxHQUFBO0FBQ3ZCLFVBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE9BQXZCLEVBQWdDLGNBQWhDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLFFBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxhQUFBLEdBQWdCLE9BRmhCLENBQUE7QUFBQSxVQUdBLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBLENBSFQsQ0FBQTtBQUFBLFVBSUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxVQUFVLENBQUMsY0FBbkIsQ0FBa0MsTUFBbEMsQ0FKWCxDQUFBO0FBQUEsVUFLQSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBM0IsQ0FBK0IsTUFBL0IsQ0FMVixDQUFBO0FBQUEsVUFNQSxRQUFRLENBQUMsa0JBQVQsQ0FBQSxDQU5BLENBQUE7QUFBQSxVQU9BLFFBQVEsQ0FBQyxlQUFULENBQUEsQ0FQQSxDQUFBO2lCQVFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0JBQWYsRUFUdUI7UUFBQSxDQUF6QixFQVBHO01BQUEsQ0FBTCxFQWpCUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFxQ0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxHQUFkLENBQUEsQ0FBQTthQUNBLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxFQUZRO0lBQUEsQ0FBVixDQXJDQSxDQUFBO0FBQUEsSUF5Q0EsT0FBQSxHQUFVLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTs7UUFBTSxVQUFRO09BQ3RCOztRQUFBLE9BQU8sQ0FBQyxVQUFXO09BQW5CO2FBQ0EsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUIsT0FBckIsRUFGUTtJQUFBLENBekNWLENBQUE7QUFBQSxJQTZDQSxzQkFBQSxHQUF5QixTQUFDLEdBQUQsRUFBTSxJQUFOLEdBQUE7O1FBQU0sT0FBTztPQUNwQzthQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsUUFBekMsQ0FBQSxDQUFtRCxDQUFDLE9BQXBELENBQTRELEdBQTVELEVBRHVCO0lBQUEsQ0E3Q3pCLENBQUE7QUFBQSxJQWdEQSx5QkFBQSxHQUE0QixTQUFDLElBQUQsR0FBQTtBQUMxQixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQTNDLENBQUE7QUFBQSxNQUNBLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxJQUFqQyxDQURBLENBQUE7YUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsRUFIMEI7SUFBQSxDQWhENUIsQ0FBQTtBQUFBLElBcURBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTtBQUNqQixNQUFBLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixVQUEzQixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLG9CQUFaLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSx5QkFBQSxDQUEwQixPQUExQixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxrQkFBWixDQUErQixDQUFDLGdCQUFoQyxDQUFBLEVBSjBCO1FBQUEsQ0FBNUIsQ0FIQSxDQUFBO0FBQUEsUUFTQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELGNBQUEsUUFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSx3QkFBWixDQUFYLENBQUE7QUFBQSxVQUNBLEtBQUEsQ0FBTSxJQUFOLEVBQVksb0JBQVosQ0FBaUMsQ0FBQyxTQUFsQyxDQUE0QyxRQUE1QyxDQURBLENBQUE7QUFBQSxVQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFVBR0EseUJBQUEsQ0FBMEIsT0FBMUIsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQVAsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxJQUFyQyxDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLEVBQTBCLE9BQTFCLENBQVAsQ0FBMEMsQ0FBQyxPQUEzQyxDQUFtRCxVQUFuRCxFQU5zRDtRQUFBLENBQXhELENBVEEsQ0FBQTtlQWlCQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFVBQUEsS0FBQSxDQUFNLElBQU4sRUFBWSxvQkFBWixDQUFpQyxDQUFDLFNBQWxDLENBQTRDLE1BQTVDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxlQUFWLENBREEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFHQSx5QkFBQSxDQUEwQixPQUExQixDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0MsRUFMc0Q7UUFBQSxDQUF4RCxFQWxCa0M7TUFBQSxDQUFwQyxDQUFBLENBQUE7YUF5QkEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxZQUFBLFdBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxRQUNBLENBQUEsR0FBSSxDQURKLENBQUE7QUFBQSxRQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLENBQUEsRUFBQSxDQUFBO0FBQUEsVUFDQSxRQUFBLEdBQVcsV0FBQSxDQUFhLFFBQUEsR0FBUSxDQUFyQixDQURYLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsVUFBZixDQUZBLENBQUE7aUJBR0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLEVBSlM7UUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLFFBU0EsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixVQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixDQUFBLENBQUE7QUFBQSxVQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFVBRUEseUJBQUEsQ0FBMEIsT0FBMUIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsQ0FBUCxDQUEwQyxDQUFDLE9BQTNDLENBQW1ELEtBQW5ELENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFQLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsS0FBakMsRUFMbUI7UUFBQSxDQUFyQixDQVRBLENBQUE7QUFBQSxRQWdCQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLGNBQUEsT0FBQTtBQUFBLFVBQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLFVBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFMLENBQWMsR0FBZCxFQUFtQixFQUFBLEdBQUcsUUFBSCxHQUFZLE1BQS9CLENBQVYsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLEtBQTNCLENBREEsQ0FBQTttQkFFQSxPQUFBLENBQVEsR0FBUixFQUhTO1VBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxVQU9BLFNBQUEsQ0FBVSxTQUFBLEdBQUE7QUFDUixZQUFBLHlCQUFBLENBQTJCLFFBQUEsR0FBUSxPQUFuQyxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsRUFBa0IsRUFBRSxDQUFDLFNBQUgsQ0FBYSxPQUFiLENBQWxCLENBRFYsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxVQUFILENBQWMsT0FBZCxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFBLENBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsT0FBaEIsRUFBeUIsT0FBekIsQ0FBUCxDQUF5QyxDQUFDLE9BQTFDLENBQWtELEtBQWxELENBSEEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBUCxDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDLENBSkEsQ0FBQTttQkFLQSxFQUFFLENBQUMsVUFBSCxDQUFjLE9BQWQsRUFOUTtVQUFBLENBQVYsQ0FQQSxDQUFBO0FBQUEsVUFlQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBLENBQXhCLENBZkEsQ0FBQTtBQUFBLFVBaUJBLEVBQUEsQ0FBRyxXQUFILEVBQWdCLFNBQUEsR0FBQTttQkFDZCxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWUsT0FBZixFQURJO1VBQUEsQ0FBaEIsQ0FqQkEsQ0FBQTtBQUFBLFVBb0JBLEVBQUEsQ0FBRyxZQUFILEVBQWlCLFNBQUEsR0FBQTttQkFDZixPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLEVBREs7VUFBQSxDQUFqQixDQXBCQSxDQUFBO2lCQXVCQSxFQUFBLENBQUcsV0FBSCxFQUFnQixTQUFBLEdBQUE7bUJBQ2QsT0FBQSxHQUFVLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLE9BQWYsRUFESTtVQUFBLENBQWhCLEVBeEJnQztRQUFBLENBQWxDLENBaEJBLENBQUE7QUFBQSxRQTJDQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSx5QkFBQSxDQUEwQixtQkFBMUIsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUEzQyxDQUFtRCxDQUFDLE9BQXBELENBQ0UsMkNBREYsRUFINEM7UUFBQSxDQUE5QyxDQTNDQSxDQUFBO2VBa0RBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsY0FBQSxVQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsRUFBYixDQUFBO0FBQUEsVUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxVQUFBLEdBQWEsV0FBQSxDQUFZLGNBQVosQ0FBYixDQUFBO21CQUNBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFVBQWpCLEVBQTZCLEtBQTdCLEVBRlM7VUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLFVBTUEsU0FBQSxDQUFVLFNBQUEsR0FBQTttQkFDUixFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsRUFEUTtVQUFBLENBQVYsQ0FOQSxDQUFBO0FBQUEsVUFTQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSx5QkFBQSxDQUEyQixRQUFBLEdBQVEsVUFBbkMsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFjLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBM0MsQ0FBbUQsQ0FBQyxPQUFwRCxDQUNFLGdEQURGLENBRkEsQ0FBQTttQkFLQSxNQUFBLENBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsVUFBaEIsRUFBNEIsT0FBNUIsQ0FBUCxDQUE0QyxDQUFDLE9BQTdDLENBQXFELEtBQXJELEVBTitDO1VBQUEsQ0FBakQsQ0FUQSxDQUFBO2lCQWlCQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsWUFDQSx5QkFBQSxDQUEyQixTQUFBLEdBQVMsVUFBcEMsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUExQixDQUF3QyxDQUFDLE9BQXpDLENBQWlELEVBQWpELENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsVUFBaEIsRUFBNEIsT0FBNUIsQ0FBUCxDQUE0QyxDQUFDLE9BQTdDLENBQXFELFVBQXJELEVBSmtDO1VBQUEsQ0FBcEMsRUFsQnVDO1FBQUEsQ0FBekMsRUFuRHdDO01BQUEsQ0FBMUMsRUExQmlCO0lBQUEsQ0FBbkIsQ0FyREEsQ0FBQTtBQUFBLElBMEpBLFFBQUEsQ0FBUyxPQUFULEVBQWtCLFNBQUEsR0FBQTthQUNoQixFQUFBLENBQUcsV0FBSCxFQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixTQUF0QixDQUFBLENBQUE7QUFBQSxRQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFFBRUEseUJBQUEsQ0FBMEIsTUFBMUIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBdEIsQ0FBOEIsQ0FBQyxnQkFBL0IsQ0FBQSxFQUpjO01BQUEsQ0FBaEIsRUFEZ0I7SUFBQSxDQUFsQixDQTFKQSxDQUFBO0FBQUEsSUFpS0EsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLE1BQUEsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLFVBQTNCLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBR0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksb0JBQVosQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLHlCQUFBLENBQTBCLFFBQTFCLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGtCQUFaLENBQStCLENBQUMsZ0JBQWhDLENBQUEsRUFKMEI7UUFBQSxDQUE1QixDQUhBLENBQUE7QUFBQSxRQVNBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsY0FBQSxRQUFBO0FBQUEsVUFBQSxRQUFBLEdBQVcsV0FBQSxDQUFZLHlCQUFaLENBQVgsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxDQUFNLElBQU4sRUFBWSxvQkFBWixDQUFpQyxDQUFDLFNBQWxDLENBQTRDLFFBQTVDLENBREEsQ0FBQTtBQUFBLFVBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsVUFHQSx5QkFBQSxDQUEwQixRQUExQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBUCxDQUErQixDQUFDLElBQWhDLENBQXFDLElBQXJDLENBSkEsQ0FBQTtpQkFLQSxNQUFBLENBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsQ0FBUCxDQUEwQyxDQUFDLE9BQTNDLENBQW1ELFVBQW5ELEVBTnNEO1FBQUEsQ0FBeEQsQ0FUQSxDQUFBO2VBaUJBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsVUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLG9CQUFaLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsTUFBNUMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFBLENBQU0sRUFBTixFQUFVLGVBQVYsQ0FEQSxDQUFBO0FBQUEsVUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxVQUdBLHlCQUFBLENBQTBCLFFBQTFCLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQyxFQUxzRDtRQUFBLENBQXhELEVBbEJrQztNQUFBLENBQXBDLENBQUEsQ0FBQTthQXlCQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFlBQUEsV0FBQTtBQUFBLFFBQUEsUUFBQSxHQUFXLEVBQVgsQ0FBQTtBQUFBLFFBQ0EsQ0FBQSxHQUFJLENBREosQ0FBQTtBQUFBLFFBR0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxXQUFBLENBQWEsU0FBQSxHQUFTLENBQXRCLENBRFgsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxVQUFmLENBRkEsQ0FBQTtpQkFHQSxNQUFNLENBQUMsTUFBUCxDQUFjLFFBQWQsRUFKUztRQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsUUFTQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFmLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSx5QkFBQSxDQUEwQixRQUExQixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQW1ELENBQUMsT0FBcEQsQ0FDRSxrQ0FERixFQUorQjtRQUFBLENBQWpDLENBVEEsQ0FBQTtBQUFBLFFBaUJBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsY0FBQSxPQUFBO0FBQUEsVUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsVUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQUwsQ0FBYyxHQUFkLEVBQW1CLEVBQUEsR0FBRyxRQUFILEdBQVksTUFBL0IsQ0FBVixDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsS0FBM0IsQ0FEQSxDQUFBO21CQUVBLE9BQUEsQ0FBUSxHQUFSLEVBSFM7VUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLFVBT0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtBQUNSLFlBQUEseUJBQUEsQ0FBMkIsU0FBQSxHQUFTLE9BQXBDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixFQUFrQixFQUFFLENBQUMsU0FBSCxDQUFhLE9BQWIsQ0FBbEIsQ0FEVixDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sRUFBRSxDQUFDLFVBQUgsQ0FBYyxPQUFkLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxJQUFwQyxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixPQUFoQixFQUF5QixPQUF6QixDQUFQLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsS0FBbEQsQ0FIQSxDQUFBO0FBQUEsWUFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFQLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsS0FBakMsQ0FKQSxDQUFBO21CQUtBLEVBQUUsQ0FBQyxVQUFILENBQWMsT0FBZCxFQU5RO1VBQUEsQ0FBVixDQVBBLENBQUE7QUFBQSxVQWVBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUEsQ0FBeEIsQ0FmQSxDQUFBO0FBQUEsVUFpQkEsRUFBQSxDQUFHLFdBQUgsRUFBZ0IsU0FBQSxHQUFBO21CQUNkLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxPQUFmLEVBREk7VUFBQSxDQUFoQixDQWpCQSxDQUFBO0FBQUEsVUFvQkEsRUFBQSxDQUFHLFlBQUgsRUFBaUIsU0FBQSxHQUFBO21CQUNmLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBZ0IsT0FBaEIsRUFESztVQUFBLENBQWpCLENBcEJBLENBQUE7aUJBdUJBLEVBQUEsQ0FBRyxXQUFILEVBQWdCLFNBQUEsR0FBQTttQkFDZCxPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWUsT0FBZixFQURJO1VBQUEsQ0FBaEIsRUF4QmdDO1FBQUEsQ0FBbEMsQ0FqQkEsQ0FBQTtBQUFBLFFBNENBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTBCLG9CQUExQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQW1ELENBQUMsT0FBcEQsQ0FDRSwyQ0FERixFQUg0QztRQUFBLENBQTlDLENBNUNBLENBQUE7ZUFtREEsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxjQUFBLFVBQUE7QUFBQSxVQUFBLFVBQUEsR0FBYSxFQUFiLENBQUE7QUFBQSxVQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLFVBQUEsR0FBYSxXQUFBLENBQVksZUFBWixDQUFiLENBQUE7bUJBQ0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsVUFBakIsRUFBNkIsS0FBN0IsRUFGUztVQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsVUFNQSxTQUFBLENBQVUsU0FBQSxHQUFBO21CQUNSLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxFQURRO1VBQUEsQ0FBVixDQU5BLENBQUE7QUFBQSxVQVNBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLHlCQUFBLENBQTJCLFNBQUEsR0FBUyxVQUFwQyxDQURBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUEzQyxDQUFtRCxDQUFDLE9BQXBELENBQ0UsZ0RBREYsQ0FGQSxDQUFBO21CQUtBLE1BQUEsQ0FBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixVQUFoQixFQUE0QixPQUE1QixDQUFQLENBQTRDLENBQUMsT0FBN0MsQ0FBcUQsS0FBckQsRUFOK0M7VUFBQSxDQUFqRCxDQVRBLENBQUE7aUJBaUJBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxZQUNBLHlCQUFBLENBQTJCLFVBQUEsR0FBVSxVQUFyQyxDQURBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQTFCLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsRUFBakQsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixVQUFoQixFQUE0QixPQUE1QixDQUFQLENBQTRDLENBQUMsT0FBN0MsQ0FBcUQsVUFBckQsRUFKbUM7VUFBQSxDQUFyQyxFQWxCdUM7UUFBQSxDQUF6QyxFQXBEd0M7TUFBQSxDQUExQyxFQTFCa0I7SUFBQSxDQUFwQixDQWpLQSxDQUFBO0FBQUEsSUF1UUEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBUCxDQUFBO0FBQUEsVUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLG1CQUFaLENBQWdDLENBQUMsY0FBakMsQ0FBQSxDQURBLENBQUE7aUJBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsRUFIYztRQUFBLENBQWhCLEVBRFM7TUFBQSxDQUFYLENBREEsQ0FBQTtBQUFBLE1BT0EsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EseUJBQUEsQ0FBMEIsTUFBMUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGlCQUFaLENBQThCLENBQUMsZ0JBQS9CLENBQUEsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsRUFKZ0Q7TUFBQSxDQUFsRCxDQVBBLENBQUE7YUFhQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsS0FBM0IsRUFEUztRQUFBLENBQVgsQ0FBQSxDQUFBO2VBR0EsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksa0JBQVosQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLHlCQUFBLENBQTBCLE1BQTFCLENBRkEsQ0FBQTtpQkFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGdCQUFaLENBQTZCLENBQUMsZ0JBQTlCLENBQUEsRUFKNkI7UUFBQSxDQUEvQixFQUpnRDtNQUFBLENBQWxELEVBZGdCO0lBQUEsQ0FBbEIsQ0F2UUEsQ0FBQTtBQUFBLElBK1JBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTthQUNuQixFQUFBLENBQUcsYUFBSCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLE9BQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxRQUVBLHlCQUFBLENBQTBCLFNBQTFCLENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBWixDQUFrQixDQUFDLGdCQUFuQixDQUFBLEVBSmdCO01BQUEsQ0FBbEIsRUFEbUI7SUFBQSxDQUFyQixDQS9SQSxDQUFBO0FBQUEsSUFzU0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO2FBQ3BCLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLFVBQVYsQ0FBcUIsQ0FBQyxjQUF0QixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxNQUFWLENBQWlCLENBQUMsY0FBbEIsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EseUJBQUEsQ0FBMEIsVUFBMUIsQ0FIQSxDQUFBO2VBSUEsU0FBQSxNQUFBLENBQU8sRUFBRSxDQUFDLElBQVYsQ0FBQSxDQUFlLENBQUMsb0JBQWhCLGNBQXFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQTFELEVBTDhCO01BQUEsQ0FBaEMsRUFEb0I7SUFBQSxDQUF0QixDQXRTQSxDQUFBO0FBQUEsSUE4U0EsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBUCxDQUFBO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBQUg7VUFBQSxDQUEzQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQUFIO1VBQUEsQ0FEUixFQUZjO1FBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FEQSxDQUFBO0FBQUEsTUFPQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFFBQUEsSUFBSSxDQUFDLG1CQUFMLENBQXlCLENBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixTQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDLEVBSjZCO01BQUEsQ0FBL0IsQ0FQQSxDQUFBO2FBYUEsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsSUFBSSxDQUFDLG1CQUFMLENBQXlCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEdBQXlCLENBQWxELENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixTQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDLEVBSmlCO01BQUEsQ0FBbkIsRUFkbUI7SUFBQSxDQUFyQixDQTlTQSxDQUFBO0FBQUEsSUFrVUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBUCxDQUFBO2lCQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQSxHQUFBO21CQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBQUg7VUFBQSxDQUEzQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUEsR0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxFQUFIO1VBQUEsQ0FEUixFQUZjO1FBQUEsQ0FBaEIsRUFEUztNQUFBLENBQVgsQ0FEQSxDQUFBO0FBQUEsTUFPQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsSUFBSSxDQUFDLG1CQUFMLENBQXlCLENBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixhQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDLEVBSmlDO01BQUEsQ0FBbkMsQ0FQQSxDQUFBO2FBYUEsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsSUFBSSxDQUFDLG1CQUFMLENBQXlCLENBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixhQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLGtCQUFMLENBQUEsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQWhCLEdBQXlCLENBQWhFLEVBSmlCO01BQUEsQ0FBbkIsRUFkdUI7SUFBQSxDQUF6QixDQWxVQSxDQUFBO0FBQUEsSUFzVkEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLE9BQVYsQ0FBa0IsQ0FBQyxjQUFuQixDQUFBLENBQUEsQ0FBQTtlQUNBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsTUFBVixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsUUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLG9CQUFaLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsV0FBQSxDQUFZLE1BQVosQ0FBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxRQUVBLHlCQUFBLENBQTBCLElBQTFCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLEVBQUUsQ0FBQyxLQUFWLENBQWdCLENBQUMsZ0JBQWpCLENBQUEsQ0FIQSxDQUFBO2VBTUEsUUFBQSxDQUFTLENBQUMsU0FBQSxHQUFBO2lCQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBWDtRQUFBLENBQUQsQ0FBVCxFQUFpQyxnQ0FBakMsRUFBbUUsR0FBbkUsRUFQZ0M7TUFBQSxDQUFsQyxDQUpBLENBQUE7QUFBQSxNQWFBLEVBQUEsQ0FBRywrRUFBSCxFQUFvRixTQUFBLEdBQUE7QUFDbEYsWUFBQSxZQUFBO0FBQUEsUUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLG9CQUFaLENBQWlDLENBQUMsU0FBbEMsQ0FBNEMsTUFBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxRQUVBLHlCQUFBLENBQTBCLElBQTFCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLEVBQUUsQ0FBQyxLQUFWLENBQWdCLENBQUMsZ0JBQWpCLENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFJQSxZQUFBLEdBQWUsS0FKZixDQUFBO0FBQUEsUUFNQSxZQUFBLENBQWEsQ0FBQyxTQUFBLEdBQUE7aUJBQ1osWUFBQSxHQUFlLENBQUEsRUFBTSxDQUFDLElBQUksQ0FBQyxVQURmO1FBQUEsQ0FBRCxDQUFiLENBTkEsQ0FBQTtlQVFBLFFBQUEsQ0FBUyxDQUFDLFNBQUEsR0FBQTtpQkFBRyxhQUFIO1FBQUEsQ0FBRCxDQUFULEVBQTRCLEdBQTVCLEVBVGtGO01BQUEsQ0FBcEYsQ0FiQSxDQUFBO2FBd0JBLEVBQUEsQ0FBRyxzQkFBSCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLHlCQUFBLENBQTBCLFNBQTFCLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxLQUFWLENBQ0UsQ0FBQyxnQkFESCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFJLENBQUMsSUFBL0IsQ0FBQSxDQUFQLENBQTZDLENBQUMsT0FBOUMsQ0FBc0QsTUFBdEQsQ0FKQSxDQUFBO2VBS0EsUUFBQSxDQUFTLENBQUMsU0FBQSxHQUFBO2lCQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBWDtRQUFBLENBQUQsQ0FBVCxFQUFpQyxnQ0FBakMsRUFBbUUsR0FBbkUsRUFOeUI7TUFBQSxDQUEzQixFQXpCYztJQUFBLENBQWhCLENBdFZBLENBQUE7QUFBQSxJQXVYQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7YUFDZixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxJQUFWLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixLQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sRUFBRSxDQUFDLEVBQVYsQ0FBYSxDQUFDLGdCQUFkLENBQUEsRUFKNEI7TUFBQSxDQUE5QixFQURlO0lBQUEsQ0FBakIsQ0F2WEEsQ0FBQTtBQUFBLElBOFhBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTthQUNqQixFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLFFBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxNQUFWLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxTQUFWLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSx5QkFBQSxDQUEwQixPQUExQixDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxFQUFFLENBQUMsSUFBVixDQUFlLENBQUMsZ0JBQWhCLENBQUEsQ0FKQSxDQUFBO2VBS0EsTUFBQSxDQUFPLEVBQUUsQ0FBQyxPQUFWLENBQWtCLENBQUMsZ0JBQW5CLENBQUEsRUFOK0I7TUFBQSxDQUFqQyxFQURpQjtJQUFBLENBQW5CLENBOVhBLENBQUE7QUFBQSxJQXVZQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxjQUFBLFFBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxXQUFBLENBQVksUUFBWixDQUFYLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixLQUEzQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxNQUFQLENBQWMsUUFBZCxDQUZBLENBQUE7QUFBQSxVQUdBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLENBSEEsQ0FBQTtBQUFBLFVBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsVUFLQSx5QkFBQSxDQUEwQixNQUExQixDQUxBLENBQUE7aUJBT0EsUUFBQSxDQUFTLENBQUMsU0FBQSxHQUFBO21CQUFHLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxLQUFvQixNQUF2QjtVQUFBLENBQUQsQ0FBVCxFQUNFLGdDQURGLEVBQ29DLEdBRHBDLEVBUm1DO1FBQUEsQ0FBckMsQ0FBQSxDQUFBO0FBQUEsUUFXQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELGNBQUEsaUJBQUE7QUFBQSxVQUFBLFFBQUEsR0FBVyxXQUFBLENBQVksUUFBWixDQUFYLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixLQUEzQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxNQUFQLENBQWMsUUFBZCxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixNQUEzQixDQUhBLENBQUE7QUFBQSxVQUlBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLENBSkEsQ0FBQTtBQUFBLFVBS0EsT0FBQSxDQUFRLEdBQVIsQ0FMQSxDQUFBO0FBQUEsVUFNQSx5QkFBQSxDQUEwQixNQUExQixDQU5BLENBQUE7QUFBQSxVQU9BLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUEzQyxDQUFtRCxDQUFDLE9BQXBELENBQ0UsK0RBREYsQ0FQQSxDQUFBO0FBQUEsVUFTQSxPQUFBLEdBQVUsS0FUVixDQUFBO0FBQUEsVUFVQSxZQUFBLENBQWEsU0FBQSxHQUFBO21CQUFHLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUEsS0FBc0IsTUFBbkM7VUFBQSxDQUFiLENBVkEsQ0FBQTtpQkFXQSxRQUFBLENBQVMsQ0FBQyxTQUFBLEdBQUE7bUJBQUcsUUFBSDtVQUFBLENBQUQsQ0FBVCxFQUF1QixvQ0FBdkIsRUFBNkQsRUFBN0QsRUFabUQ7UUFBQSxDQUFyRCxDQVhBLENBQUE7QUFBQSxRQXlCQSxFQUFBLENBQUcsMERBQUgsRUFBK0QsU0FBQSxHQUFBO0FBQzdELGNBQUEsUUFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSxRQUFaLENBQVgsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLEtBQTNCLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLE1BQTNCLENBSEEsQ0FBQTtBQUFBLFVBSUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsS0FBM0IsQ0FKQSxDQUFBO0FBQUEsVUFLQSxPQUFBLENBQVEsR0FBUixDQUxBLENBQUE7QUFBQSxVQU1BLHlCQUFBLENBQTBCLE9BQTFCLENBTkEsQ0FBQTtBQUFBLFVBT0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQXhDLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsQ0FBckQsQ0FQQSxDQUFBO2lCQVFBLFFBQUEsQ0FBUyxDQUFDLFNBQUEsR0FBQTttQkFBRyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQUEsS0FBb0IsTUFBdkI7VUFBQSxDQUFELENBQVQsRUFDRSxnQ0FERixFQUNvQyxFQURwQyxFQVQ2RDtRQUFBLENBQS9ELENBekJBLENBQUE7ZUFxQ0EsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxNQUFuQixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsVUFFQSx5QkFBQSxDQUEwQixNQUExQixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUEzQyxDQUFtRCxDQUFDLE9BQXBELENBQ0UsNkJBREYsQ0FIQSxDQUFBO0FBQUEsVUFLQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsQ0FMQSxDQUFBO0FBQUEsVUFNQSx5QkFBQSxDQUEwQixPQUExQixDQU5BLENBQUE7aUJBT0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQW1ELENBQUMsT0FBcEQsQ0FDRSw2QkFERixFQVI0QztRQUFBLENBQTlDLEVBdEM4QjtNQUFBLENBQWhDLENBQUEsQ0FBQTthQWlEQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCLENBQUEsQ0FBQTtpQkFDQSxNQUFNLENBQUMsU0FBUCxDQUFBLENBQWtCLENBQUMsTUFBbkIsQ0FBQSxFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUlBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsY0FBQSxRQUFBO0FBQUEsVUFBQSxRQUFBLEdBQVcsV0FBQSxDQUFZLGVBQVosQ0FBWCxDQUFBO0FBQUEsVUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxVQUVBLHlCQUFBLENBQTJCLE9BQUEsR0FBTyxRQUFsQyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsUUFBakQsRUFKNkI7UUFBQSxDQUEvQixDQUpBLENBQUE7QUFBQSxRQVVBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTBCLHlCQUExQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FDRSxXQUFBLENBQVksb0JBQVosQ0FERixFQUgwQjtRQUFBLENBQTVCLENBVkEsQ0FBQTtlQWdCQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQSxHQUFBO0FBQ3pELFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSx5QkFBQSxDQUEwQixzQ0FBMUIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBM0IsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQW1ELENBQUMsT0FBcEQsQ0FDRSwyQ0FERixFQUp5RDtRQUFBLENBQTNELEVBakIyQjtNQUFBLENBQTdCLEVBbERnQjtJQUFBLENBQWxCLENBdllBLENBQUE7QUFBQSxJQWlkQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxFQUFBLENBQUcsbURBQUgsRUFBd0QsU0FBQSxHQUFBO0FBQ3RELFlBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxDQUFNLEVBQU4sRUFBVSxTQUFWLENBQW9CLENBQUMsY0FBckIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsTUFBVixDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EseUJBQUEsQ0FBMEIsc0JBQTFCLENBSEEsQ0FBQTtlQUlBLFNBQUEsTUFBQSxDQUFPLEVBQUUsQ0FBQyxJQUFWLENBQUEsQ0FBZSxDQUFDLG9CQUFoQixjQUFxQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUF6RCxFQUxzRDtNQUFBLENBQXhELENBQUEsQ0FBQTthQU9BLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBLEdBQUE7QUFDNUQsWUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLENBQU0sRUFBTixFQUFVLFNBQVYsQ0FBb0IsQ0FBQyxjQUFyQixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxRQUFWLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSx5QkFBQSxDQUEwQixXQUExQixDQUhBLENBQUE7ZUFJQSxTQUFBLE1BQUEsQ0FBTyxFQUFFLENBQUMsTUFBVixDQUFBLENBQ0UsQ0FBQyxvQkFESCxjQUN3QixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUQ1QyxFQUw0RDtNQUFBLENBQTlELEVBUm1CO0lBQUEsQ0FBckIsQ0FqZEEsQ0FBQTtBQUFBLElBaWVBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTthQUNsQixFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsUUFFQSx5QkFBQSxDQUEwQixRQUExQixDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF0QixDQUEyQixDQUFDLGdCQUE1QixDQUFBLEVBSm9CO01BQUEsQ0FBdEIsRUFEa0I7SUFBQSxDQUFwQixDQWplQSxDQUFBO0FBQUEsSUF3ZUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO2FBQ2pCLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsWUFBQSxjQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBUCxDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLFNBQVosQ0FBc0IsQ0FBQyxjQUF2QixDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLFdBQUEsQ0FBWSxPQUFaLENBRlgsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLENBSEEsQ0FBQTtBQUFBLFFBSUEsT0FBQSxDQUFRLEdBQVIsQ0FKQSxDQUFBO0FBQUEsUUFLQSx5QkFBQSxDQUEwQixPQUExQixDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sSUFBSSxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxnQkFBckIsQ0FBQSxFQVBvQztNQUFBLENBQXRDLEVBRGlCO0lBQUEsQ0FBbkIsQ0F4ZUEsQ0FBQTtBQUFBLElBb2ZBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTthQUNsQixFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFlBQUEsY0FBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQVAsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLElBQU4sRUFBWSxXQUFaLENBQXdCLENBQUMsY0FBekIsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxXQUFBLENBQVksUUFBWixDQUZYLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxNQUFQLENBQWMsUUFBZCxDQUhBLENBQUE7QUFBQSxRQUlBLE9BQUEsQ0FBUSxHQUFSLENBSkEsQ0FBQTtBQUFBLFFBS0EseUJBQUEsQ0FBMEIsUUFBMUIsQ0FMQSxDQUFBO2VBTUEsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFaLENBQXNCLENBQUMsZ0JBQXZCLENBQUEsRUFQd0M7TUFBQSxDQUExQyxFQURrQjtJQUFBLENBQXBCLENBcGZBLENBQUE7QUFBQSxJQWdnQkEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxvQkFBZixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixFQUZTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUlBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLHlCQUFBLENBQTBCLFFBQTFCLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxlQUFqQyxFQUg2QjtNQUFBLENBQS9CLENBSkEsQ0FBQTtBQUFBLE1BU0EsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxZQUFBLGdCQUFBO0FBQUEsUUFBQSxnQkFBQSxHQUFtQixLQUFuQixDQUFBO0FBQUEsUUFDQSxPQUFPLENBQUMsbUJBQVIsQ0FBNEIsU0FBQSxHQUFBO2lCQUFHLGdCQUFBLEdBQW1CLEtBQXRCO1FBQUEsQ0FBNUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxPQUFBLENBQVEsR0FBUixDQUZBLENBQUE7QUFBQSxRQUdBLHlCQUFBLENBQTBCLFdBQTFCLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLFVBQWpDLENBSkEsQ0FBQTtBQUFBLFFBTUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRyxpQkFBSDtRQUFBLENBQVQsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFNLENBQUMsT0FBUCxDQUFlLG9CQUFmLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FSQSxDQUFBO0FBQUEsUUFVQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsQ0FWQSxDQUFBO0FBQUEsUUFXQSx5QkFBQSxDQUEwQixZQUExQixDQVhBLENBQUE7ZUFZQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsT0FBakMsRUFieUM7TUFBQSxDQUEzQyxDQVRBLENBQUE7YUF3QkEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EseUJBQUEsQ0FBMEIsWUFBMUIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsVUFBakMsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsV0FBdEMsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLG9CQUFqQyxFQUx5QztNQUFBLENBQTNDLEVBekJrQjtJQUFBLENBQXBCLENBaGdCQSxDQUFBO0FBQUEsSUFnaUJBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsMkJBQWYsQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsRUFGUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQSxHQUFBO0FBQzdDLFFBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsUUFDQSx5QkFBQSxDQUEwQixrQkFBMUIsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQUg2QztNQUFBLENBQS9DLENBSkEsQ0FBQTtBQUFBLE1BU0EsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxRQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFFBQ0EseUJBQUEsQ0FBMEIsaUJBQTFCLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQywyQkFBakMsRUFIOEM7TUFBQSxDQUFoRCxDQVRBLENBQUE7QUFBQSxNQWNBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLHlCQUFBLENBQTBCLG1CQUExQixDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQywyQkFBakMsQ0FGQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsQ0FKQSxDQUFBO0FBQUEsUUFLQSx5QkFBQSxDQUEwQixvQkFBMUIsQ0FMQSxDQUFBO2VBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQVBvQztNQUFBLENBQXRDLENBZEEsQ0FBQTtBQUFBLE1BdUJBLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLHlCQUFBLENBQTBCLHNCQUExQixDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQywyQkFBakMsQ0FGQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsQ0FKQSxDQUFBO0FBQUEsUUFLQSx5QkFBQSxDQUEwQix5QkFBMUIsQ0FMQSxDQUFBO2VBTUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQVArQjtNQUFBLENBQWpDLENBdkJBLENBQUE7QUFBQSxNQWdDQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO0FBQzdCLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTJCLGNBQUEsR0FBYyxLQUFkLEdBQW9CLEdBQXBCLEdBQXVCLEtBQXZCLEdBQTZCLEdBQTdCLEdBQWdDLEtBQWhDLEdBQXNDLElBQWpFLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQW1ELENBQUMsT0FBcEQsQ0FDRSxxR0FERixDQUZBLENBQUE7aUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQUxLO1FBQUEsQ0FBUCxDQUFBO0FBQUEsUUFPQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO2lCQUFHLElBQUEsQ0FBSyxHQUFMLEVBQUg7UUFBQSxDQUFwQyxDQVBBLENBQUE7QUFBQSxRQVFBLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7aUJBQUcsSUFBQSxDQUFLLEdBQUwsRUFBSDtRQUFBLENBQXBDLENBUkEsQ0FBQTtBQUFBLFFBU0EsRUFBQSxDQUFHLDRCQUFILEVBQW9DLFNBQUEsR0FBQTtpQkFBRyxJQUFBLENBQUssSUFBTCxFQUFIO1FBQUEsQ0FBcEMsQ0FUQSxDQUFBO0FBQUEsUUFVQSxFQUFBLENBQUcsNEJBQUgsRUFBb0MsU0FBQSxHQUFBO2lCQUFHLElBQUEsQ0FBSyxHQUFMLEVBQUg7UUFBQSxDQUFwQyxDQVZBLENBQUE7ZUFXQSxFQUFBLENBQUcsMkJBQUgsRUFBb0MsU0FBQSxHQUFBO2lCQUFHLElBQUEsQ0FBSyxHQUFMLEVBQUg7UUFBQSxDQUFwQyxFQVo2QjtNQUFBLENBQS9CLENBaENBLENBQUE7QUFBQSxNQThDQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLGdCQUFmLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBR0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EseUJBQUEsQ0FBMEIsbUJBQTFCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsYUFBakMsRUFIMEM7UUFBQSxDQUE1QyxDQUhBLENBQUE7ZUFRQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFVBQUEsT0FBQSxDQUFRLEdBQVIsQ0FBQSxDQUFBO0FBQUEsVUFDQSx5QkFBQSxDQUEwQixvQkFBMUIsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxVQUFqQyxFQUh1QztRQUFBLENBQXpDLEVBVDRCO01BQUEsQ0FBOUIsQ0E5Q0EsQ0FBQTtBQUFBLE1BNERBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsWUFBQSxJQUFBO0FBQUEsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2lCQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsYUFBZixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLElBQUEsR0FBTyxTQUFDLFVBQUQsRUFBYSxPQUFiLEdBQUE7QUFDTCxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EseUJBQUEsQ0FBMkIsa0JBQUEsR0FBa0IsVUFBbEIsR0FBNkIsSUFBeEQsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFrQyxLQUFBLEdBQUssT0FBTCxHQUFhLEtBQWIsR0FBa0IsT0FBbEIsR0FBMEIsS0FBNUQsRUFISztRQUFBLENBSFAsQ0FBQTtBQUFBLFFBUUEsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtpQkFBRyxJQUFBLENBQUssR0FBTCxFQUFVLElBQVYsRUFBSDtRQUFBLENBQTFCLENBUkEsQ0FBQTtBQUFBLFFBU0EsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtpQkFBRyxJQUFBLENBQUssR0FBTCxFQUFVLElBQVYsRUFBSDtRQUFBLENBQS9CLENBVEEsQ0FBQTtlQVVBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7aUJBQUcsSUFBQSxDQUFLLEdBQUwsRUFBVSxJQUFWLEVBQUg7UUFBQSxDQUF0QyxFQVgwQztNQUFBLENBQTVDLENBNURBLENBQUE7QUFBQSxNQXlFQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxVQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7bUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSwyQkFBZixFQURTO1VBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxVQUdBLEVBQUEsQ0FBRyw2RUFBSCxFQUFrRixTQUFBLEdBQUE7QUFDaEYsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLEVBQWtELEtBQWxELENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSx5QkFBQSxDQUEwQix1QkFBMUIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQywyQkFBakMsRUFKZ0Y7VUFBQSxDQUFsRixDQUhBLENBQUE7QUFBQSxVQVNBLEVBQUEsQ0FBRyw2RUFBSCxFQUFrRixTQUFBLEdBQUE7QUFDaEYsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDJCQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsT0FBQSxDQUFRLEdBQVIsQ0FEQSxDQUFBO0FBQUEsWUFFQSx5QkFBQSxDQUEwQix1QkFBMUIsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQywyQkFBakMsRUFKZ0Y7VUFBQSxDQUFsRixDQVRBLENBQUE7QUFBQSxVQWVBLEVBQUEsQ0FBRyw4RUFBSCxFQUFtRixTQUFBLEdBQUE7QUFDakYsWUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDJCQUFmLENBQUEsQ0FBQTtBQUFBLFlBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFrRCxJQUFsRCxDQURBLENBQUE7QUFBQSxZQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFlBR0EseUJBQUEsQ0FBMEIsdUJBQTFCLENBSEEsQ0FBQTttQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBTGlGO1VBQUEsQ0FBbkYsQ0FmQSxDQUFBO2lCQXNCQSxFQUFBLENBQUcsNEVBQUgsRUFBaUYsU0FBQSxHQUFBO0FBQy9FLFlBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSwyQkFBZixDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEseUJBQUEsQ0FBMEIsdUJBQTFCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBSitFO1VBQUEsQ0FBakYsRUF2QnlDO1FBQUEsQ0FBM0MsQ0FBQSxDQUFBO2VBNkJBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsVUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULE1BQU0sQ0FBQyxPQUFQLENBQWUsMkJBQWYsRUFEUztVQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsVUFHQSxFQUFBLENBQUcsMkVBQUgsRUFBZ0YsU0FBQSxHQUFBO0FBQzlFLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFrRCxLQUFsRCxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEseUJBQUEsQ0FBMEIsMEJBQTFCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBSjhFO1VBQUEsQ0FBaEYsQ0FIQSxDQUFBO0FBQUEsVUFTQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFrRCxLQUFsRCxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEseUJBQUEsQ0FBMEIsMEJBQTFCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBSitDO1VBQUEsQ0FBakQsQ0FUQSxDQUFBO0FBQUEsVUFlQSxFQUFBLENBQUcsbUdBQUgsRUFBd0csU0FBQSxHQUFBO0FBQ3RHLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFrRCxJQUFsRCxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEseUJBQUEsQ0FBMEIsMEJBQTFCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBSnNHO1VBQUEsQ0FBeEcsQ0FmQSxDQUFBO0FBQUEsVUFxQkEsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsSUFBbEQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLHlCQUFBLENBQTBCLDZCQUExQixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQUo4QztVQUFBLENBQWhELENBckJBLENBQUE7QUFBQSxVQTJCQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixFQUFrRCxJQUFsRCxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsQ0FBUSxHQUFSLENBREEsQ0FBQTtBQUFBLFlBRUEseUJBQUEsQ0FBMEIsNkJBQTFCLENBRkEsQ0FBQTttQkFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsMkJBQWpDLEVBSjhDO1VBQUEsQ0FBaEQsQ0EzQkEsQ0FBQTtpQkFpQ0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUEsR0FBQTtBQUMzQyxZQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsSUFBbEQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxPQUFBLENBQVEsR0FBUixDQURBLENBQUE7QUFBQSxZQUVBLHlCQUFBLENBQTBCLDJCQUExQixDQUZBLENBQUE7bUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQUoyQztVQUFBLENBQTdDLEVBbENxQztRQUFBLENBQXZDLEVBOUIyQjtNQUFBLENBQTdCLENBekVBLENBQUE7YUErSUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsTUFBTSxDQUFDLE9BQVAsQ0FBZSwyQkFBZixFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBLEdBQUE7QUFDdEMsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTBCLDRCQUExQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLDJCQUFqQyxFQUhzQztRQUFBLENBQXhDLENBSEEsQ0FBQTtBQUFBLFFBUUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EseUJBQUEsQ0FBMEIsNENBQTFCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsNEJBQWpDLEVBSDZCO1FBQUEsQ0FBL0IsQ0FSQSxDQUFBO2VBYUEsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxVQUFBLE9BQUEsQ0FBUSxHQUFSLENBQUEsQ0FBQTtBQUFBLFVBQ0EseUJBQUEsQ0FBMEIsNEJBQTFCLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsNkJBQWpDLEVBSHVDO1FBQUEsQ0FBekMsRUFkMkI7TUFBQSxDQUE3QixFQWhKc0I7SUFBQSxDQUF4QixDQWhpQkEsQ0FBQTtBQUFBLElBbXNCQSxRQUFBLENBQVMsTUFBVCxFQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsUUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxRQUNBLHlCQUFBLENBQTBCLE1BQTFCLENBREEsQ0FBQTtlQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUEzQyxDQUFtRCxDQUFDLE9BQXBELENBQ0Usb0NBREYsRUFIK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7QUFBQSxNQU1BLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxLQUExQyxDQURBLENBQUE7QUFBQSxRQUVBLE9BQUEsQ0FBUSxHQUFSLENBRkEsQ0FBQTtBQUFBLFFBR0EseUJBQUEsQ0FBMEIsa0JBQTFCLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBUCxDQUFnRCxDQUFDLElBQWpELENBQXNELElBQXRELENBSkEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQVAsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxJQUF2RCxFQU5rQztNQUFBLENBQXBDLENBTkEsQ0FBQTthQWNBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekMsQ0FBQSxDQUFBO2lCQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsS0FBMUMsRUFGUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFJQSxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTBCLFdBQTFCLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBUCxDQUFnRCxDQUFDLElBQWpELENBQXNELElBQXRELENBRkEsQ0FBQTtBQUFBLFVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLGNBQXRDLENBSEEsQ0FBQTtBQUFBLFVBSUEseUJBQUEsQ0FBMEIsYUFBMUIsQ0FKQSxDQUFBO2lCQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQVAsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxLQUF0RCxFQU5rQjtRQUFBLENBQXBCLENBSkEsQ0FBQTtlQVlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxPQUFBLENBQVEsR0FBUixDQUFBLENBQUE7QUFBQSxVQUNBLHlCQUFBLENBQTBCLFNBQTFCLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBUCxDQUFpRCxDQUFDLElBQWxELENBQXVELElBQXZELENBRkEsQ0FBQTtBQUFBLFVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLGNBQXRDLENBSEEsQ0FBQTtBQUFBLFVBSUEseUJBQUEsQ0FBMEIsV0FBMUIsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFQLENBQWlELENBQUMsSUFBbEQsQ0FBdUQsS0FBdkQsQ0FMQSxDQUFBO0FBQUEsVUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsY0FBdEMsQ0FOQSxDQUFBO0FBQUEsVUFPQSx5QkFBQSxDQUEwQixhQUExQixDQVBBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQVAsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxJQUF2RCxDQVJBLENBQUE7QUFBQSxVQVNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixhQUF2QixFQUFzQyxjQUF0QyxDQVRBLENBQUE7QUFBQSxVQVVBLHlCQUFBLENBQTBCLGVBQTFCLENBVkEsQ0FBQTtpQkFXQSxNQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFQLENBQWlELENBQUMsSUFBbEQsQ0FBdUQsS0FBdkQsRUFac0I7UUFBQSxDQUF4QixFQWJzQjtNQUFBLENBQXhCLEVBZmU7SUFBQSxDQUFqQixDQW5zQkEsQ0FBQTtXQTZ1QkEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLE1BQUEsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxRQUFBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEdBQXRCLEVBQTJCLEdBQTNCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxPQUFWLENBREEsQ0FBQTtBQUFBLFFBRUEsT0FBQSxDQUFRLEdBQVIsQ0FGQSxDQUFBO0FBQUEsUUFHQSx5QkFBQSxDQUEwQixHQUExQixDQUhBLENBQUE7ZUFJQSxNQUFBLENBQU8sRUFBRSxDQUFDLEtBQVYsQ0FBZ0IsQ0FBQyxnQkFBakIsQ0FBQSxFQUxpRDtNQUFBLENBQW5ELENBQUEsQ0FBQTthQU9BLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBLEdBQUE7QUFDOUMsWUFBQSxnQkFBQTtBQUFBLFFBQUEsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBdEIsRUFBMkIsT0FBM0IsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sRUFBTixFQUFVLEdBQVYsQ0FBYyxDQUFDLGNBQWYsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsT0FBVixDQUZBLENBQUE7QUFBQSxRQUdBLE9BQUEsQ0FBUSxHQUFSLENBSEEsQ0FBQTtBQUFBLFFBSUEseUJBQUEsQ0FBMEIsR0FBMUIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxLQUFBLEdBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FMM0IsQ0FBQTtBQUFBLFFBTUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUssQ0FBQSxDQUFBLENBTm5DLENBQUE7ZUFPQSxNQUFBLENBQU8sS0FBUCxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFuQixFQVI4QztNQUFBLENBQWhELEVBUmtCO0lBQUEsQ0FBcEIsRUE5dUJ1QjtFQUFBLENBQXpCLENBVEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/spec/ex-commands-spec.coffee
