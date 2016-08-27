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
          title = "" + ev.lang + " - " + (ev.filename + (ev.lineNumber != null ? ":" + ev.lineNumber : void 0));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvdmlldy1ydW50aW1lLW9ic2VydmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNkJBQUUsSUFBRixFQUFTLGFBQVQsR0FBQTtBQUFtRCxNQUFsRCxJQUFDLENBQUEsT0FBQSxJQUFpRCxDQUFBO0FBQUEsTUFBM0MsSUFBQyxDQUFBLHdDQUFBLGdCQUFnQixHQUFBLENBQUEsbUJBQTBCLENBQW5EO0lBQUEsQ0FBYjs7QUFBQSxrQ0FFQSxPQUFBLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNqQyxLQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCLENBQW5CLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ25DLEtBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFBLEVBRG1DO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsQ0FBbkIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIs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

//# sourceURL=/Users/dawsonbotsford/.atom/packages/script/lib/view-runtime-observer.coffee
