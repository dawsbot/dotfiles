(function() {
  var $, $$, SelectListMultipleView, SelectStageFilesView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(_super) {
    __extends(SelectStageFilesView, _super);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.getFilterKey = function() {
      return 'path';
    };

    SelectStageFilesView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'select-list-buttons'
        }, (function(_this) {
          return function() {
            _this.div(function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.div(function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-unstage-button'
              }, 'Unstage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-unstage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right'
            }, function() {
              return _this.span({
                "class": 'inline-block highlight'
              }, item.mode);
            });
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item.path);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var files, item;
      files = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          _results.push(item.path);
        }
        return _results;
      })();
      this.cancel();
      return git.cmd(['reset', 'HEAD', '--'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        return notifier.addSuccess(msg);
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3QtdW5zdGFnZS1maWxlcy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FKekIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFRLEtBQVIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSxzREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpVO0lBQUEsQ0FBWixDQUFBOztBQUFBLG1DQU1BLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixPQURZO0lBQUEsQ0FOZCxDQUFBOztBQUFBLG1DQVNBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxFQUFBLENBQUcsU0FBQSxHQUFBO2VBQ2QsSUFBQyxDQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/select-unstage-files-view.coffee
