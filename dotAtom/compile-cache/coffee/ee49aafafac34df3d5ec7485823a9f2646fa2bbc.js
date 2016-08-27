(function() {
  var BufferedProcess, DESCRIPTION, ForkGistIdInputView, GitHubApi, PackageManager, REMOVE_KEYS, SyncSettings, Tracker, fs, _, _ref,
    __hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs');

  _ = require('underscore-plus');

  _ref = [], GitHubApi = _ref[0], PackageManager = _ref[1], Tracker = _ref[2];

  ForkGistIdInputView = null;

  DESCRIPTION = 'Atom configuration storage operated by http://atom.io/packages/sync-settings';

  REMOVE_KEYS = ['sync-settings.gistId', 'sync-settings.personalAccessToken', 'sync-settings._analyticsUserId', 'sync-settings._lastBackupHash'];

  SyncSettings = {
    config: require('./config.coffee'),
    activate: function() {
      return setImmediate((function(_this) {
        return function() {
          var mandatorySettingsApplied;
          if (GitHubApi == null) {
            GitHubApi = require('github4');
          }
          if (PackageManager == null) {
            PackageManager = require('./package-manager');
          }
          if (Tracker == null) {
            Tracker = require('./tracker');
          }
          atom.commands.add('atom-workspace', "sync-settings:backup", function() {
            _this.backup();
            return _this.tracker.track('Backup');
          });
          atom.commands.add('atom-workspace', "sync-settings:restore", function() {
            _this.restore();
            return _this.tracker.track('Restore');
          });
          atom.commands.add('atom-workspace', "sync-settings:view-backup", function() {
            _this.viewBackup();
            return _this.tracker.track('View backup');
          });
          atom.commands.add('atom-workspace', "sync-settings:check-backup", function() {
            _this.checkForUpdate();
            return _this.tracker.track('Check backup');
          });
          atom.commands.add('atom-workspace', "sync-settings:fork", function() {
            return _this.inputForkGistId();
          });
          mandatorySettingsApplied = _this.checkMandatorySettings();
          if (atom.config.get('sync-settings.checkForUpdatedBackup') && mandatorySettingsApplied) {
            _this.checkForUpdate();
          }
          _this.tracker = new Tracker('sync-settings._analyticsUserId', 'sync-settings.analytics');
          return _this.tracker.trackActivate();
        };
      })(this));
    },
    deactivate: function() {
      var _ref1;
      if ((_ref1 = this.inputView) != null) {
        _ref1.destroy();
      }
      return this.tracker.trackDeactivate();
    },
    serialize: function() {},
    getGistId: function() {
      var gistId;
      gistId = atom.config.get('sync-settings.gistId');
      if (gistId) {
        gistId = gistId.trim();
      }
      return gistId;
    },
    getPersonalAccessToken: function() {
      var token;
      token = atom.config.get('sync-settings.personalAccessToken');
      if (token) {
        token = token.trim();
      }
      return token;
    },
    checkMandatorySettings: function() {
      var missingSettings;
      missingSettings = [];
      if (!this.getGistId()) {
        missingSettings.push("Gist ID");
      }
      if (!this.getPersonalAccessToken()) {
        missingSettings.push("GitHub personal access token");
      }
      if (missingSettings.length) {
        this.notifyMissingMandatorySettings(missingSettings);
      }
      return missingSettings.length === 0;
    },
    checkForUpdate: function(cb) {
      if (cb == null) {
        cb = null;
      }
      if (this.getGistId()) {
        console.debug('checking latest backup...');
        return this.createClient().gists.get({
          id: this.getGistId()
        }, (function(_this) {
          return function(err, res) {
            var SyntaxError, message;
            console.debug(err, res);
            if (err) {
              console.error("error while retrieving the gist. does it exists?", err);
              try {
                message = JSON.parse(err.message).message;
                if (message === 'Not Found') {
                  message = 'Gist ID Not Found';
                }
              } catch (_error) {
                SyntaxError = _error;
                message = err.message;
              }
              atom.notifications.addError("sync-settings: Error retrieving your settings. (" + message + ")");
              return typeof cb === "function" ? cb() : void 0;
            }
            console.debug("latest backup version " + res.history[0].version);
            if (res.history[0].version !== atom.config.get('sync-settings._lastBackupHash')) {
              _this.notifyNewerBackup();
            } else if (!atom.config.get('sync-settings.quietUpdateCheck')) {
              _this.notifyBackupUptodate();
            }
            return typeof cb === "function" ? cb() : void 0;
          };
        })(this));
      } else {
        return this.notifyMissingMandatorySettings(["Gist ID"]);
      }
    },
    notifyNewerBackup: function() {
      var notification, workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      return notification = atom.notifications.addWarning("sync-settings: Your settings are out of date.", {
        dismissable: true,
        buttons: [
          {
            text: "Backup",
            onDidClick: function() {
              atom.commands.dispatch(workspaceElement, "sync-settings:backup");
              return notification.dismiss();
            }
          }, {
            text: "View backup",
            onDidClick: function() {
              return atom.commands.dispatch(workspaceElement, "sync-settings:view-backup");
            }
          }, {
            text: "Restore",
            onDidClick: function() {
              atom.commands.dispatch(workspaceElement, "sync-settings:restore");
              return notification.dismiss();
            }
          }, {
            text: "Dismiss",
            onDidClick: function() {
              return notification.dismiss();
            }
          }
        ]
      });
    },
    notifyBackupUptodate: function() {
      return atom.notifications.addSuccess("sync-settings: Latest backup is already applied.");
    },
    notifyMissingMandatorySettings: function(missingSettings) {
      var context, errorMsg, notification;
      context = this;
      errorMsg = "sync-settings: Mandatory settings missing: " + missingSettings.join(', ');
      return notification = atom.notifications.addError(errorMsg, {
        dismissable: true,
        buttons: [
          {
            text: "Package settings",
            onDidClick: function() {
              context.goToPackageSettings();
              return notification.dismiss();
            }
          }
        ]
      });
    },
    backup: function(cb) {
      var cmtend, cmtstart, ext, file, files, _i, _len, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      if (cb == null) {
        cb = null;
      }
      files = {};
      if (atom.config.get('sync-settings.syncSettings')) {
        files["settings.json"] = {
          content: this.getFilteredSettings()
        };
      }
      if (atom.config.get('sync-settings.syncPackages')) {
        files["packages.json"] = {
          content: JSON.stringify(this.getPackages(), null, '\t')
        };
      }
      if (atom.config.get('sync-settings.syncKeymap')) {
        files["keymap.cson"] = {
          content: (_ref1 = this.fileContent(atom.keymaps.getUserKeymapPath())) != null ? _ref1 : "# keymap file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncStyles')) {
        files["styles.less"] = {
          content: (_ref2 = this.fileContent(atom.styles.getUserStyleSheetPath())) != null ? _ref2 : "// styles file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncInit')) {
        files["init.coffee"] = {
          content: (_ref3 = this.fileContent(atom.config.configDirPath + "/init.coffee")) != null ? _ref3 : "# initialization file (not found)"
        };
      }
      if (atom.config.get('sync-settings.syncSnippets')) {
        files["snippets.cson"] = {
          content: (_ref4 = this.fileContent(atom.config.configDirPath + "/snippets.cson")) != null ? _ref4 : "# snippets file (not found)"
        };
      }
      _ref6 = (_ref5 = atom.config.get('sync-settings.extraFiles')) != null ? _ref5 : [];
      for (_i = 0, _len = _ref6.length; _i < _len; _i++) {
        file = _ref6[_i];
        ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        cmtstart = "#";
        if (ext === ".less" || ext === ".scss" || ext === ".js") {
          cmtstart = "//";
        }
        if (ext === ".css") {
          cmtstart = "/*";
        }
        cmtend = "";
        if (ext === ".css") {
          cmtend = "*/";
        }
        files[file] = {
          content: (_ref7 = this.fileContent(atom.config.configDirPath + ("/" + file))) != null ? _ref7 : "" + cmtstart + " " + file + " (not found) " + cmtend
        };
      }
      return this.createClient().gists.edit({
        id: this.getGistId(),
        description: atom.config.get('sync-settings.gistDescription'),
        files: files
      }, function(err, res) {
        var message;
        if (err) {
          console.error("error backing up data: " + err.message, err);
          message = JSON.parse(err.message).message;
          if (message === 'Not Found') {
            message = 'Gist ID Not Found';
          }
          atom.notifications.addError("sync-settings: Error backing up your settings. (" + message + ")");
        } else {
          atom.config.set('sync-settings._lastBackupHash', res.history[0].version);
          atom.notifications.addSuccess("sync-settings: Your settings were successfully backed up. <br/><a href='" + res.html_url + "'>Click here to open your Gist.</a>");
        }
        return typeof cb === "function" ? cb(err, res) : void 0;
      });
    },
    viewBackup: function() {
      var Shell, gistId;
      Shell = require('shell');
      gistId = this.getGistId();
      return Shell.openExternal("https://gist.github.com/" + gistId);
    },
    getPackages: function() {
      var info, name, packages, theme, version, _ref1, _ref2;
      packages = [];
      _ref1 = atom.packages.getLoadedPackages();
      for (name in _ref1) {
        if (!__hasProp.call(_ref1, name)) continue;
        info = _ref1[name];
        _ref2 = info.metadata, name = _ref2.name, version = _ref2.version, theme = _ref2.theme;
        packages.push({
          name: name,
          version: version,
          theme: theme
        });
      }
      return _.sortBy(packages, 'name');
    },
    restore: function(cb) {
      if (cb == null) {
        cb = null;
      }
      return this.createClient().gists.get({
        id: this.getGistId()
      }, (function(_this) {
        return function(err, res) {
          var callbackAsync, file, filename, message, _ref1;
          if (err) {
            console.error("error while retrieving the gist. does it exists?", err);
            message = JSON.parse(err.message).message;
            if (message === 'Not Found') {
              message = 'Gist ID Not Found';
            }
            atom.notifications.addError("sync-settings: Error retrieving your settings. (" + message + ")");
            return;
          }
          callbackAsync = false;
          _ref1 = res.files;
          for (filename in _ref1) {
            if (!__hasProp.call(_ref1, filename)) continue;
            file = _ref1[filename];
            switch (filename) {
              case 'settings.json':
                if (atom.config.get('sync-settings.syncSettings')) {
                  _this.applySettings('', JSON.parse(file.content));
                }
                break;
              case 'packages.json':
                if (atom.config.get('sync-settings.syncPackages')) {
                  callbackAsync = true;
                  _this.installMissingPackages(JSON.parse(file.content), cb);
                }
                break;
              case 'keymap.cson':
                if (atom.config.get('sync-settings.syncKeymap')) {
                  fs.writeFileSync(atom.keymaps.getUserKeymapPath(), file.content);
                }
                break;
              case 'styles.less':
                if (atom.config.get('sync-settings.syncStyles')) {
                  fs.writeFileSync(atom.styles.getUserStyleSheetPath(), file.content);
                }
                break;
              case 'init.coffee':
                if (atom.config.get('sync-settings.syncInit')) {
                  fs.writeFileSync(atom.config.configDirPath + "/init.coffee", file.content);
                }
                break;
              case 'snippets.cson':
                if (atom.config.get('sync-settings.syncSnippets')) {
                  fs.writeFileSync(atom.config.configDirPath + "/snippets.cson", file.content);
                }
                break;
              default:
                fs.writeFileSync("" + atom.config.configDirPath + "/" + filename, file.content);
            }
          }
          atom.config.set('sync-settings._lastBackupHash', res.history[0].version);
          atom.notifications.addSuccess("sync-settings: Your settings were successfully synchronized.");
          if (!callbackAsync) {
            return typeof cb === "function" ? cb() : void 0;
          }
        };
      })(this));
    },
    createClient: function() {
      var github, token;
      token = this.getPersonalAccessToken();
      console.debug("Creating GitHubApi client with token = " + token);
      github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
      });
      github.authenticate({
        type: 'oauth',
        token: token
      });
      return github;
    },
    getFilteredSettings: function() {
      var blacklistedKey, blacklistedKeys, settings, _i, _len, _ref1;
      settings = JSON.parse(JSON.stringify(atom.config.settings));
      blacklistedKeys = REMOVE_KEYS.concat((_ref1 = atom.config.get('sync-settings.blacklistedKeys')) != null ? _ref1 : []);
      for (_i = 0, _len = blacklistedKeys.length; _i < _len; _i++) {
        blacklistedKey = blacklistedKeys[_i];
        blacklistedKey = blacklistedKey.split(".");
        this._removeProperty(settings, blacklistedKey);
      }
      return JSON.stringify(settings, null, '\t');
    },
    _removeProperty: function(obj, key) {
      var currentKey, lastKey;
      lastKey = key.length === 1;
      currentKey = key.shift();
      if (!lastKey && _.isObject(obj[currentKey]) && !_.isArray(obj[currentKey])) {
        return this._removeProperty(obj[currentKey], key);
      } else {
        return delete obj[currentKey];
      }
    },
    goToPackageSettings: function() {
      return atom.workspace.open("atom://config/packages/sync-settings");
    },
    applySettings: function(pref, settings) {
      var colorKeys, isColor, key, keyPath, value, valueKeys, _results;
      _results = [];
      for (key in settings) {
        value = settings[key];
        keyPath = "" + pref + "." + key;
        isColor = false;
        if (_.isObject(value)) {
          valueKeys = Object.keys(value);
          colorKeys = ['alpha', 'blue', 'green', 'red'];
          isColor = _.isEqual(_.sortBy(valueKeys), colorKeys);
        }
        if (_.isObject(value) && !_.isArray(value) && !isColor) {
          _results.push(this.applySettings(keyPath, value));
        } else {
          console.debug("config.set " + keyPath.slice(1) + "=" + value);
          _results.push(atom.config.set(keyPath.slice(1), value));
        }
      }
      return _results;
    },
    installMissingPackages: function(packages, cb) {
      var pending, pkg, _i, _len;
      pending = 0;
      for (_i = 0, _len = packages.length; _i < _len; _i++) {
        pkg = packages[_i];
        if (atom.packages.isPackageLoaded(pkg.name)) {
          continue;
        }
        pending++;
        this.installPackage(pkg, function() {
          pending--;
          if (pending === 0) {
            return typeof cb === "function" ? cb() : void 0;
          }
        });
      }
      if (pending === 0) {
        return typeof cb === "function" ? cb() : void 0;
      }
    },
    installPackage: function(pack, cb) {
      var packageManager, type;
      type = pack.theme ? 'theme' : 'package';
      console.info("Installing " + type + " " + pack.name + "...");
      packageManager = new PackageManager();
      return packageManager.install(pack, function(error) {
        var _ref1;
        if (error != null) {
          console.error("Installing " + type + " " + pack.name + " failed", (_ref1 = error.stack) != null ? _ref1 : error, error.stderr);
        } else {
          console.info("Installed " + type + " " + pack.name);
        }
        return typeof cb === "function" ? cb(error) : void 0;
      });
    },
    fileContent: function(filePath) {
      var e;
      try {
        return fs.readFileSync(filePath, {
          encoding: 'utf8'
        }) || null;
      } catch (_error) {
        e = _error;
        console.error("Error reading file " + filePath + ". Probably doesn't exist.", e);
        return null;
      }
    },
    inputForkGistId: function() {
      if (ForkGistIdInputView == null) {
        ForkGistIdInputView = require('./fork-gistid-input-view');
      }
      this.inputView = new ForkGistIdInputView();
      return this.inputView.setCallbackInstance(this);
    },
    forkGistId: function(forkId) {
      this.tracker.track('Fork');
      return this.createClient().gists.fork({
        id: forkId
      }, (function(_this) {
        return function(err, res) {
          var SyntaxError, message;
          if (err) {
            try {
              message = JSON.parse(err.message).message;
              if (message === "Not Found") {
                message = "Gist ID Not Found";
              }
            } catch (_error) {
              SyntaxError = _error;
              message = err.message;
            }
            atom.notifications.addError("sync-settings: Error forking settings. (" + message + ")");
            return typeof cb === "function" ? cb() : void 0;
          }
          if (res.id) {
            atom.config.set("sync-settings.gistId", res.id);
            atom.notifications.addSuccess("sync-settings: Forked successfully to the new Gist ID " + res.id + " which has been saved to your config.");
          } else {
            atom.notifications.addError("sync-settings: Error forking settings");
          }
          return typeof cb === "function" ? cb() : void 0;
        };
      })(this));
    }
  };

  module.exports = SyncSettings;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL3N5bmMtc2V0dGluZ3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLDZIQUFBO0lBQUEsNkJBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsT0FBdUMsRUFBdkMsRUFBQyxtQkFBRCxFQUFZLHdCQUFaLEVBQTRCLGlCQUg1QixDQUFBOztBQUFBLEVBSUEsbUJBQUEsR0FBc0IsSUFKdEIsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyw4RUFQZCxDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLENBQ1osc0JBRFksRUFFWixtQ0FGWSxFQUdaLGdDQUhZLEVBSVosK0JBSlksQ0FSZCxDQUFBOztBQUFBLEVBZUEsWUFBQSxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsT0FBQSxDQUFRLGlCQUFSLENBQVI7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7YUFFUixZQUFBLENBQWEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUVYLGNBQUEsd0JBQUE7O1lBQUEsWUFBYSxPQUFBLENBQVEsU0FBUjtXQUFiOztZQUNBLGlCQUFrQixPQUFBLENBQVEsbUJBQVI7V0FEbEI7O1lBRUEsVUFBVyxPQUFBLENBQVEsV0FBUjtXQUZYO0FBQUEsVUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHNCQUFwQyxFQUE0RCxTQUFBLEdBQUE7QUFDMUQs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/lib/sync-settings.coffee
