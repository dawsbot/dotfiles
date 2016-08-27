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
      return git.cmd(['add', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        if (data === '') {
          return notifier.addSuccess('File(s) staged successfully');
        } else {
          return notifier.addSuccess(data);
        }
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3Qtc3RhZ2UtZmlsZXMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0VBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSLENBSnpCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosMkNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLG1DQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUSxLQUFSLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsc0RBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFKVTtJQUFBLENBQVosQ0FBQTs7QUFBQSxtQ0FNQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBTmQsQ0FBQTs7QUFBQSxtQ0FRQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUEsR0FBQTtlQUNkLElBQUMsQ0FBQSxH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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/select-stage-files-view.coffee
