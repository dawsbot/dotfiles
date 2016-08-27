(function() {
  var CommandOutputView, TextEditorView, View, addClass, ansihtml, exec, fs, lastOpenedView, readline, removeClass, resolve, spawn, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  View = require('atom-space-pen-views').View;

  _ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec;

  ansihtml = require('ansi-html-stream');

  readline = require('readline');

  _ref1 = require('domutil'), addClass = _ref1.addClass, removeClass = _ref1.removeClass;

  resolve = require('path').resolve;

  fs = require('fs');

  lastOpenedView = null;

  module.exports = CommandOutputView = (function(_super) {
    __extends(CommandOutputView, _super);

    function CommandOutputView() {
      this.flashIconClass = __bind(this.flashIconClass, this);
      return CommandOutputView.__super__.constructor.apply(this, arguments);
    }

    CommandOutputView.prototype.cwd = null;

    CommandOutputView.content = function() {
      return this.div({
        tabIndex: -1,
        "class": 'panel cli-status panel-bottom'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'killBtn',
                click: 'kill',
                "class": 'btn hide'
              }, function() {
                return _this.span('kill');
              });
              _this.button({
                click: 'destroy',
                "class": 'btn'
              }, function() {
                return _this.span('destroy');
              });
              return _this.button({
                click: 'close',
                "class": 'btn'
              }, function() {
                _this.span({
                  "class": "icon icon-x"
                });
                return _this.span('close');
              });
            });
          });
          return _this.div({
            "class": 'cli-panel-body'
          }, function() {
            _this.pre({
              "class": "terminal",
              outlet: "cliOutput"
            }, "Welcome to terminal status. http://github.com/guileen/terminal-status");
            return _this.subview('cmdEditor', new TextEditorView({
              mini: true,
              placeholderText: 'input your command here'
            }));
          });
        };
      })(this));
    };

    CommandOutputView.prototype.initialize = function() {
      var assigned, cmd, command, _fn, _i, _len;
      this.userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      assigned = false;
      cmd = [['test -e /etc/profile && source /etc/profile', 'test -e ~/.profile && source ~/.profile', ['node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'].join("||")].join(";"), 'node -pe "JSON.stringify(process.env)"', 'nodejs -pe "JSON.stringify(process.env)"', 'iojs -pe "JSON.stringify(process.env)"'];
      _fn = function(command) {
        if (!assigned) {
          return exec(command, function(code, stdout, stderr) {
            if (!assigned && !stderr) {
              try {
                process.env = JSON.parse(stdout);
                return assigned = true;
              } catch (_error) {
                return console.log("" + command + " couldn't be loaded");
              }
            }
          });
        }
      };
      for (_i = 0, _len = cmd.length; _i < _len; _i++) {
        command = cmd[_i];
        _fn(command);
      }
      atom.commands.add('atom-workspace', "cli-status:toggle-output", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      return atom.commands.add('atom-workspace', "core:confirm", (function(_this) {
        return function() {
          return _this.readLine();
        };
      })(this));
    };

    CommandOutputView.prototype.readLine = function() {
      var args, cmd, inputCmd;
      inputCmd = this.cmdEditor.getModel().getText();
      this.cliOutput.append("\n$>" + inputCmd + "\n");
      this.scrollToBottom();
      args = [];
      inputCmd.replace(/("[^"]*"|'[^']*'|[^\s'"]+)/g, (function(_this) {
        return function(s) {
          if (s[0] !== '"' && s[0] !== "'") {
            s = s.replace(/~/g, _this.userHome);
          }
          return args.push(s);
        };
      })(this));
      cmd = args.shift();
      if (cmd === 'cd') {
        return this.cd(args);
      }
      if (cmd === 'ls') {
        return this.ls(args);
      }
      return this.spawn(inputCmd, cmd, args);
    };

    CommandOutputView.prototype.adjustWindowHeight = function() {
      var maxHeight;
      maxHeight = atom.config.get('terminal-status.WindowHeight');
      return this.cliOutput.css("max-height", "" + maxHeight + "px");
    };

    CommandOutputView.prototype.showCmd = function() {
      this.cmdEditor.show();
      this.cmdEditor.getModel().selectAll();
      this.cmdEditor.focus();
      return this.scrollToBottom();
    };

    CommandOutputView.prototype.scrollToBottom = function() {
      return this.cliOutput.scrollTop(10000000);
    };

    CommandOutputView.prototype.flashIconClass = function(className, time) {
      var onStatusOut;
      if (time == null) {
        time = 100;
      }
      console.log('addClass', className);
      addClass(this.statusIcon, className);
      this.timer && clearTimeout(this.timer);
      onStatusOut = (function(_this) {
        return function() {
          return removeClass(_this.statusIcon, className);
        };
      })(this);
      return this.timer = setTimeout(onStatusOut, time);
    };

    CommandOutputView.prototype.destroy = function() {
      var _destroy;
      _destroy = (function(_this) {
        return function() {
          if (_this.hasParent()) {
            _this.close();
          }
          if (_this.statusIcon && _this.statusIcon.parentNode) {
            _this.statusIcon.parentNode.removeChild(_this.statusIcon);
          }
          return _this.statusView.removeCommandView(_this);
        };
      })(this);
      if (this.program) {
        this.program.once('exit', _destroy);
        return this.program.kill();
      } else {
        return _destroy();
      }
    };

    CommandOutputView.prototype.kill = function() {
      if (this.program) {
        return this.program.kill();
      }
    };

    CommandOutputView.prototype.open = function() {
      this.lastLocation = atom.workspace.getActivePane();
      if (!this.hasParent()) {
        atom.workspace.addBottomPanel({
          item: this
        });
      }
      if (lastOpenedView && lastOpenedView !== this) {
        lastOpenedView.close();
      }
      lastOpenedView = this;
      this.scrollToBottom();
      this.statusView.setActiveCommandView(this);
      return this.cmdEditor.focus();
    };

    CommandOutputView.prototype.close = function() {
      this.lastLocation.activate();
      this.detach();
      return lastOpenedView = null;
    };

    CommandOutputView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    CommandOutputView.prototype.cd = function(args) {
      var dir;
      if (!args[0]) {
        args = [this.getCwd()];
      }
      dir = resolve(this.getCwd(), args[0]);
      return fs.stat(dir, (function(_this) {
        return function(err, stat) {
          if (err) {
            if (err.code === 'ENOENT') {
              return _this.errorMessage("cd: " + args[0] + ": No such file or directory");
            }
            return _this.errorMessage(err.message);
          }
          if (!stat.isDirectory()) {
            return _this.errorMessage("cd: not a directory: " + args[0]);
          }
          _this.cwd = dir;
          return _this.message("cwd: " + _this.cwd);
        };
      })(this));
    };

    CommandOutputView.prototype.ls = function(args) {
      var files, filesBlocks;
      files = fs.readdirSync(this.getCwd());
      filesBlocks = [];
      files.forEach((function(_this) {
        return function(filename) {
          try {
            return filesBlocks.push(_this._fileInfoHtml(filename, _this.getCwd()));
          } catch (_error) {
            return console.log("" + filename + " couln't be read");
          }
        };
      })(this));
      filesBlocks = filesBlocks.sort(function(a, b) {
        var aDir, bDir;
        aDir = a[1].isDirectory();
        bDir = b[1].isDirectory();
        if (aDir && !bDir) {
          return -1;
        }
        if (!aDir && bDir) {
          return 1;
        }
        return a[2] > b[2] && 1 || -1;
      });
      filesBlocks = filesBlocks.map(function(b) {
        return b[0];
      });
      return this.message(filesBlocks.join('') + '<div class="clear"/>');
    };

    CommandOutputView.prototype._fileInfoHtml = function(filename, parent) {
      var classes, filepath, stat;
      classes = ['icon', 'file-info'];
      filepath = parent + '/' + filename;
      stat = fs.lstatSync(filepath);
      if (stat.isSymbolicLink()) {
        classes.push('stat-link');
        stat = fs.statSync(filepath);
      }
      if (stat.isFile()) {
        if (stat.mode & 73) {
          classes.push('stat-program');
        }
        classes.push('icon-file-text');
      }
      if (stat.isDirectory()) {
        classes.push('icon-file-directory');
      }
      if (stat.isCharacterDevice()) {
        classes.push('stat-char-dev');
      }
      if (stat.isFIFO()) {
        classes.push('stat-fifo');
      }
      if (stat.isSocket()) {
        classes.push('stat-sock');
      }
      if (filename[0] === '.') {
        classes.push('status-ignored');
      }
      return ["<span class=\"" + (classes.join(' ')) + "\">" + filename + "</span>", stat, filename];
    };

    CommandOutputView.prototype.getGitStatusName = function(path, gitRoot, repo) {
      var status;
      status = (repo.getCachedPathStatus || repo.getPathStatus)(path);
      console.log('path status', path, status);
      if (status) {
        if (repo.isStatusModified(status)) {
          return 'modified';
        }
        if (repo.isStatusNew(status)) {
          return 'added';
        }
      }
      if (repo.isPathIgnore(path)) {
        return 'ignored';
      }
    };

    CommandOutputView.prototype.message = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-error');
      return addClass(this.statusIcon, 'status-success');
    };

    CommandOutputView.prototype.errorMessage = function(message) {
      this.cliOutput.append(message);
      this.showCmd();
      removeClass(this.statusIcon, 'status-success');
      return addClass(this.statusIcon, 'status-error');
    };

    CommandOutputView.prototype.getCwd = function() {
      var activeRootDir, editor, i, rootDirs, _i, _ref2;
      editor = atom.workspace.getActiveTextEditor();
      rootDirs = atom.project.rootDirectories;
      activeRootDir = 0;
      for (i = _i = 0, _ref2 = rootDirs.length; 0 <= _ref2 ? _i <= _ref2 : _i >= _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        if (editor && rootDirs[i] && rootDirs[i].contains(editor.getPath())) {
          activeRootDir = i;
        }
      }
      if (rootDirs.length === 0) {
        rootDirs = false;
      }
      this.cwd = this.cwd || (rootDirs[activeRootDir] && rootDirs[activeRootDir].path) || this.userHome;
      return this.cwd;
    };

    CommandOutputView.prototype.spawn = function(inputCmd, cmd, args) {
      var err, htmlStream;
      this.cmdEditor.hide();
      htmlStream = ansihtml();
      htmlStream.on('data', (function(_this) {
        return function(data) {
          _this.cliOutput.append(data);
          return _this.scrollToBottom();
        };
      })(this));
      try {
        this.program = exec(inputCmd, {
          stdio: 'pipe',
          env: process.env,
          cwd: this.getCwd()
        });
        this.program.stdout.pipe(htmlStream);
        this.program.stderr.pipe(htmlStream);
        removeClass(this.statusIcon, 'status-success');
        removeClass(this.statusIcon, 'status-error');
        addClass(this.statusIcon, 'status-running');
        this.killBtn.removeClass('hide');
        this.program.once('exit', (function(_this) {
          return function(code) {
            console.log('exit', code);
            _this.killBtn.addClass('hide');
            removeClass(_this.statusIcon, 'status-running');
            _this.program = null;
            addClass(_this.statusIcon, code === 0 && 'status-success' || 'status-error');
            return _this.showCmd();
          };
        })(this));
        this.program.on('error', (function(_this) {
          return function(err) {
            console.log('error');
            _this.cliOutput.append(err.message);
            _this.showCmd();
            return addClass(_this.statusIcon, 'status-error');
          };
        })(this));
        this.program.stdout.on('data', (function(_this) {
          return function() {
            _this.flashIconClass('status-info');
            return removeClass(_this.statusIcon, 'status-error');
          };
        })(this));
        return this.program.stderr.on('data', (function(_this) {
          return function() {
            console.log('stderr');
            return _this.flashIconClass('status-error', 300);
          };
        })(this));
      } catch (_error) {
        err = _error;
        this.cliOutput.append(err.message);
        return this.showCmd();
      }
    };

    return CommandOutputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY29tbWFuZC1vdXRwdXQtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxpQkFBa0IsT0FBQSxDQUFRLHNCQUFSLEVBQWxCLGNBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsT0FBZ0IsT0FBQSxDQUFRLGVBQVIsQ0FBaEIsRUFBQyxhQUFBLEtBQUQsRUFBUSxZQUFBLElBRlIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLFFBQTBCLE9BQUEsQ0FBUSxTQUFSLENBQTFCLEVBQUMsaUJBQUEsUUFBRCxFQUFXLG9CQUFBLFdBTFgsQ0FBQTs7QUFBQSxFQU1DLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQU5ELENBQUE7O0FBQUEsRUFPQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FQTCxDQUFBOztBQUFBLEVBU0EsY0FBQSxHQUFpQixJQVRqQixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsZ0NBQUEsR0FBQSxHQUFLLElBQUwsQ0FBQTs7QUFBQSxJQUNBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTywrQkFBckI7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/terminal-status/lib/command-output-view.coffee
