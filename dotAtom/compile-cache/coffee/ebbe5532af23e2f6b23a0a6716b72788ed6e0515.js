(function() {
  var ExViewModel, Input, ViewModel, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./view-model'), ViewModel = _ref.ViewModel, Input = _ref.Input;

  module.exports = ExViewModel = (function(_super) {
    __extends(ExViewModel, _super);

    function ExViewModel(exCommand) {
      this.exCommand = exCommand;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistoryEx = __bind(this.decreaseHistoryEx, this);
      this.increaseHistoryEx = __bind(this.increaseHistoryEx, this);
      ExViewModel.__super__.constructor.call(this, this.exCommand, {
        "class": 'command'
      });
      this.historyIndex = -1;
      atom.commands.add(this.view.editorElement, 'core:move-up', this.increaseHistoryEx);
      atom.commands.add(this.view.editorElement, 'core:move-down', this.decreaseHistoryEx);
    }

    ExViewModel.prototype.restoreHistory = function(index) {
      return this.view.editorElement.getModel().setText(this.history(index).value);
    };

    ExViewModel.prototype.history = function(index) {
      return this.exState.getExHistoryItem(index);
    };

    ExViewModel.prototype.increaseHistoryEx = function() {
      if (this.history(this.historyIndex + 1) != null) {
        this.historyIndex += 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    ExViewModel.prototype.decreaseHistoryEx = function() {
      if (this.historyIndex <= 0) {
        this.historyIndex = -1;
        return this.view.editorElement.getModel().setText('');
      } else {
        this.historyIndex -= 1;
        return this.restoreHistory(this.historyIndex);
      }
    };

    ExViewModel.prototype.confirm = function(view) {
      this.value = this.view.value;
      this.exState.pushExHistory(this);
      return ExViewModel.__super__.confirm.call(this, view);
    };

    return ExViewModel;

  })(ViewModel);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LXZpZXctbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLGNBQVIsQ0FBckIsRUFBQyxpQkFBQSxTQUFELEVBQVksYUFBQSxLQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBYSxJQUFBLHFCQUFFLFNBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFlBQUEsU0FDYixDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsTUFBQSw2Q0FBTSxJQUFDLENBQUEsU0FBUCxFQUFrQjtBQUFBLFFBQUEsT0FBQSxFQUFPLFNBQVA7T0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixDQUFBLENBRGhCLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsSUFBSSxDQUFDLGFBQXhCLEVBQXVDLGNBQXZDLEVBQXVELElBQUMsQ0FBQSxpQkFBeEQsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUF4QixFQUF1QyxnQkFBdkMsRUFBeUQsSUFBQyxDQUFBLGlCQUExRCxDQUpBLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQU9BLGNBQUEsR0FBZ0IsU0FBQyxLQUFELEdBQUE7YUFDZCxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFwQixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsSUFBQyxDQUFBLE9BQUQsQ0FBUyxLQUFULENBQWUsQ0FBQyxLQUF2RCxFQURjO0lBQUEsQ0FQaEIsQ0FBQTs7QUFBQSwwQkFVQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLEtBQTFCLEVBRE87SUFBQSxDQVZULENBQUE7O0FBQUEsMEJBYUEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBRywyQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFlBQUQsSUFBaUIsQ0FBakIsQ0FBQTtlQUNBLElBQUMsQ0FBQSxjQUFELENBQWdCLElBQUMsQ0FBQSxZQUFqQixFQUZGO09BRGlCO0lBQUEsQ0FibkIsQ0FBQTs7QUFBQSwwQkFrQkEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBRyxJQUFDLENBQUEsWUFBRCxJQUFpQixDQUFwQjtBQUVFLFFBQUEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQSxDQUFoQixDQUFBO2VBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBcEIsQ0FBQSxDQUE4QixDQUFDLE9BQS9CLENBQXVDLEVBQXZDLEVBSEY7T0FBQSxNQUFBO0FBS0UsUUFBQSxJQUFDLENBQUEsWUFBRCxJQUFpQixDQUFqQixDQUFBO2VBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQyxDQUFBLFlBQWpCLEVBTkY7T0FEaUI7SUFBQSxDQWxCbkIsQ0FBQTs7QUFBQSwwQkEyQkEsT0FBQSxHQUFTLFNBQUMsSUFBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FEQSxDQUFBO2FBRUEseUNBQU0sSUFBTixFQUhPO0lBQUEsQ0EzQlQsQ0FBQTs7dUJBQUE7O0tBRHdCLFVBSDFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex-view-model.coffee
