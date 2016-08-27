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
      this.viewModel = new ExViewModel(this);
    }

    Command.prototype.parseAddr = function(str, curPos) {
      var addr, mark, _ref;
      if (str === '.') {
        addr = curPos.row;
      } else if (str === '$') {
        addr = this.editor.getBuffer().lines.length - 1;
      } else if ((_ref = str[0]) === "+" || _ref === "-") {
        addr = curPos.row + this.parseOffset(str);
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
        addr = mark.bufferMarker.range.end.row;
      } else if (str[0] === "/") {
        addr = Find.findNextInBuffer(this.editor.buffer, curPos, str.slice(1, -1));
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str.slice(1, -1));
        }
      } else if (str[0] === "?") {
        addr = Find.findPreviousInBuffer(this.editor.buffer, curPos, str.slice(1, -1));
        if (addr == null) {
          throw new CommandError("Pattern not found: " + str.slice(1, -1));
        }
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
      var addr1, addr2, addrPattern, address1, address2, args, cl, command, curPos, func, lastLine, m, match, matching, name, off1, off2, range, val, _ref, _ref1, _ref2;
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
        addrPattern = /^(?:(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?[^\\]\/|\?.*?[^\\]\?|[+-]\d*)((?:\s*[+-]\d*)*))?(?:,(\.|\$|\d+|'[\[\]<>'`"^.(){}a-zA-Z]|\/.*?[^\\]\/|\?.*?[^\\]\?|[+-]\d*)((?:\s*[+-]\d*)*))?/;
        _ref1 = cl.match(addrPattern), match = _ref1[0], addr1 = _ref1[1], off1 = _ref1[2], addr2 = _ref1[3], off2 = _ref1[4];
        curPos = this.editor.getCursorBufferPosition();
        if (addr1 != null) {
          address1 = this.parseAddr(addr1, curPos);
        } else {
          address1 = curPos.row;
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
          address2 = this.parseAddr(addr2, curPos);
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
        range = [address1, address2 != null ? address2 : address1];
        cl = cl.slice(match != null ? match.length : void 0);
      }
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
      if ((func = Ex.singleton()[command]) != null) {
        return func({
          range: range,
          args: args,
          vimState: this.vimState,
          exState: this.exState,
          editor: this.editor
        });
      } else {
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
        if (func != null) {
          return func({
            range: range,
            args: args,
            vimState: this.vimState,
            exState: this.exState,
            editor: this.editor
          });
        } else {
          throw new CommandError("Not an editor command: " + input.characters);
        }
      }
    };

    return Command;

  })();

  module.exports = Command;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2NvbW1hbmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUFkLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FIZixDQUFBOztBQUFBLEVBS007QUFDUyxJQUFBLGlCQUFFLE1BQUYsRUFBVyxPQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxVQUFBLE9BQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsV0FBQSxDQUFZLElBQVosQ0FBakIsQ0FEVztJQUFBLENBQWI7O0FBQUEsc0JBR0EsU0FBQSxHQUFXLFNBQUMsR0FBRCxFQUFNLE1BQU4sR0FBQTtBQUNULFVBQUEsZ0JBQUE7QUFBQSxNQUFBLElBQUcsR0FBQSxLQUFPLEdBQVY7QUFDRSxRQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsR0FBZCxDQURGO09BQUEsTUFFSyxJQUFHLEdBQUEsS0FBTyxHQUFWO0FBRUgsUUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxLQUFLLENBQUMsTUFBMUIsR0FBbUMsQ0FBMUMsQ0FGRztPQUFBLE1BR0EsWUFBRyxHQUFJLENBQUEsQ0FBQSxFQUFKLEtBQVcsR0FBWCxJQUFBLElBQUEsS0FBZ0IsR0FBbkI7QUFDSCxR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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/command.coffee
