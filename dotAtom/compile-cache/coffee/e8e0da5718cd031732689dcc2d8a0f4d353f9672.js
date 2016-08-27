(function() {
  var ExNormalModeInputElement, Input, ViewModel;

  ExNormalModeInputElement = require('./ex-normal-mode-input-element');

  ViewModel = (function() {
    function ViewModel(command, opts) {
      var _ref;
      this.command = command;
      if (opts == null) {
        opts = {};
      }
      _ref = this.command, this.editor = _ref.editor, this.exState = _ref.exState;
      this.view = new ExNormalModeInputElement().initialize(this, opts);
      this.editor.normalModeInputView = this.view;
      this.exState.onDidFailToExecute((function(_this) {
        return function() {
          return _this.view.remove();
        };
      })(this));
      this.done = false;
    }

    ViewModel.prototype.confirm = function(view) {
      this.exState.pushOperations(new Input(this.view.value));
      return this.done = true;
    };

    ViewModel.prototype.cancel = function(view) {
      if (!this.done) {
        this.exState.pushOperations(new Input(''));
        return this.done = true;
      }
    };

    return ViewModel;

  })();

  Input = (function() {
    function Input(characters) {
      this.characters = characters;
    }

    return Input;

  })();

  module.exports = {
    ViewModel: ViewModel,
    Input: Input
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL3ZpZXctbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLGdDQUFSLENBQTNCLENBQUE7O0FBQUEsRUFFTTtBQUNTLElBQUEsbUJBQUUsT0FBRixFQUFXLElBQVgsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBOztRQURzQixPQUFLO09BQzNCO0FBQUEsTUFBQSxPQUFzQixJQUFDLENBQUEsT0FBdkIsRUFBQyxJQUFDLENBQUEsY0FBQSxNQUFGLEVBQVUsSUFBQyxDQUFBLGVBQUEsT0FBWCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsd0JBQUEsQ0FBQSxDQUEwQixDQUFDLFVBQTNCLENBQXNDLElBQXRDLEVBQXlDLElBQXpDLENBRlosQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixHQUE4QixJQUFDLENBQUEsSUFIL0IsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxrQkFBVCxDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FMUixDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFRQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUE0QixJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQVosQ0FBNUIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUZEO0lBQUEsQ0FSVCxDQUFBOztBQUFBLHdCQVlBLE1BQUEsR0FBUSxTQUFDLElBQUQsR0FBQTtBQUNOLE1BQUEsSUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFSO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBNEIsSUFBQSxLQUFBLENBQU0sRUFBTixDQUE1QixDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBRlY7T0FETTtJQUFBLENBWlIsQ0FBQTs7cUJBQUE7O01BSEYsQ0FBQTs7QUFBQSxFQW9CTTtBQUNTLElBQUEsZUFBRSxVQUFGLEdBQUE7QUFBZSxNQUFkLElBQUMsQ0FBQSxhQUFBLFVBQWEsQ0FBZjtJQUFBLENBQWI7O2lCQUFBOztNQXJCRixDQUFBOztBQUFBLEVBdUJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFDZixXQUFBLFNBRGU7QUFBQSxJQUNKLE9BQUEsS0FESTtHQXZCakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/view-model.coffee
