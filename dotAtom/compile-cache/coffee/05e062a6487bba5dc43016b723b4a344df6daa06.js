(function() {
  var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(_super) {
    __extends(SelectStageHunks, _super);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patchPath, patch_full;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      items.forEach(function(item) {
        return patch_full += (item != null ? item.patch : void 0);
      });
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      return fs.writeFile(patchPath, patch_full, {
        flag: 'w+'
      }, (function(_this) {
        return function(err) {
          if (!err) {
            return git.cmd(['apply', '--cached', '--', patchPath], {
              cwd: _this.repo.getWorkingDirectory()
            }).then(function(data) {
              data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
              notifier.addSuccess(data);
              try {
                return fs.unlink(patchPath);
              } catch (_error) {}
            });
          } else {
            return notifier.addError(err);
          }
        };
      })(this));
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        hunk = data[_i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        _results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return _results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3Qtc3RhZ2UtaHVua3Mtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxPQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQURKLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUixDQUx6QixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVEsSUFBUixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLGtEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFLLENBQUEsQ0FBQSxDQURyQixDQUFBO0FBRUEsTUFBQSxJQUFrRCxJQUFJLENBQUMsTUFBTCxLQUFlLENBQWpFO0FBQUEsZUFBTyxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFLLFNBQXZCLENBQVgsQ0FBUCxDQUFBO09BRkE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsUUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/select-stage-hunks-view.coffee
