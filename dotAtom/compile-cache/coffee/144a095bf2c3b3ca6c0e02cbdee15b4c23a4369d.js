(function() {
  var $$, ListView, OutputViewManager, SelectListView, fs, git, notifier, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  git = require('../git');

  OutputViewManager = require('../output-view-manager');

  notifier = require('../notifier');

  module.exports = ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, item, items, _i, _len;
      items = this.data.split("\n");
      branches = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(_arg) {
      var current, name;
      name = _arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(_arg) {
      var name;
      name = _arg.name;
      this.merge(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.merge = function(branch) {
      return git.cmd(['merge', branch], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        OutputViewManager.create().addLine(data).finish();
        atom.workspace.getTextEditors().forEach(function(editor) {
          return fs.exists(editor.getPath(), function(exist) {
            if (!exist) {
              return editor.destroy();
            }
          });
        });
        return git.refresh();
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9tZXJnZS1saXN0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsT0FBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsVUFBQSxFQUFELEVBQUssc0JBQUEsY0FETCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx3QkFBUixDQUhwQixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsdUJBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFTLElBQVQsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFEa0IsSUFBQyxDQUFBLE9BQUEsSUFDbkIsQ0FBQTtBQUFBLE1BQUEsMENBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxFQUhVO0lBQUEsQ0FBWixDQUFBOztBQUFBLHVCQUtBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLCtCQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixDQUFSLENBQUE7QUFBQSxNQUNBLFFBQUEs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/merge-list-view.coffee
