(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BufferedProcess = require('atom').BufferedProcess;

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(_super) {
    __extends(TagListView, _super);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.data.reverse();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_/.]+)\s(.*)/);
            _results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return _results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(_arg) {
      var annotation, tag;
      tag = _arg.tag, annotation = _arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(_arg) {
      var tag;
      tag = _arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy90YWctbGlzdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4RUFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUEsRUFBRCxFQUFLLHNCQUFBLGNBREwsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUpoQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsc0JBQUEsT0FBSyxFQUN4QixDQUFBO0FBQUEsTUFBQSw2Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsU0FBRCxDQUFBLEVBSFU7SUFBQSxDQUFaLENBQUE7O0FBQUEsMEJBS0EsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsZ0JBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWixDQUFr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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/tag-list-view.coffee
