(function() {
  var $, $$, SelectListMultipleView, SelectListView, View, fuzzyFilter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fuzzyFilter = require('fuzzaldrin').filter;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, View = _ref.View, SelectListView = _ref.SelectListView;

  module.exports = SelectListMultipleView = (function(_super) {
    __extends(SelectListMultipleView, _super);

    function SelectListMultipleView() {
      return SelectListMultipleView.__super__.constructor.apply(this, arguments);
    }

    SelectListMultipleView.prototype.initialize = function() {
      SelectListMultipleView.__super__.initialize.apply(this, arguments);
      this.selectedItems = [];
      this.list.addClass('mark-active');
      this.on('mousedown', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.list[0] || $(target).hasClass('btn')) {
            return false;
          }
        };
      })(this));
      this.on('keypress', (function(_this) {
        return function(_arg) {
          var keyCode;
          keyCode = _arg.keyCode;
          if (keyCode === 13) {
            return _this.complete();
          }
        };
      })(this));
      return this.addButtons();
    };

    SelectListMultipleView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-complete-button'
              }, 'Confirm');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if ($(target).hasClass('btn-complete-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectListMultipleView.prototype.confirmSelection = function() {
      var item, viewItem;
      item = this.getSelectedItem();
      viewItem = this.getSelectedItemView();
      if (viewItem != null) {
        return this.confirmed(item, viewItem);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.confirmed = function(item, viewItem) {
      if (__indexOf.call(this.selectedItems, item) >= 0) {
        this.selectedItems = this.selectedItems.filter(function(i) {
          return i !== item;
        });
        return viewItem.removeClass('active');
      } else {
        this.selectedItems.push(item);
        return viewItem.addClass('active');
      }
    };

    SelectListMultipleView.prototype.complete = function() {
      if (this.selectedItems.length > 0) {
        return this.completed(this.selectedItems);
      } else {
        return this.cancel();
      }
    };

    SelectListMultipleView.prototype.populateList = function() {
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
          if (__indexOf.call(this.selectedItems, item) >= 0) {
            itemView.addClass('active');
          }
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    SelectListMultipleView.prototype.viewForItem = function(item, matchedStr) {
      throw new Error("Subclass must implement a viewForItem(item) method");
    };

    SelectListMultipleView.prototype.completed = function(items) {
      throw new Error("Subclass must implement a completed(items) method");
    };

    return SelectListMultipleView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRUFBQTtJQUFBOzt5SkFBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsWUFBUixDQUFxQixDQUFDLE1BQXBDLENBQUE7O0FBQUEsRUFDQSxPQUFnQyxPQUFBLENBQVEsc0JBQVIsQ0FBaEMsRUFBQyxTQUFBLENBQUQsRUFBSSxVQUFBLEVBQUosRUFBUSxZQUFBLElBQVIsRUFBYyxzQkFBQSxjQURkLENBQUE7O0FBQUEsRUFrQ0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUlKLDZDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxxQ0FBQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSx3REFBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsRUFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQWUsYUFBZixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxFQUFELENBQUksV0FBSixFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDZixjQUFBLE1BQUE7QUFBQSxVQURpQixTQUFELEtBQUMsTUFDakIsQ0FBQTtBQUFBLFVBQUEsSUFBUyxNQUFBLEtBQVUsS0FBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQWhCLElBQXNCLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLEtBQW5CLENBQS9CO21CQUFBLE1BQUE7V0FEZTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/select-list-multiple-view.coffee
