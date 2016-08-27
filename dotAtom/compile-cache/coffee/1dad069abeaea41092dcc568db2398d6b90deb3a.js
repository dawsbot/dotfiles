(function() {
  var CliStatusView;

  CliStatusView = require('./cli-status-view');

  module.exports = {
    cliStatusView: null,
    activate: function(state) {
      var createStatusEntry;
      createStatusEntry = (function(_this) {
        return function() {
          return _this.cliStatusView = new CliStatusView(state.cliStatusViewState);
        };
      })(this);
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          return createStatusEntry();
        };
      })(this));
    },
    deactivate: function() {
      return this.cliStatusView.destroy();
    },
    config: {
      WindowHeight: {
        type: 'integer',
        "default": 300
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2Rhd3NvbmJvdHNmb3JkLy5hdG9tL3BhY2thZ2VzL3Rlcm1pbmFsLXN0YXR1cy9saWIvY2xpLXN0YXR1cy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsYUFBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBQWhCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ04sVUFBQSxpQkFBQTtBQUFBLE1BQUEsaUJBQUEsR0FBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDaEIsS0FBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQWMsS0FBSyxDQUFDLGtCQUFwQixFQURMO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsQ0FBQTthQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQWQsQ0FBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxpQkFBQSxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxFQUhNO0lBQUEsQ0FGVjtBQUFBLElBT0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFE7SUFBQSxDQVBaO0FBQUEsSUFVQSxNQUFBLEVBQ0k7QUFBQSxNQUFBLFlBQUEsRUFDSTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxHQURUO09BREo7S0FYSjtHQUhKLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/dawsonbotsford/.atom/packages/terminal-status/lib/cli-status.coffee
