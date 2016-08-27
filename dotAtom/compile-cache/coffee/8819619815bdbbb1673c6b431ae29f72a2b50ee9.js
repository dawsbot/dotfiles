(function() {
  var CompositeDisposable, ViewRuntimeObserver;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ViewRuntimeObserver = (function() {
    function ViewRuntimeObserver(view, subscriptions) {
      this.view = view;
      this.subscriptions = subscriptions != null ? subscriptions : new CompositeDisposable;
    }

    ViewRuntimeObserver.prototype.observe = function(runtime) {
      this.subscriptions.add(runtime.onStart((function(_this) {
        return function() {
          return _this.view.resetView();
        };
      })(this)));
      this.subscriptions.add(runtime.onStarted((function(_this) {
        return function(ev) {
          return _this.view.commandContext = ev;
        };
      })(this)));
      this.subscriptions.add(runtime.onStopped((function(_this) {
        return function() {
          return _this.view.stop();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStderr((function(_this) {
        return function(ev) {
          return _this.view.display('stderr', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStdout((function(_this) {
        return function(ev) {
          return _this.view.display('stdout', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidExit((function(_this) {
        return function(ev) {
          return _this.view.setHeaderAndShowExecutionTime(ev.returnCode, ev.executionTime);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotRun((function(_this) {
        return function(ev) {
          return _this.view.showUnableToRunError(ev.command);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidContextCreate((function(_this) {
        return function(ev) {
          var title;
          title = ("" + ev.lang + " - ") + ev.filename + (ev.lineNumber != null ? ":" + ev.lineNumber : '');
          return _this.view.setHeaderTitle(title);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSpecifyLanguage((function(_this) {
        return function() {
          return _this.view.showNoLanguageSpecified();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportLanguage((function(_this) {
        return function(ev) {
          return _this.view.showLanguageNotSupported(ev.lang);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportMode((function(_this) {
        return function(ev) {
          return _this.view.createGitHubIssueLink(ev.argType, ev.lang);
        };
      })(this)));
      return this.subscriptions.add(runtime.onDidNotBuildArgs((function(_this) {
        return function(ev) {
          return _this.view.handleError(ev.error);
        };
      })(this)));
    };

    ViewRuntimeObserver.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return ViewRuntimeObserver;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvdmlldy1ydW50aW1lLW9ic2VydmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNkJBQUUsSUFBRixFQUFTLGFBQVQsR0FBQTtBQUFtRCxNQUFsRCxJQUFDLENBQUEsT0FBQSxJQUFpRCxDQUFBO0FBQUEsTUFBM0MsSUFBQyxDQUFBLHdDQUFBLGdCQUFnQixHQUFBLENBQUEsbUJBQTBCLENBQW5EO0lBQUEsQ0FBYjs7QUFBQSxrQ0FFQSxPQUFBLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqQyxLQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDbkMsS0FBQyxDQUFBLElBQUksQ0FBQyxjQUFOLEdBQXVCLEdBRFk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsU0FBUixDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNuQyxLQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxFQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLENBQW5CLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxrQkFBUixDQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQzVDLEtBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFFBQWQsRUFBd0IsRUFBRSxDQUFDLE9BQTNCLEVBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBbkIsQ0FOQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGtCQUFSLENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsUUFBZCxFQUF3QixFQUFFLENBQUMsT0FBM0IsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFuQixDQVJBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsU0FBUixDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQ25DLEtBQUMsQ0FBQSxJQUFJLENBQUMsNkJBQU4sQ0FBb0MsRUFBRSxDQUFDLFVBQXZDLEVBQW1ELEVBQUUsQ0FBQyxhQUF0RCxFQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLENBQW5CLENBVkEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDckMsS0FBQyxDQUFBLElBQUksQ0FBQyxvQkFBTixDQUEyQixFQUFFLENBQUMsT0FBOUIsRUFEcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUFuQixDQVpBLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsa0JBQVIsQ0FBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsRUFBRCxHQUFBO0FBQzVDLGNBQUEsS0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLENBQUEsRUFBQSxHQUFHLEVBQUUsQ0FBQyxJQUFOLEdBQVcsS0FBWCxDQUFBLEdBQWtCLEVBQUUsQ0FBQyxRQUFyQixHQUFnQyxDQUFJLHFCQUFILEdBQXdCLEdBQUEsR0FBRyxFQUFFLENBQUMsVUFBOUIsR0FBZ0QsRUFBakQsQ0FBeEMsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBSSxDQUFDLGNBQU4sQ0FBcUIsS0FBckIsRUFGNEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFuQixDQWRBLENBQUE7QUFBQSxNQWlCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLHVCQUFSLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxJQUFJLENBQUMsdUJBQU4sQ0FBQSxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBQW5CLENBakJBLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLHVCQUFSLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDakQsS0FBQyxDQUFBLElBQUksQ0FBQyx3QkFBTixDQUErQixFQUFFLENBQUMsSUFBbEMsRUFEaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxDQUFuQixDQW5CQSxDQUFBO0FBQUEsTUFxQkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxtQkFBUixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQzdDLEtBQUMsQ0FBQSxJQUFJLENBQUMscUJBQU4sQ0FBNEIsRUFBRSxDQUFDLE9BQS9CLEVBQXdDLEVBQUUsQ0FBQyxJQUEzQyxFQUQ2QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQW5CLENBckJBLENBQUE7YUF1QkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxpQkFBUixDQUEwQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQzNDLEtBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixFQUFFLENBQUMsS0FBckIsRUFEMkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFuQixFQXhCTztJQUFBLENBRlQsQ0FBQTs7QUFBQSxrQ0E2QkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBQTt1REFBYyxDQUFFLE9BQWhCLENBQUEsV0FETztJQUFBLENBN0JULENBQUE7OytCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/view-runtime-observer.coffee
