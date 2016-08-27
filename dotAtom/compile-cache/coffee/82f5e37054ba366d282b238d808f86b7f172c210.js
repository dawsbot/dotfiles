(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  fs = require('fs-plus');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(_super) {
    __extends(StatusListView, _super);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(this.parseData(this.data));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var line, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        line = files[_i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        _results.push({
          type: line[1],
          path: line[2]
        });
      }
      return _results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(_arg) {
      var getIcon, path, type;
      type = _arg.type, path = _arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(_arg) {
      var fullPath, openFile, path, type;
      type = _arg.type, path = _arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zdGF0dXMtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FBTCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw2QkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBO0FBQUEsTUFBQSxnREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsSUFBWixDQUFWLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSlU7SUFBQSxDQUFaLENBQUE7O0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/status-list-view.coffee
