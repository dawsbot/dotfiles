(function() {
  var CompositeDisposable, Disposable, Ex, ExMode, ExState, GlobalExState, _ref;

  GlobalExState = require('./global-ex-state');

  ExState = require('./ex-state');

  Ex = require('./ex');

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = ExMode = {
    activate: function(state) {
      this.globalExState = new GlobalExState;
      this.disposables = new CompositeDisposable;
      this.exStates = new WeakMap;
      return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var element, exState;
          if (editor.mini) {
            return;
          }
          element = atom.views.getView(editor);
          if (!_this.exStates.get(editor)) {
            exState = new ExState(element, _this.globalExState);
            _this.exStates.set(editor, exState);
            return _this.disposables.add(new Disposable(function() {
              return exState.destroy();
            }));
          }
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    provideEx: function() {
      return {
        registerCommand: Ex.registerCommand.bind(Ex),
        registerAlias: Ex.registerAlias.bind(Ex)
      };
    },
    consumeVim: function(vim) {
      this.vim = vim;
      return this.globalExState.setVim(vim);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2V4LW1vZGUvbGliL2V4LW1vZGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVIsQ0FBaEIsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQURWLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBSGIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQUEsR0FDZjtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsYUFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxHQUFBLENBQUEsbUJBRGYsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxHQUFBLENBQUEsT0FGWixDQUFBO2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO0FBQ2pELGNBQUEsZ0JBQUE7QUFBQSxVQUFBLElBQVUsTUFBTSxDQUFDLElBQWpCO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQUEsVUFFQSxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRlYsQ0FBQTtBQUlBLFVBQUEsSUFBRyxDQUFBLEtBQUssQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLE1BQWQsQ0FBUDtBQUNFLFlBQUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUNaLE9BRFksRUFFWixLQUFDLENBQUEsYUFGVyxDQUFkLENBQUE7QUFBQSxZQUtBLEtBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLE1BQWQsRUFBc0IsT0FBdEIsQ0FMQSxDQUFBO21CQU9BLEtBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFxQixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7cUJBQzlCLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFEOEI7WUFBQSxDQUFYLENBQXJCLEVBUkY7V0FMaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFqQixFQUxRO0lBQUEsQ0FBVjtBQUFBLElBcUJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURVO0lBQUEsQ0FyQlo7QUFBQSxJQXdCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGVBQUEsRUFBaUIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFuQixDQUF3QixFQUF4QixDQUFqQjtBQUFBLFFBQ0EsYUFBQSxFQUFlLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBakIsQ0FBc0IsRUFBdEIsQ0FEZjtRQURTO0lBQUEsQ0F4Qlg7QUFBQSxJQTRCQSxVQUFBLEVBQVksU0FBQyxHQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxHQUFELEdBQU8sR0FBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLEdBQXRCLEVBRlU7SUFBQSxDQTVCWjtHQU5GLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/ex-mode/lib/ex-mode.coffee
