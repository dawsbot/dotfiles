(function() {
  var $$, CompositeDisposable, Emitter, ScriptInputView, View, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $$ = _ref1.$$, View = _ref1.View;

  module.exports = ScriptInputView = (function(_super) {
    __extends(ScriptInputView, _super);

    function ScriptInputView() {
      return ScriptInputView.__super__.constructor.apply(this, arguments);
    }

    ScriptInputView.content = function() {
      return this.div({
        "class": 'script-input-view'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'caption'
          }, '');
          return _this.tag('atom-text-editor', {
            mini: '',
            "class": 'editor mini'
          });
        };
      })(this));
    };

    ScriptInputView.prototype.initialize = function(options) {
      this.options = options;
      this.emitter = new Emitter;
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.hide();
      this.editor = this.find('atom-text-editor').get(0).getModel();
      if (this.options["default"]) {
        this.editor.setText(this.options["default"]);
        this.editor.selectAll();
      }
      if (this.options.caption) {
        this.find('.caption').text(this.options.caption);
      }
      this.find('atom-text-editor').on('keydown', (function(_this) {
        return function(e) {
          if (e.keyCode === 27) {
            e.stopPropagation();
            _this.emitter.emit('on-cancel');
            return _this.hide();
          }
        };
      })(this));
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:confirm': (function(_this) {
          return function() {
            _this.emitter.emit('on-confirm', _this.editor.getText().trim());
            return _this.hide();
          };
        })(this)
      }));
    };

    ScriptInputView.prototype.onConfirm = function(callback) {
      return this.emitter.on('on-confirm', callback);
    };

    ScriptInputView.prototype.onCancel = function(callback) {
      return this.emitter.on('on-cancel', callback);
    };

    ScriptInputView.prototype.focus = function() {
      return this.find('atom-text-editor').focus();
    };

    ScriptInputView.prototype.show = function() {
      this.panel.show();
      return this.focus();
    };

    ScriptInputView.prototype.hide = function() {
      this.panel.hide();
      return this.destroy();
    };

    ScriptInputView.prototype.destroy = function() {
      var _ref2;
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.panel.destroy();
    };

    return ScriptInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LWlucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLGVBQUEsT0FBRCxFQUFVLDJCQUFBLG1CQUFWLENBQUE7O0FBQUEsRUFDQSxRQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsV0FBQSxFQUFELEVBQUssYUFBQSxJQURMLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sbUJBQVA7T0FBTCxFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQy9CLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixFQUF2QixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxrQkFBTCxFQUF5QjtBQUFBLFlBQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxZQUFVLE9BQUEsRUFBTyxhQUFqQjtXQUF6QixFQUYrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsOEJBS0EsVUFBQSxHQUFZLFNBQUUsT0FBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsVUFBQSxPQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/script-input-view.coffee
