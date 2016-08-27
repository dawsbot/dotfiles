(function() {
  var $, PromptView, TextEditorView, View, method, noop, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  noop = function() {};

  method = function(delegate, method) {
    var _ref1;
    return (delegate != null ? (_ref1 = delegate[method]) != null ? _ref1.bind(delegate) : void 0 : void 0) || noop;
  };

  module.exports = PromptView = (function(_super) {
    __extends(PromptView, _super);

    function PromptView() {
      return PromptView.__super__.constructor.apply(this, arguments);
    }

    PromptView.attach = function() {
      return new PromptView;
    };

    PromptView.content = function() {
      return this.div({
        "class": 'emmet-prompt tool-panel panel-bottom'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'emmet-prompt__input'
          }, function() {
            return _this.subview('panelInput', new TextEditorView({
              mini: true
            }));
          });
        };
      })(this));
    };

    PromptView.prototype.initialize = function() {
      this.panelEditor = this.panelInput.getModel();
      this.panelEditor.onDidStopChanging((function(_this) {
        return function() {
          if (!_this.attached) {
            return;
          }
          return _this.handleUpdate(_this.panelEditor.getText());
        };
      })(this));
      atom.commands.add(this.panelInput.element, 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this));
      return atom.commands.add(this.panelInput.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.cancel();
        };
      })(this));
    };

    PromptView.prototype.show = function(delegate) {
      var text;
      this.delegate = delegate != null ? delegate : {};
      this.editor = this.delegate.editor;
      this.editorView = this.delegate.editorView;
      this.panelInput.element.setAttribute('placeholder', this.delegate.label || 'Enter abbreviation');
      this.updated = false;
      this.attach();
      text = this.panelEditor.getText();
      if (text) {
        this.panelEditor.selectAll();
        return this.handleUpdate(text);
      }
    };

    PromptView.prototype.undo = function() {
      if (this.updated) {
        return this.editor.undo();
      }
    };

    PromptView.prototype.handleUpdate = function(text) {
      this.undo();
      this.updated = true;
      return this.editor.transact((function(_this) {
        return function() {
          return method(_this.delegate, 'update')(text);
        };
      })(this));
    };

    PromptView.prototype.confirm = function() {
      this.handleUpdate(this.panelEditor.getText());
      this.trigger('confirm');
      method(this.delegate, 'confirm')();
      return this.detach();
    };

    PromptView.prototype.cancel = function() {
      this.undo();
      this.trigger('cancel');
      method(this.delegate, 'cancel')();
      return this.detach();
    };

    PromptView.prototype.detach = function() {
      var _ref1;
      if (!this.hasParent()) {
        return;
      }
      this.detaching = true;
      if ((_ref1 = this.prevPane) != null) {
        _ref1.activate();
      }
      PromptView.__super__.detach.apply(this, arguments);
      this.detaching = false;
      this.attached = false;
      this.trigger('detach');
      return method(this.delegate, 'hide')();
    };

    PromptView.prototype.attach = function() {
      this.attached = true;
      this.prevPane = atom.workspace.getActivePane();
      atom.workspace.addBottomPanel({
        item: this,
        visible: true
      });
      this.panelInput.focus();
      this.trigger('attach');
      return method(this.delegate, 'show')();
    };

    return PromptView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2VtbWV0L2xpYi9wcm9tcHQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFBLENBQUQsRUFBSSxzQkFBQSxjQUFKLEVBQW9CLFlBQUEsSUFBcEIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxTQUFBLEdBQUEsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLFNBQUMsUUFBRCxFQUFXLE1BQVgsR0FBQTtBQUNSLFFBQUEsS0FBQTt5RUFBaUIsQ0FBRSxJQUFuQixDQUF3QixRQUF4QixvQkFBQSxJQUFxQyxLQUQ3QjtFQUFBLENBSFQsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDTCxpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsTUFBRCxHQUFTLFNBQUEsR0FBQTthQUFHLEdBQUEsQ0FBQSxXQUFIO0lBQUEsQ0FBVCxDQUFBOztBQUFBLElBRUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sc0NBQVA7T0FBTCxFQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUVuRCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8scUJBQVA7V0FBTCxFQUFtQyxTQUFBLEdBQUE7bUJBQ2xDLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUEyQixJQUFBLGNBQUEsQ0FBZTtBQUFBLGNBQUEsSUFBQSxFQUFNLElBQU47YUFBZixDQUEzQixFQURrQztVQUFB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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/emmet/lib/prompt.coffee
