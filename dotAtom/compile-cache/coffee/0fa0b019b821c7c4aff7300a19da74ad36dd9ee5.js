(function() {
  var GrammarUtils, _, _base, _base1, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

  _ = require('underscore');

  GrammarUtils = require('../lib/grammar-utils');

  module.exports = {
    '1C (BSL)': {
      'File Based': {
        command: "oscript",
        args: function(context) {
          return ['-encoding=utf-8', context.filepath];
        }
      }
    },
    Ansible: {
      "File Based": {
        command: "ansible-playbook",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    AppleScript: {
      'Selection Based': {
        command: 'osascript',
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      'File Based': {
        command: 'osascript',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Babel ES6 JavaScript': {
      "Selection Based": {
        command: "babel-node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "babel-node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Batch: {
      "File Based": {
        command: "",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Behat Feature': {
      "File Based": {
        command: "behat",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Line Number Based": {
        command: "behat",
        args: function(context) {
          return [context.fileColonLine()];
        }
      }
    },
    C: GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "cc -Wall -include stdio.h '" + context.filepath + "' -o /tmp/c.out && /tmp/c.out"];
        }
      }
    } : void 0,
    'C# Script File': {
      "File Based": {
        command: "scriptcs",
        args: function(context) {
          return ['-script', context.filepath];
        }
      }
    },
    'C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : GrammarUtils.OperatingSystem.isLinux() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ["-c", "g++ -Wall -include stdio.h -include iostream '" + context.filepath + "' -o /tmp/cpp.out && /tmp/cpp.out"];
        }
      }
    } : void 0,
    Clojure: {
      "Selection Based": {
        command: "lein",
        args: function(context) {
          return ['exec', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lein",
        args: function(context) {
          return ['exec', context.filepath];
        }
      }
    },
    CoffeeScript: {
      "Selection Based": {
        command: "coffee",
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      "File Based": {
        command: "coffee",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "CoffeeScript (Literate)": {
      'Selection Based': {
        command: 'coffee',
        args: function(context) {
          return GrammarUtils.CScompiler.args.concat([context.getCode()]);
        }
      },
      'File Based': {
        command: 'coffee',
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Crystal: {
      "Selection Based": {
        command: "crystal",
        args: function(context) {
          return ['eval', context.getCode()];
        }
      },
      "File Based": {
        command: "crystal",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    D: {
      "File Based": {
        command: "rdmd",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Dart: {
      "File Based": {
        command: "dart",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    DOT: {
      "File Based": {
        command: "dot",
        args: function(context) {
          return ['-Tpng', context.filepath, '-o', context.filepath + '.png'];
        }
      }
    },
    Elixir: {
      "Selection Based": {
        command: "elixir",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "elixir",
        args: function(context) {
          return ['-r', context.filepath];
        }
      }
    },
    Erlang: {
      "Selection Based": {
        command: "erl",
        args: function(context) {
          return ['-noshell', '-eval', "" + (context.getCode()) + ", init:stop()."];
        }
      }
    },
    'F#': {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "fsi" : "fsharpi",
        args: function(context) {
          return ['--exec', context.filepath];
        }
      }
    },
    Forth: {
      "File Based": {
        command: "gforth",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Gherkin: {
      "File Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "cucumber",
        args: function(context) {
          return ['--color', context.fileColonLine()];
        }
      }
    },
    gnuplot: {
      "File Based": {
        command: "gnuplot",
        args: function(context) {
          return ['-p', context.filepath];
        },
        workingDirectory: (_ref = atom.workspace.getActivePaneItem()) != null ? (_ref1 = _ref.buffer) != null ? (_ref2 = _ref1.file) != null ? typeof _ref2.getParent === "function" ? typeof (_base = _ref2.getParent()).getPath === "function" ? _base.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Go: {
      "File Based": {
        command: "go",
        args: function(context) {
          if (context.filepath.match(/_test.go/)) {
            return ['test', ''];
          } else {
            return ['run', context.filepath];
          }
        },
        workingDirectory: (_ref3 = atom.workspace.getActivePaneItem()) != null ? (_ref4 = _ref3.buffer) != null ? (_ref5 = _ref4.file) != null ? typeof _ref5.getParent === "function" ? typeof (_base1 = _ref5.getParent()).getPath === "function" ? _base1.getPath() : void 0 : void 0 : void 0 : void 0 : void 0
      }
    },
    Groovy: {
      "Selection Based": {
        command: "groovy",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "groovy",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Haskell: {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      },
      "Selection Based": {
        command: "ghc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      }
    },
    IcedCoffeeScript: {
      "Selection Based": {
        command: "iced",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "iced",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    ioLanguage: {
      "Selection Based": {
        command: "io",
        args: function(context) {
          return [context.getCode()];
        }
      },
      "File Based": {
        command: "io",
        args: function(context) {
          return ['-e', context.filepath];
        }
      }
    },
    Java: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, className;
          className = context.filename.replace(/\.java$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c javac -Xlint " + context.filename + " && java " + className];
          } else {
            args = ['-c', "javac -d /tmp '" + context.filepath + "' && java -cp /tmp " + className];
          }
          return args;
        }
      }
    },
    JavaScript: {
      "Selection Based": {
        command: "node",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "node",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "JavaScript for Automation (JXA)": {
      "Selection Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', '-e', context.getCode()];
        }
      },
      "File Based": {
        command: "osascript",
        args: function(context) {
          return ['-l', 'JavaScript', context.filepath];
        }
      }
    },
    Jolie: {
      "File Based": {
        command: "jolie",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Julia: {
      "Selection Based": {
        command: "julia",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "julia",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Kotlin: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jarName, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".kt");
          jarName = tmpFile.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + tmpFile + " -include-runtime -d " + jarName + " && java -jar " + jarName];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          var args, jarName;
          jarName = context.filename.replace(/\.kt$/, ".jar");
          args = ['-c', "kotlinc " + context.filepath + " -include-runtime -d /tmp/" + jarName + " && java -jar /tmp/" + jarName];
          return args;
        }
      }
    },
    LaTeX: {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    'LaTeX Beamer': {
      "File Based": {
        command: "latexmk",
        args: function(context) {
          return ['-cd', '-quiet', '-pdf', '-pv', '-shell-escape', context.filepath];
        }
      }
    },
    LilyPond: {
      "File Based": {
        command: "lilypond",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lisp: {
      "Selection Based": {
        command: "sbcl",
        args: function(context) {
          var args, statements;
          statements = _.flatten(_.map(GrammarUtils.Lisp.splitStatements(context.getCode()), function(statement) {
            return ['--eval', statement];
          }));
          args = _.union(['--noinform', '--disable-debugger', '--non-interactive', '--quit'], statements);
          return args;
        }
      },
      "File Based": {
        command: "sbcl",
        args: function(context) {
          return ['--noinform', '--script', context.filepath];
        }
      }
    },
    'Literate Haskell': {
      "File Based": {
        command: "runhaskell",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    LiveScript: {
      "Selection Based": {
        command: "lsc",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "lsc",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Lua: {
      "Selection Based": {
        command: "lua",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "lua",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Makefile: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "make",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    MagicPython: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    MATLAB: {
      "Selection Based": {
        command: "matlab",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.MATLAB.createTempFileWithCode(code);
          return ['-nodesktop', '-nosplash', '-nojvm', '-nodisplay', '-r', "try, run('" + tmpFile + "'), catch ME, disp(ME.message);,exit(1);, end, exit(0);"];
        }
      },
      "File Based": {
        command: "matlab",
        args: function(context) {
          return ['-nodesktop', '-nosplash', '-nojvm', '-nodisplay', '-r', "try, run('" + context.filepath + "'), catch ME, disp(ME.message);,exit(1);, end, exit(0);"];
        }
      }
    },
    MoonScript: {
      "Selection Based": {
        command: "moon",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "moon",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'mongoDB (JavaScript)': {
      "Selection Based": {
        command: "mongo",
        args: function(context) {
          return ['--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "mongo",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    NCL: {
      "Selection Based": {
        command: "ncl",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          code = code + "\nexit";
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "ncl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    newLISP: {
      "Selection Based": {
        command: "newlisp",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "newlisp",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Nim: {
      "File Based": {
        command: "bash",
        args: function(context) {
          var file, path;
          file = GrammarUtils.Nim.findNimProjectFile(context.filepath);
          path = GrammarUtils.Nim.projectDir(context.filepath);
          return ['-c', 'cd "' + path + '" && nim c --hints:off --parallelBuild:1 -r "' + file + '" 2>&1'];
        }
      }
    },
    NSIS: {
      "Selection Based": {
        command: "makensis",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode();
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return [tmpFile];
        }
      },
      "File Based": {
        command: "makensis",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Objective-C': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang -fcolor-diagnostics -Wall -include stdio.h -framework Cocoa " + context.filepath + " -o /tmp/objc-c.out && /tmp/objc-c.out"];
        }
      }
    } : void 0,
    'Objective-C++': GrammarUtils.OperatingSystem.isDarwin() ? {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "xcrun clang++ -fcolor-diagnostics -Wc++11-extensions -Wall -include stdio.h -include iostream -framework Cocoa " + context.filepath + " -o /tmp/objc-cpp.out && /tmp/objc-cpp.out"];
        }
      }
    } : void 0,
    OCaml: {
      "File Based": {
        command: "ocaml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Octave: {
      "Selection Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), '--eval', context.getCode()];
        }
      },
      "File Based": {
        command: "octave",
        args: function(context) {
          return ['-p', context.filepath.replace(/[^\/]*$/, ''), context.filepath];
        }
      }
    },
    'Pandoc Markdown': {
      "File Based": {
        command: "panzer",
        args: function(context) {
          return [context.filepath, "--output=" + context.filepath + ".pdf"];
        }
      }
    },
    Perl: {
      "Selection Based": {
        command: "perl",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.Perl.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "perl",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Perl 6 FE": {
      "Selection Based": {
        command: "perl6",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "perl6",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PHP: {
      "Selection Based": {
        command: "php",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.PHP.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "php",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    PowerShell: {
      "File Based": {
        command: "powershell",
        args: function(context) {
          return [context.filepath.replace(/\ /g, "` ")];
        }
      }
    },
    Prolog: {
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', 'cd \"' + context.filepath.replace(/[^\/]*$/, '') + '\"; swipl -f \"' + context.filepath + '\" -t main --quiet'];
        }
      }
    },
    Python: {
      "Selection Based": {
        command: "python",
        args: function(context) {
          return ['-u', '-c', context.getCode()];
        }
      },
      "File Based": {
        command: "python",
        args: function(context) {
          return ['-u', context.filepath];
        }
      }
    },
    R: {
      "Selection Based": {
        command: "Rscript",
        args: function(context) {
          var code, file;
          code = context.getCode();
          file = GrammarUtils.R.createTempFileWithCode(code);
          return [file];
        }
      },
      "File Based": {
        command: "Rscript",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Racket: {
      "Selection Based": {
        command: "racket",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "racket",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    RANT: {
      "Selection Based": {
        command: "RantConsole.exe",
        args: function(context) {
          var code, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code);
          return ['-file', tmpFile];
        }
      },
      "File Based": {
        command: "RantConsole.exe",
        args: function(context) {
          return ['-file', context.filepath];
        }
      }
    },
    RSpec: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.filepath];
        }
      },
      "Line Number Based": {
        command: "rspec",
        args: function(context) {
          return ['--tty', '--color', context.fileColonLine()];
        }
      }
    },
    Ruby: {
      "Selection Based": {
        command: "ruby",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "ruby",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    'Ruby on Rails': {
      "Selection Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.getCode()];
        }
      },
      "File Based": {
        command: "rails",
        args: function(context) {
          return ['runner', context.filepath];
        }
      }
    },
    Rust: {
      "File Based": {
        command: GrammarUtils.OperatingSystem.isWindows() ? "cmd" : "bash",
        args: function(context) {
          var args, progname;
          progname = context.filename.replace(/\.rs$/, "");
          args = [];
          if (GrammarUtils.OperatingSystem.isWindows()) {
            args = ["/c rustc " + context.filepath + " && " + progname + ".exe"];
          } else {
            args = ['-c', "rustc '" + context.filepath + "' -o /tmp/rs.out && /tmp/rs.out"];
          }
          return args;
        }
      }
    },
    Sage: {
      "Selection Based": {
        command: "sage",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "sage",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Sass: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scala: {
      "Selection Based": {
        command: "scala",
        args: function(context) {
          return ['-e', context.getCode()];
        }
      },
      "File Based": {
        command: "scala",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Scheme: {
      "Selection Based": {
        command: "guile",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "guile",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    SCSS: {
      "File Based": {
        command: "sass",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script": {
      "Selection Based": {
        command: process.env.SHELL,
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: process.env.SHELL,
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "Shell Script (Fish)": {
      "Selection Based": {
        command: "fish",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "fish",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    "SQL (PostgreSQL)": {
      "Selection Based": {
        command: "psql",
        args: function(context) {
          return ['-c', context.getCode()];
        }
      },
      "File Based": {
        command: "psql",
        args: function(context) {
          return ['-f', context.filepath];
        }
      }
    },
    "Standard ML": {
      "File Based": {
        command: "sml",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    Stata: {
      "Selection Based": {
        command: "xstata-se",
        args: function(context) {
          return ['do', context.getCode()];
        }
      },
      "File Based": {
        command: "xstata-se",
        args: function(context) {
          return ['do', context.filepath];
        }
      }
    },
    Swift: {
      "File Based": {
        command: "swift",
        args: function(context) {
          return [context.filepath];
        }
      }
    },
    TypeScript: {
      "Selection Based": {
        command: "bash",
        args: function(context) {
          var args, code, jsFile, tmpFile;
          code = context.getCode(true);
          tmpFile = GrammarUtils.createTempFileWithCode(code, ".ts");
          jsFile = tmpFile.replace(/\.ts$/, ".js");
          args = ['-c', "tsc --out '" + jsFile + "' '" + tmpFile + "' && node '" + jsFile + "'"];
          return args;
        }
      },
      "File Based": {
        command: "bash",
        args: function(context) {
          return ['-c', "tsc '" + context.filepath + "' --out /tmp/js.out && node /tmp/js.out"];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvZ3JhbW1hcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBR0E7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FEZixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxTQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7aUJBQWEsQ0FBQyxpQkFBRCxFQUFvQixPQUFPLENBQUMsUUFBNUIsRUFBYjtRQUFBLENBRE47T0FERjtLQURGO0FBQUEsSUFLQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFlBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLGtCQUFUO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FBQyxPQUFELEdBQUE7aUJBQWEsQ0FBQyxPQUFPLENBQUMsUUFBVCxFQUFiO1FBQUEsQ0FETjtPQURGO0tBTkY7QUFBQSxJQVVBLFdBQUEsRUFDRTtBQUFBLE1BQUEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLFdBQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtpQkFBYyxDQUFDLElBQUQsRUFBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQVAsRUFBZDtRQUFBLENBRE47T0FERjtBQUFBLE1BR0EsWUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsV0FBVDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBQUMsT0FBRCxHQUFBO2lCQUFhLENBQUMsT0FBTyxDQUFD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/grammars.coffee
