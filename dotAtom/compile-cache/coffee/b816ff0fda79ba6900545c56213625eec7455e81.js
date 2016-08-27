(function() {
  var CommandError, Ex, VimOption, fs, getFullPath, getSearchTerm, path, replaceGroups, saveAs, trySave, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  path = require('path');

  CommandError = require('./command-error');

  fs = require('fs-plus');

  VimOption = require('./vim-option');

  _ = require('underscore-plus');

  trySave = function(func) {
    var deferred, error, errorMatch, fileName, _ref;
    deferred = Promise.defer();
    try {
      func();
      deferred.resolve();
    } catch (_error) {
      error = _error;
      if (error.message.endsWith('is a directory')) {
        atom.notifications.addWarning("Unable to save file: " + error.message);
      } else if (error.path != null) {
        if (error.code === 'EACCES') {
          atom.notifications.addWarning("Unable to save file: Permission denied '" + error.path + "'");
        } else if ((_ref = error.code) === 'EPERM' || _ref === 'EBUSY' || _ref === 'UNKNOWN' || _ref === 'EEXIST') {
          atom.notifications.addWarning("Unable to save file '" + error.path + "'", {
            detail: error.message
          });
        } else if (error.code === 'EROFS') {
          atom.notifications.addWarning("Unable to save file: Read-only file system '" + error.path + "'");
        }
      } else if ((errorMatch = /ENOTDIR, not a directory '([^']+)'/.exec(error.message))) {
        fileName = errorMatch[1];
        atom.notifications.addWarning("Unable to save file: A directory in the " + ("path '" + fileName + "' could not be written to"));
      } else {
        throw error;
      }
    }
    return deferred.promise;
  };

  saveAs = function(filePath, editor) {
    return fs.writeFileSync(filePath, editor.getText());
  };

  getFullPath = function(filePath) {
    filePath = fs.normalize(filePath);
    if (path.isAbsolute(filePath)) {
      return filePath;
    } else if (atom.project.getPaths().length === 0) {
      return path.join(fs.normalize('~'), filePath);
    } else {
      return path.join(atom.project.getPaths()[0], filePath);
    }
  };

  replaceGroups = function(groups, string) {
    var char, escaped, group, replaced;
    replaced = '';
    escaped = false;
    while ((char = string[0]) != null) {
      string = string.slice(1);
      if (char === '\\' && !escaped) {
        escaped = true;
      } else if (/\d/.test(char) && escaped) {
        escaped = false;
        group = groups[parseInt(char)];
        if (group == null) {
          group = '';
        }
        replaced += group;
      } else {
        escaped = false;
        replaced += char;
      }
    }
    return replaced;
  };

  getSearchTerm = function(term, modifiers) {
    var char, escaped, hasC, hasc, modFlags, term_, _i, _len;
    if (modifiers == null) {
      modifiers = {
        'g': true
      };
    }
    escaped = false;
    hasc = false;
    hasC = false;
    term_ = term;
    term = '';
    for (_i = 0, _len = term_.length; _i < _len; _i++) {
      char = term_[_i];
      if (char === '\\' && !escaped) {
        escaped = true;
        term += char;
      } else {
        if (char === 'c' && escaped) {
          hasc = true;
          term = term.slice(0, -1);
        } else if (char === 'C' && escaped) {
          hasC = true;
          term = term.slice(0, -1);
        } else if (char !== '\\') {
          term += char;
        }
        escaped = false;
      }
    }
    if (hasC) {
      modifiers['i'] = false;
    }
    if ((!hasC && !term.match('[A-Z]') && atom.config.get('vim-mode.useSmartcaseForSearch')) || hasc) {
      modifiers['i'] = true;
    }
    modFlags = Object.keys(modifiers).filter(function(key) {
      return modifiers[key];
    }).join('');
    try {
      return new RegExp(term, modFlags);
    } catch (_error) {
      return new RegExp(_.escapeRegExp(term), modFlags);
    }
  };

  Ex = (function() {
    function Ex() {
      this.vsp = __bind(this.vsp, this);
      this.s = __bind(this.s, this);
      this.sp = __bind(this.sp, this);
      this.xit = __bind(this.xit, this);
      this.saveas = __bind(this.saveas, this);
      this.xa = __bind(this.xa, this);
      this.xall = __bind(this.xall, this);
      this.wqa = __bind(this.wqa, this);
      this.wqall = __bind(this.wqall, this);
      this.wa = __bind(this.wa, this);
      this.wq = __bind(this.wq, this);
      this.w = __bind(this.w, this);
      this.e = __bind(this.e, this);
      this.tabp = __bind(this.tabp, this);
      this.tabn = __bind(this.tabn, this);
      this.tabc = __bind(this.tabc, this);
      this.tabclose = __bind(this.tabclose, this);
      this.tabnew = __bind(this.tabnew, this);
      this.tabe = __bind(this.tabe, this);
      this.tabedit = __bind(this.tabedit, this);
      this.qall = __bind(this.qall, this);
      this.q = __bind(this.q, this);
    }

    Ex.singleton = function() {
      return Ex.ex || (Ex.ex = new Ex);
    };

    Ex.registerCommand = function(name, func) {
      return Ex.singleton()[name] = func;
    };

    Ex.registerAlias = function(alias, name) {
      return Ex.singleton()[alias] = function(args) {
        return Ex.singleton()[name](args);
      };
    };

    Ex.prototype.quit = function() {
      return atom.workspace.getActivePane().destroyActiveItem();
    };

    Ex.prototype.quitall = function() {
      return atom.close();
    };

    Ex.prototype.q = function() {
      return this.quit();
    };

    Ex.prototype.qall = function() {
      return this.quitall();
    };

    Ex.prototype.tabedit = function(args) {
      if (args.args.trim() !== '') {
        return this.edit(args);
      } else {
        return this.tabnew(args);
      }
    };

    Ex.prototype.tabe = function(args) {
      return this.tabedit(args);
    };

    Ex.prototype.tabnew = function(_arg) {
      var args, range;
      range = _arg.range, args = _arg.args;
      if (args.trim() === '') {
        return atom.workspace.open();
      } else {
        return this.tabedit(range, args);
      }
    };

    Ex.prototype.tabclose = function(args) {
      return this.quit(args);
    };

    Ex.prototype.tabc = function() {
      return this.tabclose();
    };

    Ex.prototype.tabnext = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activateNextItem();
    };

    Ex.prototype.tabn = function() {
      return this.tabnext();
    };

    Ex.prototype.tabprevious = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activatePreviousItem();
    };

    Ex.prototype.tabp = function() {
      return this.tabprevious();
    };

    Ex.prototype.edit = function(_arg) {
      var args, editor, filePath, force, fullPath, range;
      range = _arg.range, args = _arg.args, editor = _arg.editor;
      filePath = args.trim();
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1).trim();
      } else {
        force = false;
      }
      if (editor.isModified() && !force) {
        throw new CommandError('No write since last change (add ! to override)');
      }
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
        if (fullPath === editor.getPath()) {
          return editor.getBuffer().reload();
        } else {
          return atom.workspace.open(fullPath);
        }
      } else {
        if (editor.getPath() != null) {
          return editor.getBuffer().reload();
        } else {
          throw new CommandError('No file name');
        }
      }
    };

    Ex.prototype.e = function(args) {
      return this.edit(args);
    };

    Ex.prototype.enew = function() {
      var buffer;
      buffer = atom.workspace.getActiveTextEditor().buffer;
      buffer.setPath(void 0);
      return buffer.load();
    };

    Ex.prototype.write = function(_arg) {
      var args, deferred, editor, filePath, force, fullPath, range, saveas, saved;
      range = _arg.range, args = _arg.args, editor = _arg.editor, saveas = _arg.saveas;
      if (saveas == null) {
        saveas = false;
      }
      filePath = args;
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1);
      } else {
        force = false;
      }
      filePath = filePath.trim();
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      deferred = Promise.defer();
      editor = atom.workspace.getActiveTextEditor();
      saved = false;
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
      }
      if ((editor.getPath() != null) && ((fullPath == null) || editor.getPath() === fullPath)) {
        if (saveas) {
          throw new CommandError("Argument required");
        } else {
          trySave(function() {
            return editor.save();
          }).then(deferred.resolve);
          saved = true;
        }
      } else if (fullPath == null) {
        fullPath = atom.showSaveDialogSync();
      }
      if (!saved && (fullPath != null)) {
        if (!force && fs.existsSync(fullPath)) {
          throw new CommandError("File exists (add ! to override)");
        }
        if (saveas) {
          editor = atom.workspace.getActiveTextEditor();
          trySave(function() {
            return editor.saveAs(fullPath, editor);
          }).then(deferred.resolve);
        } else {
          trySave(function() {
            return saveAs(fullPath, editor);
          }).then(deferred.resolve);
        }
      }
      return deferred.promise;
    };

    Ex.prototype.wall = function() {
      return atom.workspace.saveAll();
    };

    Ex.prototype.w = function(args) {
      return this.write(args);
    };

    Ex.prototype.wq = function(args) {
      return this.write(args).then((function(_this) {
        return function() {
          return _this.quit();
        };
      })(this));
    };

    Ex.prototype.wa = function() {
      return this.wall();
    };

    Ex.prototype.wqall = function() {
      this.wall();
      return this.quitall();
    };

    Ex.prototype.wqa = function() {
      return this.wqall();
    };

    Ex.prototype.xall = function() {
      return this.wqall();
    };

    Ex.prototype.xa = function() {
      return this.wqall();
    };

    Ex.prototype.saveas = function(args) {
      args.saveas = true;
      return this.write(args);
    };

    Ex.prototype.xit = function(args) {
      return this.wq(args);
    };

    Ex.prototype.split = function(_arg) {
      var args, file, filePaths, newPane, pane, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitUp();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitUp({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.sp = function(args) {
      return this.split(args);
    };

    Ex.prototype.substitute = function(_arg) {
      var args, args_, char, delim, e, editor, escapeChars, escaped, flags, flagsObj, parsed, parsing, pattern, patternRE, range, substition, vimState;
      range = _arg.range, args = _arg.args, editor = _arg.editor, vimState = _arg.vimState;
      args_ = args.trimLeft();
      delim = args_[0];
      if (/[a-z1-9\\"|]/i.test(delim)) {
        throw new CommandError("Regular expressions can't be delimited by alphanumeric characters, '\\', '\"' or '|'");
      }
      args_ = args_.slice(1);
      escapeChars = {
        t: '\t',
        n: '\n',
        r: '\r'
      };
      parsed = ['', '', ''];
      parsing = 0;
      escaped = false;
      while ((char = args_[0]) != null) {
        args_ = args_.slice(1);
        if (char === delim) {
          if (!escaped) {
            parsing++;
            if (parsing > 2) {
              throw new CommandError('Trailing characters');
            }
          } else {
            parsed[parsing] = parsed[parsing].slice(0, -1);
          }
        } else if (char === '\\' && !escaped) {
          parsed[parsing] += char;
          escaped = true;
        } else if (parsing === 1 && escaped && (escapeChars[char] != null)) {
          parsed[parsing] += escapeChars[char];
          escaped = false;
        } else {
          escaped = false;
          parsed[parsing] += char;
        }
      }
      pattern = parsed[0], substition = parsed[1], flags = parsed[2];
      if (pattern === '') {
        pattern = vimState.getSearchHistoryItem();
        if (pattern == null) {
          atom.beep();
          throw new CommandError('No previous regular expression');
        }
      } else {
        vimState.pushSearchHistory(pattern);
      }
      try {
        flagsObj = {};
        flags.split('').forEach(function(flag) {
          return flagsObj[flag] = true;
        });
        patternRE = getSearchTerm(pattern, flagsObj);
      } catch (_error) {
        e = _error;
        if (e.message.indexOf('Invalid flags supplied to RegExp constructor') === 0) {
          throw new CommandError("Invalid flags: " + e.message.slice(45));
        } else if (e.message.indexOf('Invalid regular expression: ') === 0) {
          throw new CommandError("Invalid RegEx: " + e.message.slice(27));
        } else {
          throw e;
        }
      }
      return editor.transact(function() {
        var line, _i, _ref, _ref1, _results;
        _results = [];
        for (line = _i = _ref = range[0], _ref1 = range[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; line = _ref <= _ref1 ? ++_i : --_i) {
          _results.push(editor.scanInBufferRange(patternRE, [[line, 0], [line + 1, 0]], function(_arg1) {
            var match, replace;
            match = _arg1.match, replace = _arg1.replace;
            return replace(replaceGroups(match.slice(0), substition));
          }));
        }
        return _results;
      });
    };

    Ex.prototype.s = function(args) {
      return this.substitute(args);
    };

    Ex.prototype.vsplit = function(_arg) {
      var args, file, filePaths, newPane, pane, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitLeft();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitLeft({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.vsp = function(args) {
      return this.vsplit(args);
    };

    Ex.prototype["delete"] = function(_arg) {
      var range;
      range = _arg.range;
      range = [[range[0], 0], [range[1] + 1, 0]];
      return atom.workspace.getActiveTextEditor().buffer.setTextInRange(range, '');
    };

    Ex.prototype.set = function(_arg) {
      var args, option, options, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      if (args === "") {
        throw new CommandError("No option specified");
      }
      options = args.split(' ');
      _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _results.push((function() {
          var nameValPair, optionName, optionProcessor, optionValue;
          if (option.includes("=")) {
            nameValPair = option.split("=");
            if (nameValPair.length !== 2) {
              throw new CommandError("Wrong option format. [name]=[value] format is expected");
            }
            optionName = nameValPair[0];
            optionValue = nameValPair[1];
            optionProcessor = VimOption.singleton()[optionName];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + optionName);
            }
            return optionProcessor(optionValue);
          } else {
            optionProcessor = VimOption.singleton()[option];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + option);
            }
            return optionProcessor();
          }
        })());
      }
      return _results;
    };

    return Ex;

  })();

  module.exports = Ex;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvR0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxTQUFDLElBQUQsR0FBQTtBQUNSLFFBQUEsMkNBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFPLENBQUMsS0FBUixDQUFBLENBQVgsQ0FBQTtBQUVBO0FBQ0UsTUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsT0FBVCxDQUFBLENBREEsQ0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLGNBQ0osQ0FBQTtBQUFBLE1BQUEsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLENBQUg7QUFDRSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBK0IsdUJBQUEsR0FBdUIsS0FBSyxDQUFDLE9BQTVELENBQUEsQ0FERjtPQUFBLE1BRUssSUFBRyxrQkFBSDtBQUNILFFBQUEsSUFBRyxLQUFLLENBQUMsSUFBTixLQUFjLFFBQWpCO0FBQ0UsVUFBQSxJQUFJLENBQUMsYUFDSCxDQUFDLFVBREgsQ0FDZSwwQ0FBQSxHQUEwQyxLQUFLLENBQUMs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex.coffee
