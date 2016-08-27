(function() {
  var $, CompositeDisposable, ForkGistIdInputView, TextEditorView, View, oldView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  oldView = null;

  module.exports = ForkGistIdInputView = (function(_super) {
    __extends(ForkGistIdInputView, _super);

    function ForkGistIdInputView() {
      return ForkGistIdInputView.__super__.constructor.apply(this, arguments);
    }

    ForkGistIdInputView.content = function() {
      return this.div({
        "class": 'command-palette'
      }, (function(_this) {
        return function() {
          return _this.subview('selectEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Gist ID to fork'
          }));
        };
      })(this));
    };

    ForkGistIdInputView.prototype.initialize = function() {
      if (oldView != null) {
        oldView.destroy();
      }
      oldView = this;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function() {
          return _this.confirm();
        };
      })(this)));
      this.disposables.add(atom.commands.add('atom-text-editor', 'core:cancel', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      return this.attach();
    };

    ForkGistIdInputView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    ForkGistIdInputView.prototype.attach = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.selectEditor.focus();
    };

    ForkGistIdInputView.prototype.detach = function() {
      this.panel.destroy();
      return ForkGistIdInputView.__super__.detach.apply(this, arguments);
    };

    ForkGistIdInputView.prototype.confirm = function() {
      var gistId;
      gistId = this.selectEditor.getText();
      this.callbackInstance.forkGistId(gistId);
      return this.destroy();
    };

    ForkGistIdInputView.prototype.setCallbackInstance = function(callbackInstance) {
      return this.callbackInstance = callbackInstance;
    };

    return ForkGistIdInputView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3N5bmMtc2V0dGluZ3MvbGliL2ZvcmstZ2lzdGlkLWlucHV0LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQURwQixDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLElBSFYsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiwwQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxtQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8saUJBQVA7T0FBTCxFQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM3QixLQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQsRUFBNkIsSUFBQSxjQUFBLENBQWU7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFBWSxlQUFBLEVBQWlCLGlCQUE3QjtXQUFmLENBQTdCLEVBRDZCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxrQ0FJQSxVQUFBLEdBQVksU0FBQSxHQUFBOztRQUNWLE9BQU8sQ0FBRSxPQUFULENBQUE7T0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLElBRFYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBSGYsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsY0FBdEMsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxDQUFqQixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGFBQXRDLEVBQXFELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckQsQ0FBakIsQ0FMQSxDQUFBO2FBTUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQVBVO0lBQUEsQ0FKWixDQUFBOztBQUFBLGtDQWFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGTztJQUFBLENBYlQsQ0FBQTs7QUFBQSxrQ0FpQkEsTUFBQSxHQUFRLFNBQUEsR0FBQTs7UUFDTixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7QUFBQSxVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCO09BQVY7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBLEVBSE07SUFBQSxDQWpCUixDQUFBOztBQUFBLGtDQXNCQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsQ0FBQSxDQUFBLENBQUE7YUFDQSxpREFBQSxTQUFBLEVBRk07SUFBQSxDQXRCUixDQUFBOztBQUFBLGtDQTBCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsVUFBbEIsQ0FBNkIsTUFBN0IsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQUhPO0lBQUEsQ0ExQlQsQ0FBQTs7QUFBQSxrQ0ErQkEsbUJBQUEsR0FBcUIsU0FBQyxnQkFBRCxHQUFBO2FBQ25CLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixpQkFERDtJQUFBLENBL0JyQixDQUFBOzsrQkFBQTs7S0FEZ0MsS0FOcEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/sync-settings/lib/fork-gistid-input-view.coffee
