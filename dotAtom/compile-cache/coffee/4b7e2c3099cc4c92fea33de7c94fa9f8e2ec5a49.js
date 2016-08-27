(function() {
  var BufferedProcess, Path, RepoListView, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, _prettify, _prettifyDiff, _prettifyUntracked;

  BufferedProcess = require('atom').BufferedProcess;

  Path = require('flavored-path');

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, _ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(_ref = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = data.slice(1);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        line = _ref1[_i];
        _results.push('@@' + line);
      }
      return _results;
    })())), _ref;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, _ref;
      project = atom.project;
      path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options) {
      if (options == null) {
        options = {
          env: process.env
        };
      }
      return new Promise(function(resolve, reject) {
        var output, _ref;
        output = '';
        try {
          return new BufferedProcess({
            command: (_ref = atom.config.get('git-plus.gitPath')) != null ? _ref : 'git',
            args: args,
            options: options,
            stdout: function(data) {
              return output += data.toString();
            },
            stderr: function(data) {
              return output += data.toString();
            },
            exit: function(code) {
              if (code === 0) {
                return resolve(output);
              } else {
                return reject(output);
              }
            }
          });
        } catch (_error) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        }
      });
    },
    getConfig: function(setting, workingDirectory) {
      if (workingDirectory == null) {
        workingDirectory = null;
      }
      if (workingDirectory == null) {
        workingDirectory = Path.get('~');
      }
      return git.cmd(['config', '--get', setting], {
        cwd: workingDirectory
      })["catch"](function(error) {
        if ((error != null) && error !== '') {
          return notifier.addError(error);
        } else {
          return '';
        }
      });
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0');
        } else {
          return [];
        }
      });
    },
    refresh: function() {
      return atom.project.getRepositories().forEach(function(repo) {
        if (repo != null) {
          repo.refreshStatus();
          return git.cmd(['add', '--refresh', '--', '.'], {
            cwd: repo.getWorkingDirectory()
          });
        }
      });
    },
    relativize: function(path) {
      var _ref, _ref1, _ref2, _ref3;
      return (_ref = (_ref1 = (_ref2 = git.getSubmodule(path)) != null ? _ref2.relativize(path) : void 0) != null ? _ref1 : (_ref3 = atom.project.getRepositories()[0]) != null ? _ref3.relativize(path) : void 0) != null ? _ref : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo, stdout) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data);
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, _arg) {
      var args, showUntracked;
      showUntracked = (_arg != null ? _arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data));
        } else {
          return _prettify(data);
        }
      });
    },
    add: function(repo, _arg) {
      var args, file, update, _ref;
      _ref = _arg != null ? _arg : {}, file = _ref.file, update = _ref.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          notifier.addSuccess("Added " + (file != null ? file : 'all files'));
          return true;
        }
      });
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getSubmodule: function(path) {
      var _ref, _ref1, _ref2;
      if (path == null) {
        path = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      }
      return (_ref1 = atom.project.getRepositories().filter(function(r) {
        var _ref2;
        return r != null ? (_ref2 = r.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (_ref2 = _ref1.repo) != null ? _ref2.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBJQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUpYLENBQUE7O0FBQUEsRUFNQSxpQkFBQSxHQUFvQixTQUFDLElBQUQsRUFBTyxZQUFQLEdBQUE7QUFDbEIsUUFBQSxJQUFBOztNQUR5QixlQUFhO0tBQ3RDO0FBQUEsSUFBQSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixvQkFBbkIsQ0FBUCxDQUFBO1dBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7QUFBQSxNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQsR0FBQTthQUNKLFlBQVksQ0FBQyxNQUFiLENBQW9CLGtCQUFBLENBQW1CLElBQW5CLENBQXBCLEVBREk7SUFBQSxDQUROLEVBRmtCO0VBQUEsQ0FOcEIsQ0FBQTs7QUFBQSxFQVlBLFNBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFFBQUEsT0FBQTtBQUFBLElBQUEsSUFBYSxJQUFBLEtBQVEsRUFBckI7QUFBQSxhQUFPLEVBQVAsQ0FBQTtLQUFBO0FBQUEsSUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCLGFBRHhCLENBQUE7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/git.coffee
