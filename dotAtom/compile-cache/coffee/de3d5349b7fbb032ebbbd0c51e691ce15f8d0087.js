(function() {
  var Command, CommandError, Ex, ExViewModel, Find;

  ExViewModel = require('./ex-view-model');

  Ex = require('./ex');

  Find = require('./find');

  CommandError = require('./command-error');

  Command = (function() {
    function Command(editor, exState) {
      this.editor = editor;
      this.exState = exState;
      this.selections = this.exState.getSelections();
      this.viewModel = new ExViewModel(this, Object.keys(this.selections).length > 0);
    }

    Command.prototype.parseAddr = function(str, cursor) {
      var addr, mark, row, _ref;
      row = cursor.getBufferRow();
      if (str === '.') {
        addr = row;
      } else if (str === '$') {
        addr = this.editor.getBuffer().lines.length - 1;
      } else if ((_ref = str[0]) === "+" || _ref === "-") {
        addr = row + this.parseOffset(str);
      } else if (!isNaN(str)) {
        addr = parseInt(str) - 1;
      } else if (str[0] === "'") {
        if (this.vimState == null) {
          throw new CommandError("Couldn't get access to vim-mode.");
        }
        mark = this.vimState.marks[str[1]];
        if (mark == null) {
          throw new CommandError("Mark " + str + " not set.");
        }
        addr = mark.getEndBufferPosition().row;
      } else if (str[0] === "/") {
        str = str.slice(1);
        if (str[str.length - 1] === "/") {
          str = str.slice(0, -1);
        }
        addr = Find.scanEditor(str, this.editor, cursor.getCurrentLineBufferRange().end)[0];
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str);
        }
        addr = addr.start.row;
      } else if (str[0] === "?") {
        str = str.slice(1);
        if (str[str.length - 1] === "?") {
          str = str.slice(0, -1);
        }
        addr = Find.scanEditor(str, this.editor, cursor.getCurrentLineBufferRange().start, true)[0];
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str.slice(1, -1));
        }
        addr = addr.start.row;
      }
      return addr;
    };

    Command.prototype.parseOffset = function(str) {
      var o;
      if (str.length === 0) {
        return 0;
      }
      if (str.length === 1) {
        o = 1;
      } else {
        o = parseInt(str.slice(1));
      }
      if (str[0] === '+') {
        return o;
      } else {
        return -o;
      }
    };

    Command.prototype.execute = function(input) {
      var addr1, addr2, addrPattern, address1, address2, args, bufferRange, cl, command, cursor, func, id, lastLine, m, match, matching, name, off1, off2, range, runOverSelections, selection, val, _ref, _ref1, _ref2, _ref3, _results;
      this.vimState = (_ref = this.exState.globalExState.vim) != null ? _ref.getEditorState(this.editor) : void 0;
      cl = input.characters;
      cl = cl.replace(/^(:|\s)*/, '');
      if (!(cl.length > 0)) {
        return;
      }
      if (cl[0] === '"') {
        return;
      }
      lastLine = this.editor.getBuffer().lines.length - 1;
      if (cl[0] === '%') {
        range = [0, lastLine];
        cl = cl.slice(1);
      } else {
        addrPattern = /^(?:(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?(?:[^\\]\/|$)|\?.*?(?:[^\\]\?|$)|[+-]\d*)((?:\s*[+-]\d*)*))?(?:,(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?[^\\]\/|\?.*?[^\\]\?|[+-]\d*)((?:\s*[+-]\d*)*))?/;
        _ref1 = cl.match(addrPattern), match = _ref1[0], addr1 = _ref1[1], off1 = _ref1[2], addr2 = _ref1[3], off2 = _ref1[4];
        cursor = this.editor.getLastCursor();
        if (addr1 === "'<" && addr2 === "'>") {
          runOverSelections = true;
        } else {
          runOverSelections = false;
          if (addr1 != null) {
            address1 = this.parseAddr(addr1, cursor);
          } else {
            address1 = cursor.getBufferRow();
          }
          if (off1 != null) {
            address1 += this.parseOffset(off1);
          }
          if (address1 === -1) {
            address1 = 0;
          }
          if (address1 < 0 || address1 > lastLine) {
            throw new CommandError('Invalid range');
          }
          if (addr2 != null) {
            address2 = this.parseAddr(addr2, cursor);
          }
          if (off2 != null) {
            address2 += this.parseOffset(off2);
          }
          if (address2 < 0 || address2 > lastLine) {
            throw new CommandError('Invalid range');
          }
          if (address2 < address1) {
            throw new CommandError('Backwards range given');
          }
        }
        range = [address1, address2 != null ? address2 : address1];
      }
      cl = cl.slice(match != null ? match.length : void 0);
      cl = cl.trimLeft();
      if (cl.length === 0) {
        this.editor.setCursorBufferPosition([range[1], 0]);
        return;
      }
      if (cl.length === 2 && cl[0] === 'k' && /[a-z]/i.test(cl[1])) {
        command = 'mark';
        args = cl[1];
      } else if (!/[a-z]/i.test(cl[0])) {
        command = cl[0];
        args = cl.slice(1);
      } else {
        _ref2 = cl.match(/^(\w+)(.*)/), m = _ref2[0], command = _ref2[1], args = _ref2[2];
      }
      if ((func = Ex.singleton()[command]) == null) {
        matching = (function() {
          var _ref3, _results;
          _ref3 = Ex.singleton();
          _results = [];
          for (name in _ref3) {
            val = _ref3[name];
            if (name.indexOf(command) === 0) {
              _results.push(name);
            }
          }
          return _results;
        })();
        matching.sort();
        command = matching[0];
        func = Ex.singleton()[command];
      }
      if (func != null) {
        if (runOverSelections) {
          _ref3 = this.selections;
          _results = [];
          for (id in _ref3) {
            selection = _ref3[id];
            bufferRange = selection.getBufferRange();
            range = [bufferRange.start.row, bufferRange.end.row];
            _results.push(func({
              range: range,
              args: args,
              vimState: this.vimState,
              exState: this.exState,
              editor: this.editor
            }));
          }
          return _results;
        } else {
          return func({
            range: range,
            args: args,
            vimState: this.vimState,
            exState: this.exState,
            editor: this.editor
          });
        }
      } else {
        throw new CommandError("Not an editor command: " + input.characters);
      }
    };

    return Command;

  })();

  module.exports = Command;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2NvbW1hbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FIZixDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLGlCQUFFLE1BQUYsRUFBVyxPQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxVQUFBLE9BQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUEsQ0FBZCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQWUsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsVUFBYixDQUF3QixDQUFDLE1BQXpCLEdBQWtDLENBQWpELENBRGpCLENBRFc7SUFBQSxDQUFiOztBQUFBLHNCQUlBLFNBQUEsR0FBVyxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7QUFDVCxVQUFBLHFCQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLFlBQVAsQ0FBQSxDQUFOLENBQUE7QUFDQSxNQUFBLElBQUcsR0FBQSxLQUFPLEdBQVY7QUFDRSxRQUFBLElBQUEsR0FBTyxHQUFQLENBREY7T0FBQSxNQUVLLElBQUcsR0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/command.coffee
