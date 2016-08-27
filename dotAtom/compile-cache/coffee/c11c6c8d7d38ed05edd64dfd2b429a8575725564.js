(function() {
  var BufferedProcess, Emitter, PackageManager, Q, semver, url, _;

  _ = require('underscore-plus');

  BufferedProcess = require('atom').BufferedProcess;

  Emitter = require('emissary').Emitter;

  Q = require('q');

  semver = require('semver');

  url = require('url');

  Q.stopUnhandledRejectionTracking();

  module.exports = PackageManager = (function() {
    Emitter.includeInto(PackageManager);

    function PackageManager() {
      this.packagePromises = [];
    }

    PackageManager.prototype.runCommand = function(args, callback) {
      var command, errorLines, exit, outputLines, stderr, stdout;
      command = atom.packages.getApmPath();
      outputLines = [];
      stdout = function(lines) {
        return outputLines.push(lines);
      };
      errorLines = [];
      stderr = function(lines) {
        return errorLines.push(lines);
      };
      exit = function(code) {
        return callback(code, outputLines.join('\n'), errorLines.join('\n'));
      };
      args.push('--no-color');
      return new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
    };

    PackageManager.prototype.loadFeatured = function(callback) {
      var args, version;
      args = ['featured', '--json'];
      version = atom.getVersion();
      if (semver.valid(version)) {
        args.push('--compatible', version);
      }
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, _ref;
        if (code === 0) {
          try {
            packages = (_ref = JSON.parse(stdout)) != null ? _ref : [];
          } catch (_error) {
            error = _error;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error('Fetching featured packages and themes failed.');
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.loadOutdated = function(callback) {
      var args, version;
      args = ['outdated', '--json'];
      version = atom.getVersion();
      if (semver.valid(version)) {
        args.push('--compatible', version);
      }
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, _ref;
        if (code === 0) {
          try {
            packages = (_ref = JSON.parse(stdout)) != null ? _ref : [];
          } catch (_error) {
            error = _error;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error('Fetching outdated packages and themes failed.');
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.loadPackage = function(packageName, callback) {
      var args;
      args = ['view', packageName, '--json'];
      return this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, _ref;
        if (code === 0) {
          try {
            packages = (_ref = JSON.parse(stdout)) != null ? _ref : [];
          } catch (_error) {
            error = _error;
            callback(error);
            return;
          }
          return callback(null, packages);
        } else {
          error = new Error("Fetching package '" + packageName + "' failed.");
          error.stdout = stdout;
          error.stderr = stderr;
          return callback(error);
        }
      });
    };

    PackageManager.prototype.getFeatured = function() {
      return this.featuredPromise != null ? this.featuredPromise : this.featuredPromise = Q.nbind(this.loadFeatured, this)();
    };

    PackageManager.prototype.getOutdated = function() {
      return this.outdatedPromise != null ? this.outdatedPromise : this.outdatedPromise = Q.nbind(this.loadOutdated, this)();
    };

    PackageManager.prototype.getPackage = function(packageName) {
      var _base;
      return (_base = this.packagePromises)[packageName] != null ? _base[packageName] : _base[packageName] = Q.nbind(this.loadPackage, this, packageName)();
    };

    PackageManager.prototype.search = function(query, options) {
      var args, deferred;
      if (options == null) {
        options = {};
      }
      deferred = Q.defer();
      args = ['search', query, '--json'];
      if (options.themes) {
        args.push('--themes');
      } else if (options.packages) {
        args.push('--packages');
      }
      this.runCommand(args, function(code, stdout, stderr) {
        var error, packages, _ref;
        if (code === 0) {
          try {
            packages = (_ref = JSON.parse(stdout)) != null ? _ref : [];
            return deferred.resolve(packages);
          } catch (_error) {
            error = _error;
            return deferred.reject(error);
          }
        } else {
          error = new Error("Searching for \u201C" + query + "\u201D failed.");
          error.stdout = stdout;
          error.stderr = stderr;
          return deferred.reject(error);
        }
      });
      return deferred.promise;
    };

    PackageManager.prototype.update = function(pack, newVersion, callback) {
      var activateOnFailure, activateOnSuccess, args, exit, name, theme;
      name = pack.name, theme = pack.theme;
      activateOnSuccess = !theme && !atom.packages.isPackageDisabled(name);
      activateOnFailure = atom.packages.isPackageActive(name);
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      if (atom.packages.isPackageLoaded(name)) {
        atom.packages.unloadPackage(name);
      }
      args = ['install', "" + name + "@" + newVersion];
      exit = (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (activateOnSuccess) {
              atom.packages.activatePackage(name);
            } else {
              atom.packages.loadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('updated', pack);
          } else {
            if (activateOnFailure) {
              atom.packages.activatePackage(name);
            }
            error = new Error("Updating to \u201C" + name + "@" + newVersion + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            error.packageInstallError = !theme;
            _this.emitPackageEvent('update-failed', pack, error);
            return callback(error);
          }
        };
      })(this);
      this.emit('package-updating', pack);
      return this.runCommand(args, exit);
    };

    PackageManager.prototype.install = function(pack, callback) {
      var activateOnFailure, activateOnSuccess, args, exit, name, theme, version;
      name = pack.name, version = pack.version, theme = pack.theme;
      activateOnSuccess = !theme && !atom.packages.isPackageDisabled(name);
      activateOnFailure = atom.packages.isPackageActive(name);
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      if (atom.packages.isPackageLoaded(name)) {
        atom.packages.unloadPackage(name);
      }
      args = ['install', "" + name + "@" + version];
      exit = (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (activateOnSuccess) {
              atom.packages.activatePackage(name);
            } else {
              atom.packages.loadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('installed', pack);
          } else {
            if (activateOnFailure) {
              atom.packages.activatePackage(name);
            }
            error = new Error("Installing \u201C" + name + "@" + version + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            error.packageInstallError = !theme;
            _this.emitPackageEvent('install-failed', pack, error);
            return callback(error);
          }
        };
      })(this);
      return this.runCommand(args, exit);
    };

    PackageManager.prototype.uninstall = function(pack, callback) {
      var name;
      name = pack.name;
      if (atom.packages.isPackageActive(name)) {
        atom.packages.deactivatePackage(name);
      }
      return this.runCommand(['uninstall', '--hard', name], (function(_this) {
        return function(code, stdout, stderr) {
          var error;
          if (code === 0) {
            if (atom.packages.isPackageLoaded(name)) {
              atom.packages.unloadPackage(name);
            }
            if (typeof callback === "function") {
              callback();
            }
            return _this.emitPackageEvent('uninstalled', pack);
          } else {
            error = new Error("Uninstalling \u201C" + name + "\u201D failed.");
            error.stdout = stdout;
            error.stderr = stderr;
            _this.emitPackageEvent('uninstall-failed', pack, error);
            return callback(error);
          }
        };
      })(this));
    };

    PackageManager.prototype.canUpgrade = function(installedPackage, availableVersion) {
      var installedVersion;
      if (installedPackage == null) {
        return false;
      }
      installedVersion = installedPackage.metadata.version;
      if (!semver.valid(installedVersion)) {
        return false;
      }
      if (!semver.valid(availableVersion)) {
        return false;
      }
      return semver.gt(availableVersion, installedVersion);
    };

    PackageManager.prototype.getPackageTitle = function(_arg) {
      var name;
      name = _arg.name;
      return _.undasherize(_.uncamelcase(name));
    };

    PackageManager.prototype.getRepositoryUrl = function(_arg) {
      var metadata, repoUrl, repository, _ref, _ref1;
      metadata = _arg.metadata;
      repository = metadata.repository;
      repoUrl = (_ref = (_ref1 = repository != null ? repository.url : void 0) != null ? _ref1 : repository) != null ? _ref : '';
      return repoUrl.replace(/\.git$/, '').replace(/\/+$/, '');
    };

    PackageManager.prototype.getAuthorUserName = function(pack) {
      var chunks, repoName, repoUrl;
      if (!(repoUrl = this.getRepositoryUrl(pack))) {
        return null;
      }
      repoName = url.parse(repoUrl).pathname;
      chunks = repoName.match('/(.+?)/');
      return chunks != null ? chunks[1] : void 0;
    };

    PackageManager.prototype.checkNativeBuildTools = function() {
      var deferred;
      deferred = Q.defer();
      this.runCommand(['install', '--check'], function(code, stdout, stderr) {
        if (code === 0) {
          return deferred.resolve();
        } else {
          return deferred.reject(new Error());
        }
      });
      return deferred.promise;
    };

    PackageManager.prototype.emitPackageEvent = function(eventName, pack, error) {
      var theme, _ref, _ref1;
      theme = (_ref = pack.theme) != null ? _ref : (_ref1 = pack.metadata) != null ? _ref1.theme : void 0;
      eventName = theme ? "theme-" + eventName : "package-" + eventName;
      return this.emit(eventName, pack, error);
    };

    return PackageManager;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL3BhY2thZ2UtbWFuYWdlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsMkRBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsTUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFFQyxVQUFXLE9BQUEsQ0FBUSxVQUFSLEVBQVgsT0FGRCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBSEosQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUpULENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FMTixDQUFBOztBQUFBLEVBT0EsQ0FBQyxDQUFDLDhCQUFGLENBQUEsQ0FQQSxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsY0FBcEIsQ0FBQSxDQUFBOztBQUVhLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsRUFBbkIsQ0FEVztJQUFBLENBRmI7O0FBQUEsNkJBS0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNWLFVBQUEsc0RBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQWQsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBYyxFQURkLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtlQUFXLFdBQVcsQ0FBQyxJQUFaLENBQWlCLEtBQWpC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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/lib/package-manager.coffee
