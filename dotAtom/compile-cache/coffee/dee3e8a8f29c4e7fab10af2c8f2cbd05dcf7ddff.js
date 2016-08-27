(function() {
  var $, BufferedProcess, CompositeDisposable, Os, Path, TagCreateView, TextEditorView, View, fs, git, notifier, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  _ref = require('atom'), BufferedProcess = _ref.BufferedProcess, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, TextEditorView = _ref1.TextEditorView, View = _ref1.View;

  notifier = require('../notifier');

  git = require('../git');

  module.exports = TagCreateView = (function(_super) {
    __extends(TagCreateView, _super);

    function TagCreateView() {
      return TagCreateView.__super__.constructor.apply(this, arguments);
    }

    TagCreateView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagName', new TextEditorView({
              mini: true,
              placeholderText: 'Tag'
            }));
          });
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagMessage', new TextEditorView({
              mini: true,
              placeholderText: 'Annotation message'
            }));
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight gp-confirm-button',
                click: 'createTag'
              }, 'Create Tag');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight gp-cancel-button',
                click: 'destroy'
              }, 'Cancel');
            });
          });
        };
      })(this));
    };

    TagCreateView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.tagName.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.createTag();
          };
        })(this)
      }));
    };

    TagCreateView.prototype.createTag = function() {
      var tag;
      tag = {
        name: this.tagName.getModel().getText(),
        message: this.tagMessage.getModel().getText()
      };
      git.cmd(['tag', '-a', tag.name, '-m', tag.message], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(success) {
        if (success) {
          return notifier.addSuccess("Tag '" + tag.name + "' has been created successfully!");
        }
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
      return this.destroy();
    };

    TagCreateView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.panel) != null) {
        _ref2.destroy();
      }
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    return TagCreateView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy90YWctY3JlYXRlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxPQUF5QyxPQUFBLENBQVEsTUFBUixDQUF6QyxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsMkJBQUEsbUJBSmxCLENBQUE7O0FBQUEsRUFLQSxRQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxVQUFBLENBQUQsRUFBSSx1QkFBQSxjQUFKLEVBQW9CLGFBQUEsSUFMcEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQU5YLENBQUE7O0FBQUEsRUFPQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FQTixDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0gsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTttQkFDbkIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQXdCLElBQUEsY0FBQSxD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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/tag-create-view.coffee
