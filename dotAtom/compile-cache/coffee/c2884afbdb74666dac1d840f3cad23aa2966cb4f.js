(function() {
  var $, $$, GitInit, GitPaletteView, GitPlusCommands, SelectListView, fuzzyFilter, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  GitPlusCommands = require('../git-plus-commands');

  GitInit = require('../models/git-init');

  fuzzyFilter = require('fuzzaldrin').filter;

  module.exports = GitPaletteView = (function(_super) {
    __extends(GitPaletteView, _super);

    function GitPaletteView() {
      return GitPaletteView.__super__.constructor.apply(this, arguments);
    }

    GitPaletteView.prototype.initialize = function() {
      GitPaletteView.__super__.initialize.apply(this, arguments);
      this.addClass('git-palette');
      return this.toggle();
    };

    GitPaletteView.prototype.getFilterKey = function() {
      return 'description';
    };

    GitPaletteView.prototype.cancelled = function() {
      return this.hide();
    };

    GitPaletteView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    GitPaletteView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.commandElement = this.previouslyFocusedElement;
      } else {
        this.commandElement = atom.views.getView(atom.workspace);
      }
      this.keyBindings = atom.keymaps.findKeyBindings({
        target: this.commandElement[0]
      });
      return GitPlusCommands().then((function(_this) {
        return function(commands) {
          commands = commands.map(function(c) {
            return {
              name: c[0],
              description: c[1],
              func: c[2]
            };
          });
          commands = _.sortBy(commands, 'name');
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          var commands;
          (commands = []).push({
            name: 'git-plus:init',
            description: 'Init',
            func: function() {
              return GitInit();
            }
          });
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this));
    };

    GitPaletteView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, options, _i, _ref1, _ref2, _ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          key: this.getFilterKey()
        };
        filteredItems = fuzzyFilter(this.items, filterQuery, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = _i = 0, _ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          item = (_ref2 = filteredItems[i].original) != null ? _ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (_ref3 = filteredItems[i].string) != null ? _ref3 : null));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    GitPaletteView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    GitPaletteView.prototype.viewForItem = function(_arg, matchedStr) {
      var description, name;
      name = _arg.name, description = _arg.description;
      return $$(function() {
        return this.li({
          "class": 'command',
          'data-command-name': name
        }, (function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(description);
            }
          };
        })(this));
      });
    };

    GitPaletteView.prototype.confirmed = function(_arg) {
      var func;
      func = _arg.func;
      this.cancel();
      return func();
    };

    return GitPaletteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9naXQtcGFsZXR0ZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUEwQixPQUFBLENBQVEsc0JBQVIsQ0FBMUIsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxzQkFBQSxjQURSLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxzQkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVIsQ0FBcUIsQ0FBQyxNQUpwQyxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw2QkFBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxnREFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxhQUFWLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIVTtJQUFBLENBQVosQ0FBQTs7QUFBQSw2QkFLQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osY0FEWTtJQUFBLENBTGQsQ0FBQTs7QUFBQSw2QkFRQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO0lBQUEsQ0FSWCxDQUFBOztBQUFBLDZCQVVBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLEtBQUE7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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/git-palette-view.coffee
