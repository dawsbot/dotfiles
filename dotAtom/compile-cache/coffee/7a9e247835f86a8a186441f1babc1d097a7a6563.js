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
    var dir, dir2, editor, editorElement, exState, keydown, normalModeInputKeydown, openEx, projectPath, submitNormalModeInputText, vimState, _ref;
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
          atom.commands.dispatch(element.getModel().normalModeInputView.editorElement, "core:cancel");
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
    openEx = function() {
      return atom.commands.dispatch(editorElement, "ex-mode:open");
    };
    describe("as a motion", function() {
      beforeEach(function() {
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("moves the cursor to a specific line", function() {
        openEx();
        submitNormalModeInputText('2');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
      });
      it("moves to the second address", function() {
        openEx();
        submitNormalModeInputText('1,3');
        return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
      });
      it("works with offsets", function() {
        openEx();
        submitNormalModeInputText('2+1');
        expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        openEx();
        submitNormalModeInputText('-2');
        return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
      });
      it("doesn't move when the address is the current line", function() {
        openEx();
        submitNormalModeInputText('.');
        expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        openEx();
        submitNormalModeInputText(',');
        return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
      });
      it("moves to the last line", function() {
        openEx();
        submitNormalModeInputText('$');
        return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
      });
      it("moves to a mark's line", function() {
        keydown('l');
        keydown('m');
        normalModeInputKeydown('a');
        keydown('j');
        openEx();
        submitNormalModeInputText("'a");
        return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
      });
      return it("moves to a specified search", function() {
        openEx();
        submitNormalModeInputText('/def');
        expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
        editor.setCursorBufferPosition([2, 0]);
        openEx();
        submitNormalModeInputText('?def');
        expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
        editor.setCursorBufferPosition([3, 0]);
        openEx();
        submitNormalModeInputText('/ef');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
      });
    });
    describe(":write", function() {
      describe("when editing a new file", function() {
        beforeEach(function() {
          return editor.getBuffer().setText('abc\ndef');
        });
        it("opens the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync');
          openEx();
          submitNormalModeInputText('write');
          return expect(atom.showSaveDialogSync).toHaveBeenCalled();
        });
        it("saves when a path is specified in the save dialog", function() {
          var filePath;
          filePath = projectPath('write-from-save-dialog');
          spyOn(atom, 'showSaveDialogSync').andReturn(filePath);
          openEx();
          submitNormalModeInputText('write');
          expect(fs.existsSync(filePath)).toBe(true);
          expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc\ndef');
          return expect(editor.isModified()).toBe(false);
        });
        return it("saves when a path is specified in the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
          spyOn(fs, 'writeFileSync');
          openEx();
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
          openEx();
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
            return openEx();
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
          openEx();
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
            openEx();
            submitNormalModeInputText("write " + existsPath);
            expect(atom.notifications.notifications[0].message).toEqual('Command error: File exists (add ! to override)');
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc');
          });
          return it("writes if forced with :write!", function() {
            openEx();
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
        openEx();
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
          openEx();
          submitNormalModeInputText('saveas');
          return expect(atom.showSaveDialogSync).toHaveBeenCalled();
        });
        it("saves when a path is specified in the save dialog", function() {
          var filePath;
          filePath = projectPath('saveas-from-save-dialog');
          spyOn(atom, 'showSaveDialogSync').andReturn(filePath);
          openEx();
          submitNormalModeInputText('saveas');
          expect(fs.existsSync(filePath)).toBe(true);
          return expect(fs.readFileSync(filePath, 'utf-8')).toEqual('abc\ndef');
        });
        return it("saves when a path is specified in the save dialog", function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
          spyOn(fs, 'writeFileSync');
          openEx();
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
          openEx();
          submitNormalModeInputText('saveas');
          return expect(atom.notifications.notifications[0].message).toEqual('Command error: Argument required');
        });
        describe("with a specified path", function() {
          var newPath;
          newPath = '';
          beforeEach(function() {
            newPath = path.relative(dir, "" + filePath + ".new");
            editor.getBuffer().setText('abc');
            return openEx();
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
          openEx();
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
            openEx();
            submitNormalModeInputText("saveas " + existsPath);
            expect(atom.notifications.notifications[0].message).toEqual('Command error: File exists (add ! to override)');
            return expect(fs.readFileSync(existsPath, 'utf-8')).toEqual('abc');
          });
          return it("writes if forced with :saveas!", function() {
            openEx();
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
        openEx();
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
          openEx();
          submitNormalModeInputText('quit');
          return expect(pane.promptToSaveItem).toHaveBeenCalled();
        });
      });
    });
    describe(":quitall", function() {
      return it("closes Atom", function() {
        spyOn(atom, 'close');
        openEx();
        submitNormalModeInputText('quitall');
        return expect(atom.close).toHaveBeenCalled();
      });
    });
    describe(":tabclose", function() {
      return it("acts as an alias to :quit", function() {
        var _ref1;
        spyOn(Ex, 'tabclose').andCallThrough();
        spyOn(Ex, 'quit').andCallThrough();
        openEx();
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
        openEx();
        submitNormalModeInputText('tabnext');
        return expect(pane.getActiveItemIndex()).toBe(2);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(pane.getItems().length - 1);
        openEx();
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
        openEx();
        submitNormalModeInputText('tabprevious');
        return expect(pane.getActiveItemIndex()).toBe(0);
      });
      return it("wraps around", function() {
        pane.activateItemAtIndex(0);
        openEx();
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
        openEx();
        submitNormalModeInputText('wq');
        expect(Ex.write).toHaveBeenCalled();
        return waitsFor((function() {
          return Ex.quit.wasCalled;
        }), "the :quit command to be called", 100);
      });
      it("doesn't quit when the file is new and no path is specified in the save dialog", function() {
        var wasNotCalled;
        spyOn(atom, 'showSaveDialogSync').andReturn(void 0);
        openEx();
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
        openEx();
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
        openEx();
        submitNormalModeInputText('xit');
        return expect(Ex.wq).toHaveBeenCalled();
      });
    });
    describe(":wqall", function() {
      return it("calls :wall, then :quitall", function() {
        spyOn(Ex, 'wall');
        spyOn(Ex, 'quitall');
        openEx();
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
          openEx();
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
          openEx();
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
          openEx();
          submitNormalModeInputText('edit!');
          expect(atom.notifications.notifications.length).toBe(0);
          return waitsFor((function() {
            return editor.getText() === 'def';
          }), "the editor's content to change", 50);
        });
        return it("throws an error when editing a new file", function() {
          editor.getBuffer().reload();
          openEx();
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
          openEx();
          submitNormalModeInputText("edit " + filePath);
          return expect(atom.workspace.open).toHaveBeenCalledWith(filePath);
        });
        it("opens a relative path", function() {
          openEx();
          submitNormalModeInputText('edit edit-relative-test');
          return expect(atom.workspace.open).toHaveBeenCalledWith(projectPath('edit-relative-test'));
        });
        return it("throws an error if trying to open more than one file", function() {
          openEx();
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
        openEx();
        submitNormalModeInputText('tabedit tabedit-test');
        return (_ref1 = expect(Ex.edit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
      return it("acts as an alias to :tabnew if not supplied with a path", function() {
        var _ref1;
        spyOn(Ex, 'tabedit').andCallThrough();
        spyOn(Ex, 'tabnew');
        openEx();
        submitNormalModeInputText('tabedit  ');
        return (_ref1 = expect(Ex.tabnew)).toHaveBeenCalledWith.apply(_ref1, Ex.tabedit.calls[0].args);
      });
    });
    describe(":tabnew", function() {
      it("opens a new tab", function() {
        spyOn(atom.workspace, 'open');
        openEx();
        submitNormalModeInputText('tabnew');
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      return it("opens a new tab for editing when provided an argument", function() {
        var _ref1;
        spyOn(Ex, 'tabnew').andCallThrough();
        spyOn(Ex, 'tabedit');
        openEx();
        submitNormalModeInputText('tabnew tabnew-test');
        return (_ref1 = expect(Ex.tabedit)).toHaveBeenCalledWith.apply(_ref1, Ex.tabnew.calls[0].args);
      });
    });
    describe(":split", function() {
      return it("splits the current file upwards/downward", function() {
        var filePath, pane;
        pane = atom.workspace.getActivePane();
        if (atom.config.get('ex-mode.splitbelow')) {
          spyOn(pane, 'splitDown').andCallThrough();
          filePath = projectPath('split');
          editor.saveAs(filePath);
          openEx();
          submitNormalModeInputText('split');
          return expect(pane.splitDown).toHaveBeenCalled();
        } else {
          spyOn(pane, 'splitUp').andCallThrough();
          filePath = projectPath('split');
          editor.saveAs(filePath);
          openEx();
          submitNormalModeInputText('split');
          return expect(pane.splitUp).toHaveBeenCalled();
        }
      });
    });
    describe(":vsplit", function() {
      return it("splits the current file to the left/right", function() {
        var filePath, pane;
        if (atom.config.get('ex-mode.splitright')) {
          pane = atom.workspace.getActivePane();
          spyOn(pane, 'splitRight').andCallThrough();
          filePath = projectPath('vsplit');
          editor.saveAs(filePath);
          openEx();
          submitNormalModeInputText('vsplit');
          return expect(pane.splitLeft).toHaveBeenCalled();
        } else {
          pane = atom.workspace.getActivePane();
          spyOn(pane, 'splitLeft').andCallThrough();
          filePath = projectPath('vsplit');
          editor.saveAs(filePath);
          openEx();
          submitNormalModeInputText('vsplit');
          return expect(pane.splitLeft).toHaveBeenCalled();
        }
      });
    });
    describe(":delete", function() {
      beforeEach(function() {
        editor.setText('abc\ndef\nghi\njkl');
        return editor.setCursorBufferPosition([2, 0]);
      });
      it("deletes the current line", function() {
        openEx();
        submitNormalModeInputText('delete');
        return expect(editor.getText()).toEqual('abc\ndef\njkl');
      });
      it("copies the deleted text", function() {
        openEx();
        submitNormalModeInputText('delete');
        return expect(atom.clipboard.read()).toEqual('ghi\n');
      });
      it("deletes the lines in the given range", function() {
        var processedOpStack;
        processedOpStack = false;
        exState.onDidProcessOpStack(function() {
          return processedOpStack = true;
        });
        openEx();
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
        openEx();
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
        openEx();
        submitNormalModeInputText(':substitute /a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("doesn't need a space before the arguments", function() {
        openEx();
        submitNormalModeInputText(':substitute/a/x');
        return expect(editor.getText()).toEqual('xbcaABC\ndefdDEF\nabcaABC');
      });
      it("respects modifiers passed to it", function() {
        openEx();
        submitNormalModeInputText(':substitute/a/x/g');
        expect(editor.getText()).toEqual('xbcxABC\ndefdDEF\nabcaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':substitute/a/x/gi');
        return expect(editor.getText()).toEqual('xbcxxBC\ndefdDEF\nabcaABC');
      });
      it("replaces on multiple lines", function() {
        openEx();
        submitNormalModeInputText(':%substitute/abc/ghi');
        expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nghiaABC');
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText(':%substitute/abc/ghi/ig');
        return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nghiaghi');
      });
      describe(":yank", function() {
        beforeEach(function() {
          editor.setText('abc\ndef\nghi\njkl');
          return editor.setCursorBufferPosition([2, 0]);
        });
        it("yanks the current line", function() {
          openEx();
          submitNormalModeInputText('yank');
          return expect(atom.clipboard.read()).toEqual('ghi\n');
        });
        return it("yanks the lines in the given range", function() {
          openEx();
          submitNormalModeInputText('1,2yank');
          return expect(atom.clipboard.read()).toEqual('abc\ndef\n');
        });
      });
      describe("illegal delimiters", function() {
        var test;
        test = function(delim) {
          openEx();
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
          openEx();
          submitNormalModeInputText(":substitute/abc//");
          return expect(editor.getText()).toEqual('abc\nabcabc');
        });
        return it("removes the pattern with modifiers", function() {
          openEx();
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
          openEx();
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
            openEx();
            submitNormalModeInputText(':substitute/abc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nabcaABC');
          });
          it("uses case sensitive search if smartcase is off and the pattern is uppercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            openEx();
            submitNormalModeInputText(':substitute/ABC/ghi/g');
            return expect(editor.getText()).toEqual('abcaghi\ndefdDEF\nabcaABC');
          });
          it("uses case insensitive search if smartcase is on and the pattern is lowercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            openEx();
            submitNormalModeInputText(':substitute/abc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          return it("uses case sensitive search if smartcase is on and the pattern is uppercase", function() {
            editor.setText('abcaABC\ndefdDEF\nabcaABC');
            openEx();
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
            openEx();
            submitNormalModeInputText(':substitute/abc\\c/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("doesn't matter where in the pattern \\c is", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', false);
            openEx();
            submitNormalModeInputText(':substitute/a\\cbc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("uses case sensitive search if smartcase is on, \\C is in the pattern and the pattern is lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            openEx();
            submitNormalModeInputText(':substitute/a\\Cbc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaABC\ndefdDEF\nabcaABC');
          });
          it("overrides \\C with \\c if \\C comes first", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            openEx();
            submitNormalModeInputText(':substitute/a\\Cb\\cc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          it("overrides \\C with \\c if \\c comes first", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            openEx();
            submitNormalModeInputText(':substitute/a\\cb\\Cc/ghi/g');
            return expect(editor.getText()).toEqual('ghiaghi\ndefdDEF\nabcaABC');
          });
          return it("overrides an appended /i flag with \\C", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            openEx();
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
          openEx();
          submitNormalModeInputText(':substitute/bc(.{2})/X\\1X');
          return expect(editor.getText()).toEqual('aXaAXBC\ndefdDEF\nabcaABC');
        });
        it("replaces multiple groups", function() {
          openEx();
          submitNormalModeInputText(':substitute/a([a-z]*)aA([A-Z]*)/X\\1XY\\2Y');
          return expect(editor.getText()).toEqual('XbcXYBCY\ndefdDEF\nabcaABC');
        });
        return it("replaces \\0 with the entire match", function() {
          openEx();
          submitNormalModeInputText(':substitute/ab(ca)AB/X\\0X');
          return expect(editor.getText()).toEqual('XabcaABXC\ndefdDEF\nabcaABC');
        });
      });
    });
    describe(":set", function() {
      it("throws an error without a specified option", function() {
        openEx();
        submitNormalModeInputText(':set');
        return expect(atom.notifications.notifications[0].message).toEqual('Command error: No option specified');
      });
      it("sets multiple options at once", function() {
        atom.config.set('editor.showInvisibles', false);
        atom.config.set('editor.showLineNumbers', false);
        openEx();
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
          openEx();
          submitNormalModeInputText(':set list');
          expect(atom.config.get('editor.showInvisibles')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nolist');
          return expect(atom.config.get('editor.showInvisibles')).toBe(false);
        });
        it("sets (no)nu(mber)", function() {
          openEx();
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
        it("sets (no)sp(lit)r(ight)", function() {
          openEx();
          submitNormalModeInputText(':set spr');
          expect(atom.config.get('ex-mode.splitright')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nospr');
          expect(atom.config.get('ex-mode.splitright')).toBe(false);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set splitright');
          expect(atom.config.get('ex-mode.splitright')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nosplitright');
          return expect(atom.config.get('ex-mode.splitright')).toBe(false);
        });
        it("sets (no)s(plit)b(elow)", function() {
          openEx();
          submitNormalModeInputText(':set sb');
          expect(atom.config.get('ex-mode.splitbelow')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nosb');
          expect(atom.config.get('ex-mode.splitbelow')).toBe(false);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set splitbelow');
          expect(atom.config.get('ex-mode.splitbelow')).toBe(true);
          atom.commands.dispatch(editorElement, 'ex-mode:open');
          submitNormalModeInputText(':set nosplitbelow');
          return expect(atom.config.get('ex-mode.splitbelow')).toBe(false);
        });
        return it("sets (no)s(mart)c(a)s(e)", function() {
          openEx();
          submitNormalModeInputText(':set scs');
          expect(atom.config.get('vim-mode.useSmartcaseForSearch')).toBe(true);
          openEx();
          submitNormalModeInputText(':set noscs');
          expect(atom.config.get('vim-mode.useSmartcaseForSearch')).toBe(false);
          openEx();
          submitNormalModeInputText(':set smartcase');
          expect(atom.config.get('vim-mode.useSmartcaseForSearch')).toBe(true);
          openEx();
          submitNormalModeInputText(':set nosmartcase');
          return expect(atom.config.get('vim-mode.useSmartcaseForSearch')).toBe(false);
        });
      });
    });
    describe("aliases", function() {
      it("calls the aliased function without arguments", function() {
        ExClass.registerAlias('W', 'w');
        spyOn(Ex, 'write');
        openEx();
        submitNormalModeInputText('W');
        return expect(Ex.write).toHaveBeenCalled();
      });
      return it("calls the aliased function with arguments", function() {
        var WArgs, writeArgs;
        ExClass.registerAlias('W', 'write');
        spyOn(Ex, 'W').andCallThrough();
        spyOn(Ex, 'write');
        openEx();
        submitNormalModeInputText('W');
        WArgs = Ex.W.calls[0].args[0];
        writeArgs = Ex.write.calls[0].args[0];
        return expect(WArgs).toBe(writeArgs);
      });
    });
    return describe("with selections", function() {
      it("executes on the selected range", function() {
        spyOn(Ex, 's');
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToBufferPosition([2, 1]);
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText("'<,'>s/abc/def");
        return expect(Ex.s.calls[0].args[0].range).toEqual([0, 2]);
      });
      return it("calls the functions multiple times if there are multiple selections", function() {
        var calls;
        spyOn(Ex, 's');
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToBufferPosition([2, 1]);
        editor.addCursorAtBufferPosition([3, 0]);
        editor.selectToBufferPosition([3, 2]);
        atom.commands.dispatch(editorElement, 'ex-mode:open');
        submitNormalModeInputText("'<,'>s/abc/def");
        calls = Ex.s.calls;
        expect(calls.length).toEqual(2);
        expect(calls[0].args[0].range).toEqual([0, 2]);
        return expect(calls[1].args[0].range).toEqual([3, 3]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvc3BlYy9leC1jb21tYW5kcy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsV0FBUixDQUhQLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FKVixDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBTlYsQ0FBQTs7QUFBQSxFQU9BLEVBQUEsR0FBSyxPQUFPLENBQUMsU0FBUixDQUFBLENBUEwsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLDBJQUFBO0FBQUEsSUFBQSxPQUF3RCxFQUF4RCxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0Isa0JBQXhCLEVBQWtDLGlCQUFsQyxFQUEyQyxhQUEzQyxFQUFnRCxjQUFoRCxDQUFBO0FBQUEsSUFDQSxXQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsRUFBZSxRQUFmLEVBQWQ7SUFBQSxDQURkLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGVBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBVixDQUFBO0FBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/spec/ex-commands-spec.coffee
