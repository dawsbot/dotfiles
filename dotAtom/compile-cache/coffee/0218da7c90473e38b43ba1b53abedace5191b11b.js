(function() {
  var $, CompositeDisposable, GitStashSave, InputView, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, TextEditorView = _ref.TextEditorView, View = _ref.View;

  GitStashSave = require('../models/git-stash-save');

  InputView = (function(_super) {
    __extends(InputView, _super);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Stash message'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      var currentPane, disposables, panel;
      disposables = new CompositeDisposable;
      currentPane = atom.workspace.getActivePane();
      panel = atom.workspace.addModalPanel({
        item: this
      });
      panel.show();
      this.commandEditor.focus();
      disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            if (panel != null) {
              panel.destroy();
            }
            currentPane.activate();
            return disposables.dispose();
          };
        })(this)
      }));
      return disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          disposables.dispose();
          if (panel != null) {
            panel.destroy();
          }
          GitStashSave(repo, {
            message: _this.commandEditor.getText()
          });
          return currentPane.activate();
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = InputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi92aWV3cy9zdGFzaC1tZXNzYWdlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUEsQ0FBRCxFQUFJLHNCQUFBLGNBQUosRUFBb0IsWUFBQSxJQURwQixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSwwQkFBUixDQUhmLENBQUE7O0FBQUEsRUFLTTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxPQUFELENBQVMsZUFBVCxFQUE4QixJQUFBLGNBQUEsQ0FBZTtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxZQUFZLGVBQUEsRUFBaUIsZUFBN0I7V0FBZixDQUE5QixFQURHO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHdCQUlBLFVBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFVBQUEsK0JBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxHQUFBLENBQUEsbUJBQWQsQ0FBQTtBQUFBLE1BQ0EsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBRGQsQ0FBQTtBQUFBLE1BRUEsS0FBQSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47T0FBN0IsQ0FGUixDQUFBO0FBQUEsTUFHQSxLQUFLLENBQUMsSUFBTixDQUFBLENBSEEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxLQUFmLENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFNQSxXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLENBQUQsR0FBQTs7Y0FDbkUsS0FBSyxDQUFFLE9BQVAsQ0FBQTthQUFBO0FBQUEsWUFDQSxXQUFXLENBQUMsUUFBWixDQUFBLENBREEsQ0FBQTttQkFFQSxXQUFXLENBQUMsT0FBWixDQUFBLEVBSG1FO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUF0QyxDQUFoQixDQU5BLENBQUE7YUFXQSxXQUFXLENBQUMsR0FBWixDQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGNBQXRDLEVBQXNELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNwRSxVQUFBLFdBQVcsQ0FBQyxPQUFaLENBQUEsQ0FBQSxDQUFBOztZQUNBLEtBQUssQ0FBRSxPQUFQLENBQUE7V0FEQTtBQUFBLFVBRUEsWUFBQSxDQUFhLElBQWIsRUFBbUI7QUFBQSxZQUFBLE9BQUEsRUFBUyxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxDQUFUO1dBQW5CLENBRkEsQ0FBQTtpQkFHQSxXQUFXLENBQUMsUUFBWixDQUFBLEVBSm9FO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0FBaEIsRUFaVTtJQUFBLENBSlosQ0FBQTs7cUJBQUE7O0tBRHNCLEtBTHhCLENBQUE7O0FBQUEsRUE0QkEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0E1QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/git-plus/lib/views/stash-message-view.coffee
