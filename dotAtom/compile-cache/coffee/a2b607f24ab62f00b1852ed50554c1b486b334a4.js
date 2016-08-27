(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('async');

  fs = require('fs');

  path = require('path');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath, config) {
      var ignoreVcsIgnores, repo;
      this.rootPath = rootPath;
      this.timestamp = config.timestamp, this.sourceNames = config.sourceNames, ignoreVcsIgnores = config.ignoreVcsIgnores, this.traverseSymlinkDirectories = config.traverseSymlinkDirectories, this.ignoredNames = config.ignoredNames, this.knownPaths = config.knownPaths;
      if (this.knownPaths == null) {
        this.knownPaths = [];
      }
      this.paths = [];
      this.lostPaths = [];
      this.scannedPaths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var p, _i, _len, _ref, _ref1;
          _ref = _this.knownPaths;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (__indexOf.call(_this.scannedPaths, p) < 0 && p.indexOf(_this.rootPath) === 0) {
              _this.lostPaths.push(p);
            }
          }
          _this.flushPaths();
          if ((_ref1 = _this.repo) != null) {
            _ref1.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isSource = function(loadedPath) {
      var relativePath, sourceName, _i, _len, _ref;
      relativePath = path.relative(this.rootPath, loadedPath);
      _ref = this.sourceNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sourceName = _ref[_i];
        if (sourceName.match(relativePath)) {
          return true;
        }
      }
    };

    PathLoader.prototype.isIgnored = function(loadedPath, stats) {
      var ignoredName, relativePath, _i, _len, _ref, _ref1;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((_ref = this.repo) != null ? _ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        _ref1 = this.ignoredNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ignoredName = _ref1[_i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
        return false;
      }
    };

    PathLoader.prototype.isKnown = function(loadedPath) {
      return __indexOf.call(this.knownPaths, loadedPath) >= 0;
    };

    PathLoader.prototype.hasChanged = function(loadedPath, stats) {
      if (stats && (this.timestamp != null)) {
        return stats.ctime >= this.timestamp;
      } else {
        return false;
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, stats, done) {
      this.scannedPaths.push(loadedPath);
      if (this.isSource(loadedPath) && !this.isIgnored(loadedPath, stats)) {
        if (this.isKnown(loadedPath)) {
          if (this.hasChanged(loadedPath, stats)) {
            this.paths.push(loadedPath);
          }
        } else {
          this.paths.push(loadedPath);
        }
      } else {
        if (__indexOf.call(this.knownPaths, loadedPath) >= 0) {
          this.lostPaths.push(loadedPath);
        }
      }
      if (this.paths.length + this.lostPaths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      if (this.paths.length) {
        emit('load-paths:paths-found', this.paths);
      }
      if (this.lostPaths.length) {
        emit('load-paths:paths-lost', this.lostPaths);
      }
      this.paths = [];
      return this.lostPaths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, stats, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, stats, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(config) {
    var error, ignore, newConf, source, _i, _j, _len, _len1, _ref, _ref1;
    newConf = {
      ignoreVcsIgnores: config.ignoreVcsIgnores,
      traverseSymlinkDirectories: config.traverseSymlinkDirectories,
      knownPaths: config.knownPaths,
      ignoredNames: [],
      sourceNames: []
    };
    if (config.timestamp != null) {
      newConf.timestamp = new Date(Date.parse(config.timestamp));
    }
    _ref = config.sourceNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      if (source) {
        try {
          newConf.sourceNames.push(new Minimatch(source, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing source pattern (" + source + "): " + error.message);
        }
      }
    }
    _ref1 = config.ignoredNames;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      ignore = _ref1[_j];
      if (ignore) {
        try {
          newConf.ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    return async.each(config.paths, function(rootPath, next) {
      return new PathLoader(rootPath, newConf).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi90YXNrcy9sb2FkLXBhdGhzLWhhbmRsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQyxnQkFBaUIsT0FBQSxDQUFRLE1BQVIsRUFBakIsYUFIRCxDQUFBOztBQUFBLEVBSUMsWUFBYSxPQUFBLENBQVEsV0FBUixFQUFiLFNBSkQsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsR0FOakIsQ0FBQTs7QUFBQSxFQVFNO0FBQ1UsSUFBQSxvQkFBRSxRQUFGLEVBQVksTUFBWixHQUFBO0FBQ1osVUFBQSxzQkFBQTtBQUFBLE1BRGEsSUFBQyxDQUFBLFdBQUEsUUFDZCxDQUFBO0FBQUEsTUFBQyxJQUFDLENBQUEsbUJBQUEsU0FBRixFQUFhLElBQUMsQ0FBQSxxQkFBQSxXQUFkLEVBQTJCLDBCQUFBLGdCQUEzQixFQUE2QyxJQUFDLENBQUEsb0NBQUEsMEJBQTlDLEVBQTBFLElBQUMsQ0FBQSxzQkFBQSxZQUEzRSxFQUF5RixJQUFDLENBQUEsb0JBQUEsVUFBMUYsQ0FBQTs7UUFFQSxJQUFDLENBQUEsYUFBYztPQUZmO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBSFQsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxFQUpiLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxZQUFELEdBQWdCLEVBTGhCLENBQUE7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/pigments/lib/tasks/load-paths-handler.coffee
