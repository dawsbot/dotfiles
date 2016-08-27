(function() {
  var CodeContext;

  CodeContext = require('../lib/code-context');

  describe('CodeContext', function() {
    beforeEach(function() {
      this.codeContext = new CodeContext('test.txt', '/tmp/test.txt', null);
      this.dummyTextSource = {};
      return this.dummyTextSource.getText = function() {
        return "print 'hello world!'";
      };
    });
    describe('fileColonLine when lineNumber is not set', function() {
      it('returns the full filepath when fullPath is truthy', function() {
        expect(this.codeContext.fileColonLine()).toMatch("/tmp/test.txt");
        return expect(this.codeContext.fileColonLine(true)).toMatch("/tmp/test.txt");
      });
      return it('returns only the filename and line number when fullPath is falsy', function() {
        return expect(this.codeContext.fileColonLine(false)).toMatch("test.txt");
      });
    });
    describe('fileColonLine when lineNumber is set', function() {
      it('returns the full filepath when fullPath is truthy', function() {
        this.codeContext.lineNumber = 42;
        expect(this.codeContext.fileColonLine()).toMatch("/tmp/test.txt");
        return expect(this.codeContext.fileColonLine(true)).toMatch("/tmp/test.txt");
      });
      return it('returns only the filename and line number when fullPath is falsy', function() {
        this.codeContext.lineNumber = 42;
        return expect(this.codeContext.fileColonLine(false)).toMatch("test.txt");
      });
    });
    describe('getCode', function() {
      it('returns undefined if no textSource is available', function() {
        return expect(this.codeContext.getCode()).toBe(void 0);
      });
      it('returns a string prepended with newlines when prependNewlines is truthy', function() {
        var code;
        this.codeContext.textSource = this.dummyTextSource;
        this.codeContext.lineNumber = 3;
        code = this.codeContext.getCode(true);
        expect(typeof code).toEqual('string');
        return expect(code).toMatch("\n\nprint 'hello world!'");
      });
      return it('returns the text from the textSource when available', function() {
        var code;
        this.codeContext.textSource = this.dummyTextSource;
        code = this.codeContext.getCode();
        expect(typeof code).toEqual('string');
        return expect(code).toMatch("print 'hello world!'");
      });
    });
    describe('shebangCommand when no shebang was found', function() {
      return it('returns undefined when no shebang is found', function() {
        var firstLine, lines;
        lines = this.dummyTextSource.getText();
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toBe(void 0);
      });
    });
    describe('shebangCommand when a shebang was found', function() {
      it('returns the command from the shebang', function() {
        var firstLine, lines;
        lines = "#!/bin/bash\necho 'hello from bash!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('bash');
      });
      it('returns /usr/bin/env as the command if applicable', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/env ruby -w\nputs 'hello from ruby!'";
        firstLine = lines.split("\n")[0];
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('env');
      });
      return it('returns a command with non-alphabet characters', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/python2.7\nprint 'hello from python!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('python2.7');
      });
    });
    describe('shebangCommandArgs when no shebang was found', function() {
      return it('returns [] when no shebang is found', function() {
        var firstLine, lines;
        lines = this.dummyTextSource.getText();
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
    });
    return describe('shebangCommandArgs when a shebang was found', function() {
      it('returns the command from the shebang', function() {
        var firstLine, lines;
        lines = "#!/bin/bash\necho 'hello from bash!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
      it('returns the true command as the first argument when /usr/bin/env is used', function() {
        var args, firstLine, lines;
        lines = "#!/usr/bin/env ruby -w\nputs 'hello from ruby!'";
        firstLine = lines.split("\n")[0];
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        args = this.codeContext.shebangCommandArgs();
        expect(args[0]).toMatch('ruby');
        return expect(args).toMatch(['ruby', '-w']);
      });
      return it('returns the command args when the command had non-alphabet characters', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/python2.7\nprint 'hello from python!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9zcGVjL2NvZGUtY29udGV4dC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxVQUFaLEVBQXdCLGVBQXhCLEVBQXlDLElBQXpDLENBQW5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBRm5CLENBQUE7YUFHQSxJQUFDLENBQUEsZUFBZSxDQUFDLE9BQWpCLEdBQTJCLFNBQUEsR0FBQTtlQUN6Qix1QkFEeUI7TUFBQSxFQUpsQjtJQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsSUFPQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELE1BQUEsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUEsR0FBQTtBQUN0RCxRQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsV0FBVyxDQUFDLGFBQWIsQ0FBQSxDQUFQLENBQW9DLENBQUMsT0FBckMsQ0FBNkMsZUFBN0MsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsYUFBYixDQUEyQixJQUEzQixDQUFQLENBQXdDLENBQUMsT0FBekMsQ0FBaUQsZUFBakQsRUFGc0Q7TUFBQSxDQUF4RCxDQUFBLENBQUE7YUFJQSxFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBO2VBQ3JFLE1BQUEsQ0FBTyxJQUFDLENBQUEsV0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/spec/code-context-spec.coffee
