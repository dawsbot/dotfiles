(function() {
  var $, $$, CherryPickSelectCommits, SelectListMultipleView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = CherryPickSelectCommits = (function(_super) {
    __extends(CherryPickSelectCommits, _super);

    function CherryPickSelectCommits() {
      return CherryPickSelectCommits.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectCommits.prototype.initialize = function(repo, data) {
      var item;
      this.repo = repo;
      CherryPickSelectCommits.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          item = data[_i];
          item = item.split('\n');
          _results.push({
            hash: item[0],
            author: item[1],
            time: item[2],
            subject: item[3]
          });
        }
        return _results;
      })());
      return this.focusFilterEditor();
    };

    CherryPickSelectCommits.prototype.getFilterKey = function() {
      return 'hash';
    };

    CherryPickSelectCommits.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-pick-button'
              }, 'Cherry-Pick!');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-pick-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    CherryPickSelectCommits.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectCommits.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectCommits.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    CherryPickSelectCommits.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight inline-block pull-right',
              style: 'font-family: monospace'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.hash);
              }
            });
            _this.div({
              "class": 'text-info'
            }, "" + item.author + ", " + item.time);
            return _this.div({
              "class": 'text-warning'
            }, item.subject);
          };
        })(this));
      });
    };

    CherryPickSelectCommits.prototype.completed = function(items) {
      var commits, item, _i, _len;
      this.cancel();
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        commits = item.hash;
      }
      return git.cmd(['cherry-pick'].concat(commits), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        return notifier.addSuccess(msg);
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return CherryPickSelectCommits;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtY29tbWl0cy12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyRUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVIsQ0FKekIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSiw4Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0NBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFRLElBQVIsR0FBQTtBQUNWLFVBQUEsSUFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSx5REFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxRQUFEOztBQUNFO2FBQUEsMkNBQUE7MEJBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBUCxDQUFBO0FBQUEsd0JBQ0E7QUFBQSxZQUFDLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFaO0FBQUEsWUFBZ0IsTUFBQSxFQUFRLElBQUssQ0FBQSxDQUFBLENBQTdCO0FBQUEsWUFBaUMsSUFBQSxFQUFNLElBQUssQ0FBQSxD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/cherry-pick-select-commits-view.coffee
