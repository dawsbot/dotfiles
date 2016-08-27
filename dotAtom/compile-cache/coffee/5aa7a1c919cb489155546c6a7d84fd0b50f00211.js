(function() {
  var CommandError, Ex, VimOption, defer, fs, getFullPath, getSearchTerm, path, replaceGroups, saveAs, trySave, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  path = require('path');

  CommandError = require('./command-error');

  fs = require('fs-plus');

  VimOption = require('./vim-option');

  _ = require('underscore-plus');

  defer = function() {
    var deferred;
    deferred = {};
    deferred.promise = new Promise(function(resolve, reject) {
      deferred.resolve = resolve;
      return deferred.reject = reject;
    });
    return deferred;
  };

  trySave = function(func) {
    var deferred, error, errorMatch, fileName, _ref;
    deferred = defer();
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

    Ex.getCommands = function() {
      return Object.keys(Ex.singleton()).concat(Object.keys(Ex.prototype)).filter(function(cmd, index, list) {
        return list.indexOf(cmd) === index;
      });
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

    Ex.prototype.tabnew = function(args) {
      if (args.args.trim() === '') {
        return atom.workspace.open();
      } else {
        return this.tabedit(args);
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
      deferred = defer();
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
        if (saveas || editor.getFileName() === null) {
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
      var args, file, filePaths, newPane, pane, range, _i, _j, _len, _len1, _results, _results1;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if (atom.config.get('ex-mode.splitbelow')) {
        if ((filePaths != null) && filePaths.length > 0) {
          newPane = pane.splitDown();
          _results = [];
          for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
            file = filePaths[_i];
            _results.push((function() {
              return atom.workspace.openURIInPane(file, newPane);
            })());
          }
          return _results;
        } else {
          return pane.splitDown({
            copyActiveItem: true
          });
        }
      } else {
        if ((filePaths != null) && filePaths.length > 0) {
          newPane = pane.splitUp();
          _results1 = [];
          for (_j = 0, _len1 = filePaths.length; _j < _len1; _j++) {
            file = filePaths[_j];
            _results1.push((function() {
              return atom.workspace.openURIInPane(file, newPane);
            })());
          }
          return _results1;
        } else {
          return pane.splitUp({
            copyActiveItem: true
          });
        }
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
      var args, file, filePaths, newPane, pane, range, _i, _j, _len, _len1, _results, _results1;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if (atom.config.get('ex-mode.splitright')) {
        if ((filePaths != null) && filePaths.length > 0) {
          newPane = pane.splitRight();
          _results = [];
          for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
            file = filePaths[_i];
            _results.push((function() {
              return atom.workspace.openURIInPane(file, newPane);
            })());
          }
          return _results;
        } else {
          return pane.splitRight({
            copyActiveItem: true
          });
        }
      } else {
        if ((filePaths != null) && filePaths.length > 0) {
          newPane = pane.splitLeft();
          _results1 = [];
          for (_j = 0, _len1 = filePaths.length; _j < _len1; _j++) {
            file = filePaths[_j];
            _results1.push((function() {
              return atom.workspace.openURIInPane(file, newPane);
            })());
          }
          return _results1;
        } else {
          return pane.splitLeft({
            copyActiveItem: true
          });
        }
      }
    };

    Ex.prototype.vsp = function(args) {
      return this.vsplit(args);
    };

    Ex.prototype["delete"] = function(_arg) {
      var editor, range, text;
      range = _arg.range;
      range = [[range[0], 0], [range[1] + 1, 0]];
      editor = atom.workspace.getActiveTextEditor();
      text = editor.getTextInBufferRange(range);
      atom.clipboard.write(text);
      return editor.buffer.setTextInRange(range, '');
    };

    Ex.prototype.yank = function(_arg) {
      var range, txt;
      range = _arg.range;
      range = [[range[0], 0], [range[1] + 1, 0]];
      txt = atom.workspace.getActiveTextEditor().getTextInBufferRange(range);
      return atom.clipboard.write(txt);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyR0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxJQUNBLFFBQVEsQ0FBQyxPQUFULEdBQXVCLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUM3QixNQUFBLFFBQVEsQ0FBQyxPQUFULEdBQW1CLE9BQW5CLENBQUE7YUFDQSxRQUFRLENBQUMsTUFBVCxHQUFrQixPQUZXO0lBQUEsQ0FBUixDQUR2QixDQUFBO0FBS0EsV0FBTyxRQUFQLENBTk07RUFBQSxDQU5SLENBQUE7O0FBQUEsRUFlQSxPQUFBLEdBQVUsU0FBQyxJQUFELEdBQUE7QUFDUixRQUFBLDJDQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsS0FBQSxDQUFBLENBQVgsQ0FBQTtBQUVBO0FBQ0UsTUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsT0FBVCxDQUFBLENBREEsQ0FERjtLQUFBLGNBQUE7QUFJRSxNQURJLGNBQ0os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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex.coffee
