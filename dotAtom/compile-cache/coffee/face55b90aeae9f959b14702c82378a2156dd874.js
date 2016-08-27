(function() {
  var $, $$, EditorView, SelectListMultipleView, SelectStageFilesView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, EditorView = _ref.EditorView;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(_super) {
    var prettify;

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

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
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
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, _ref1;
      files = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (__indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return notifier.addSuccess("Removed " + (prettify(data)));
      });
    };

    prettify = function(data) {
      var file, i, _i, _len, _results;
      data = data.match(/rm ('.*')/g);
      if ((data != null ? data.length : void 0) >= 1) {
        _results = [];
        for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
          file = data[i];
          _results.push(data[i] = ' ' + file.match(/rm '(.*)'/)[1]);
        }
        return _results;
      }
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9yZW1vdmUtbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRkFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLE9BQXNCLE9BQUEsQ0FBUSxzQkFBUixDQUF0QixFQUFDLFNBQUEsQ0FBRCxFQUFJLFVBQUEsRUFBSixFQUFRLGtCQUFBLFVBQVIsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSLENBSnpCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosUUFBQSxRQUFBOztBQUFBLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVEsS0FBUixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLHNEQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSlU7SUFBQSxDQUFaLENBQUE7O0FBQUEsbUNBTUEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQUEsQ0FBRyxTQUFBLEdBQUE7ZUFDZCxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8s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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/remove-list-view.coffee
