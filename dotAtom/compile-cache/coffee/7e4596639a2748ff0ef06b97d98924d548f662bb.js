(function() {
  var AutoComplete, Ex, ExViewModel, Input, ViewModel, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./view-model'), ViewModel = _ref.ViewModel, Input = _ref.Input;

  AutoComplete = require('./autocomplete');

  Ex = require('./ex');

  module.exports = ExViewModel = (function(_super) {
    __extends(ExViewModel, _super);

    function ExViewModel(exCommand, withSelection) {
      this.exCommand = exCommand;
      this.confirm = __bind(this.confirm, this);
      this.decreaseHistoryEx = __bind(this.decreaseHistoryEx, this);
      this.increaseHistoryEx = __bind(this.increaseHistoryEx, this);
      this.tabAutocomplete = __bind(this.tabAutocomplete, this);
      ExViewModel.__super__.constructor.call(this, this.exCommand, {
        "class": 'command'
      });
      this.historyIndex = -1;
      if (withSelection) {
        this.view.editorElement.getModel().setText("'<,'>");
      }
      this.view.editorElement.addEventListener('keydown', this.tabAutocomplete);
      atom.commands.add(this.view.editorElement, 'core:move-up', this.increaseHistoryEx);
      atom.commands.add(this.view.editorElement, 'core:move-down', this.decreaseHistoryEx);
      this.autoComplete = new AutoComplete(Ex.getCommands());
    }

    ExViewModel.prototype.restoreHistory = function(index) {
      return this.view.editorElement.getModel().setText(this.history(index).value);
    };

    ExViewModel.prototype.history = function(index) {
      return this.exState.getExHistoryItem(index);
    };

    ExViewModel.prototype.tabAutocomplete = function(event) {
      var completed;
      if (event.keyCode === 9) {
        event.stopPropagation();
        event.preventDefault();
        completed = this.autoComplete.getAutocomplete(this.view.editorElement.getModel().getText());
        if (completed) {
          this.view.editorElement.getModel().setText(completed);
        }
        return false;
      } else {
        return this.autoComplete.resetCompletion();
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LXZpZXctbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBcUIsT0FBQSxDQUFRLGNBQVIsQ0FBckIsRUFBQyxpQkFBQSxTQUFELEVBQVksYUFBQSxLQUFaLENBQUE7O0FBQUEsRUFDQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSLENBRGYsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBYSxJQUFBLHFCQUFFLFNBQUYsRUFBYSxhQUFiLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxZQUFBLFNBQ2IsQ0FBQTtBQUFBLCtDQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxNQUFBLDZDQUFNLElBQUMsQ0FBQSxTQUFQLEVBQWtCO0FBQUEsUUFBQSxPQUFBLEVBQU8sU0FBUDtPQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLENBQUEsQ0FEaEIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxhQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFwQixDQUFBLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsT0FBdkMsQ0FBQSxDQURGO09BSEE7QUFBQSxNQU1BLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFwQixDQUFxQyxTQUFyQyxFQUFnRCxJQUFDLENBQUEsZUFBakQsQ0FOQSxDQUFBO0FBQUEsTUFP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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex-view-model.coffee
