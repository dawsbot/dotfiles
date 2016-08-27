(function() {
  var $$, GitShow, RemoteListView, SelectListView, TagView, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  notifier = require('../notifier');

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(_super) {
    __extends(TagView, _super);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag) {
      this.repo = repo;
      this.tag = tag;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(_arg) {
      var cmd, description, tag;
      tag = _arg.tag, cmd = _arg.cmd, description = _arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, "" + description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(_arg) {
      var args, cmd, tag;
      tag = _arg.tag, cmd = _arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git.cmd(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteListView(_this.repo, data, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        })["catch"](function(msg) {
          return notifier.addWarning(msg);
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy90YWctdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUVBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBQUwsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSLENBSFYsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUixDQUxqQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsR0FBVCxHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsTUFBQSxHQUNuQixDQUFBO0FBQUEsTUFBQSx5Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBSFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsc0JBS0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLE1BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVztBQUFBLFFBQUMsR0FBQSxFQUFLLElBQUMsQ0FB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/tag-view.coffee
